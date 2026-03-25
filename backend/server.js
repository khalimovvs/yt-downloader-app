require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const YTDlpWrap = require('yt-dlp-wrap').default;
const ffmpegStatic = require('ffmpeg-static');

const app = express();
const PORT = process.env.PORT || 3001;

// yt-dlp binary path — Linux yoki Windows ga mos
const isWindows = process.platform === 'win32';
const ytDlpBinaryName = isWindows ? 'yt-dlp.exe' : 'yt-dlp';
const ytDlpBinaryPath = path.join(__dirname, ytDlpBinaryName);

// Initialize YTDlpWrap
let ytDlp;

async function initYtDlp() {
  try {
    if (!fs.existsSync(ytDlpBinaryPath)) {
      console.log('📥 yt-dlp binary yuklanmoqda...');
      await YTDlpWrap.downloadFromGithub(ytDlpBinaryPath);
      // Linux da execute permission berish
      if (!isWindows) {
        fs.chmodSync(ytDlpBinaryPath, 0o755);
      }
      console.log('✅ yt-dlp binary muvaffaqiyatli yuklandi!');
    } else {
      console.log('✅ yt-dlp binary mavjud.');
      if (!isWindows) {
        fs.chmodSync(ytDlpBinaryPath, 0o755);
      }
    }
    ytDlp = new YTDlpWrap(ytDlpBinaryPath);
  } catch (err) {
    console.error('❌ yt-dlp yuklashda xatolik:', err.message);
    // System yt-dlp orqali urinib ko'rish
    ytDlp = new YTDlpWrap('yt-dlp');
  }
}

// CORS configuration
const frontendUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, '') : null;
const allowedOrigins = frontendUrl
  ? [frontendUrl, 'http://localhost:5173', 'http://localhost:3000']
  : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// Helper: validate YouTube URL
function isValidYouTubeUrl(url) {
  const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)[\w-]{11}/;
  return ytRegex.test(url);
}

// GET /api/info?url=...
app.get('/api/info', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL kiritilmagan' });
  }

  if (!isValidYouTubeUrl(url)) {
    return res.status(400).json({ error: "Noto'g'ri YouTube URL" });
  }

  try {
    const metadata = await ytDlp.getVideoInfo(url);

    const videoFormats = [];
    const audioFormats = [];

    if (metadata.formats) {
      const seen = new Set();

      // Collect ALL unique resolutions (video-only streams + video+audio streams)
      // For each resolution, prefer video-only + bestaudio merge (higher quality)
      metadata.formats
        .filter(f => f.vcodec !== 'none' && f.height)
        .sort((a, b) => (b.height || 0) - (a.height || 0))
        .forEach(f => {
          const key = `${f.height}p`;
          if (!seen.has(key)) {
            seen.add(key);

            const hasAudio = f.acodec && f.acodec !== 'none';
            // Use +bestaudio merge for video-only streams, direct format for combined
            const formatId = hasAudio ? f.format_id : `${f.format_id}+bestaudio[ext=m4a]/bestaudio`;

            // Label 4K, 2K etc.
            let label = `${f.height}p`;
            if (f.height >= 2160) label = `4K (${f.height}p)`;
            else if (f.height >= 1440) label = `2K (${f.height}p)`;
            else if (f.height >= 1080) label = `Full HD (${f.height}p)`;
            else if (f.height >= 720) label = `HD (${f.height}p)`;

            videoFormats.push({
              format_id: formatId,
              ext: 'mp4',
              quality: label,
              height: f.height,
              fps: f.fps || 30,
              filesize: f.filesize || f.filesize_approx || null,
              type: 'video'
            });
          }
        });

      // Audio formats (m4a / webm)
      metadata.formats
        .filter(f => f.vcodec === 'none' && f.acodec !== 'none')
        .sort((a, b) => (b.abr || 0) - (a.abr || 0))
        .slice(0, 3)
        .forEach(f => {
          audioFormats.push({
            format_id: f.format_id,
            ext: f.ext || 'm4a',
            quality: f.abr ? `${Math.round(f.abr)}kbps` : 'Audio',
            filesize: f.filesize || f.filesize_approx || null,
            acodec: f.acodec,
            type: 'audio'
          });
        });
    }

    // Always add MP3 option at top
    audioFormats.unshift({
      format_id: 'bestaudio',
      ext: 'mp3',
      quality: 'MP3 (Best)',
      filesize: null,
      type: 'audio',
      isMP3: true
    });

    res.json({
      id: metadata.id,
      title: metadata.title,
      thumbnail: metadata.thumbnail,
      duration: metadata.duration,
      duration_string: metadata.duration_string,
      uploader: metadata.uploader || metadata.channel,
      view_count: metadata.view_count,
      upload_date: metadata.upload_date,
      description: metadata.description ? metadata.description.slice(0, 200) : '',
      formats: {
        video: videoFormats.slice(0, 8),
        audio: audioFormats.slice(0, 4)
      }
    });
  } catch (err) {
    console.error('Info error:', err.message);
    res.status(500).json({ error: 'Video ma\'lumotlarini olishda xatolik: ' + err.message });
  }
});

// GET /api/download?url=...&format=...&ext=...&title=...&isMP3=...
app.get('/api/download', async (req, res) => {
  const { url, format, ext, title, isMP3 } = req.query;

  if (!url || !format) {
    return res.status(400).json({ error: 'URL yoki format kiritilmagan' });
  }

  if (!isValidYouTubeUrl(url)) {
    return res.status(400).json({ error: "Noto'g'ri YouTube URL" });
  }

  try {
    const safeTitle = (title || 'video').replace(/[^\w\s-]/g, '').trim().slice(0, 80);
    const fileExt = ext || 'mp4';
    const filename = `${safeTitle}.${fileExt}`;

    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`);
    res.setHeader('Content-Type', fileExt === 'mp3' || fileExt === 'm4a' ? 'audio/mpeg' : 'video/mp4');
    res.setHeader('Transfer-Encoding', 'chunked');

    const args = [];
    
    // Ffmpeg manzili (video va audio larni birlashtirish yoki mp3 ga konvertatsiya qilish uchun)
    args.push('--ffmpeg-location', ffmpegStatic);

    // Bot qulflarini aylanib o'tish (YouTube ni chalg'itish uchun mijozni Android qilib ko'rsatamiz)
    args.push('--extractor-args', 'youtube:player_client=android');

    if (isMP3 === 'true') {
      args.push(
        url,
        '-f', 'bestaudio',
        '--extract-audio',
        '--audio-format', 'mp3',
        '--audio-quality', '0',
        '-o', '-'
      );
    } else {
      args.push(
        url,
        '-f', format,
        '--merge-output-format', 'mp4',
        '-o', '-'
      );
    }

    const ytDlpProcess = ytDlp.execStream(args);

    ytDlpProcess.pipe(res);

    ytDlpProcess.on('error', (err) => {
      console.error('Download stream error:', err.message);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Yuklab olishda xatolik' });
      }
    });

    req.on('close', () => {
      ytDlpProcess.destroy();
    });
  } catch (err) {
    console.error('Download error:', err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Yuklab olishda xatolik: ' + err.message });
    }
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'YouTube Downloader API ishlayapti' });
});

// Start server
initYtDlp().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server http://localhost:${PORT} da ishlamoqda`);
    console.log(`📡 API endpoints:`);
    console.log(`   GET /api/info?url=<youtube_url>`);
    console.log(`   GET /api/download?url=<youtube_url>&format=<format_id>`);
  });
});
