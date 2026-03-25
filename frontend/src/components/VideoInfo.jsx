import FormatCard from './FormatCard'

function formatDuration(seconds) {
  if (!seconds) return '--:--'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

function formatViews(n) {
  if (!n) return '—'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M ko'rilgan`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K ko'rilgan`
  return `${n} ko'rilgan`
}

function formatFileSize(bytes) {
  if (!bytes) return null
  if (bytes >= 1_073_741_824) return `${(bytes / 1_073_741_824).toFixed(1)} GB`
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(1)} MB`
  return `${(bytes / 1024).toFixed(0)} KB`
}

export default function VideoInfo({ data }) {
  const { title, thumbnail, duration, uploader, view_count, formats, url } = data

  return (
    <div className="animate-slide-up space-y-5">
      {/* Video Card */}
      <div className="glass-card p-5 glow-red">
        <div className="flex flex-col sm:flex-row gap-5">
          {/* Thumbnail */}
          <div className="relative flex-shrink-0 group">
            <img
              src={thumbnail}
              alt={title}
              className="w-full sm:w-52 h-auto sm:h-32 object-cover rounded-xl"
            />
            {/* Duration badge */}
            {duration && (
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-mono px-2 py-0.5 rounded-md">
                {formatDuration(duration)}
              </div>
            )}
            {/* Play icon overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-12 h-12 bg-red-600/90 rounded-full flex items-center justify-center shadow-xl">
                <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <h2 className="text-white font-semibold text-base leading-snug line-clamp-2 mb-2">
                {title}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {uploader || 'Noma\'lum'}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {formatViews(view_count)}
                </span>
              </div>
            </div>

            {/* YouTube link */}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors mt-3 w-fit"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              YouTube'da ochish
            </a>
          </div>
        </div>
      </div>

      {/* Formats Section */}
      <div>
        {/* Video Formats */}
        {formats?.video?.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="text-white font-semibold text-sm">Video Formatlar</span>
              <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                {formats.video.length} ta variant
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {formats.video.map((fmt, i) => (
                <FormatCard
                  key={fmt.format_id}
                  format={fmt}
                  url={url}
                  title={title}
                  index={i}
                  formatFileSize={formatFileSize}
                />
              ))}
            </div>
          </div>
        )}

        {/* Audio Formats */}
        {formats?.audio?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <span className="text-white font-semibold text-sm">Audio Formatlar</span>
              <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                {formats.audio.length} ta variant
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {formats.audio.map((fmt, i) => (
                <FormatCard
                  key={fmt.format_id + '_audio'}
                  format={fmt}
                  url={url}
                  title={title}
                  index={i}
                  formatFileSize={formatFileSize}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
