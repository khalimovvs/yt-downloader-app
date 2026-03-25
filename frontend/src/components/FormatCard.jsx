import { useState } from 'react'
import toast from 'react-hot-toast'

const API_BASE = import.meta.env.VITE_API_URL || ''

function getVideoColors(height) {
  if (height >= 2160) return { bg: 'from-yellow-500/20 to-amber-500/20', border: 'border-yellow-500/30', badge: 'bg-yellow-500/20 text-yellow-300', label: '4K' }
  if (height >= 1440) return { bg: 'from-purple-500/20 to-violet-500/20', border: 'border-purple-500/30', badge: 'bg-purple-500/20 text-purple-300', label: '2K' }
  if (height >= 1080) return { bg: 'from-blue-500/20 to-indigo-500/20', border: 'border-blue-500/30', badge: 'bg-blue-500/20 text-blue-300', label: 'FHD' }
  if (height >= 720)  return { bg: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/30', badge: 'bg-emerald-500/20 text-emerald-300', label: 'HD' }
  if (height >= 480)  return { bg: 'from-orange-500/20 to-amber-500/20', border: 'border-orange-500/30', badge: 'bg-orange-500/20 text-orange-300', label: 'SD' }
  return { bg: 'from-gray-500/20 to-slate-500/20', border: 'border-gray-500/30', badge: 'bg-gray-500/20 text-gray-300', label: 'SD' }
}

const audioColors = {
  bg: 'from-purple-500/20 to-pink-500/20',
  border: 'border-purple-500/30',
  badge: 'bg-purple-500/20 text-purple-300',
}

export default function FormatCard({ format, url, title, index, formatFileSize }) {
  const [downloading, setDownloading] = useState(false)

  const isAudio = format.type === 'audio'
  const colors = isAudio
    ? audioColors
    : getVideoColors(format.height || 0)

  const handleDownload = async () => {
    setDownloading(true)
    toast.loading('Yuklab olish boshlanmoqda...', { id: 'download-' + index })

    try {
      const params = new URLSearchParams({
        url,
        format: format.format_id,
        ext: format.ext,
        title: title || 'video',
        ...(format.isMP3 ? { isMP3: 'true' } : {}),
      })

      const downloadUrl = `${API_BASE}/api/download?${params.toString()}`

      // Create a hidden anchor and click it for proper file download
      const link = document.createElement('a')
      link.href = downloadUrl
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success('Yuklab olish boshlandi!', { id: 'download-' + index })
    } catch (err) {
      toast.error('Yuklab olishda xatolik!', { id: 'download-' + index })
    } finally {
      setTimeout(() => setDownloading(false), 3000)
    }
  }

  const fileSize = formatFileSize(format.filesize)

  return (
    <div
      className={`glass-card-hover bg-gradient-to-br ${colors.bg} ${colors.border} 
                  p-4 flex flex-col gap-3 cursor-pointer group`}
      style={{ animationDelay: `${index * 80}ms` }}
      onClick={handleDownload}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          {/* Quality label */}
          <span className="text-white font-bold text-xl leading-none">
            {isAudio ? (format.isMP3 ? 'MP3' : format.quality) : format.quality}
          </span>
          {/* Format ext */}
          <span className="text-gray-400 text-xs uppercase font-mono tracking-wider">
            {format.ext}
          </span>
        </div>

        {/* Badge */}
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors.badge} flex-shrink-0`}>
          {isAudio
            ? (format.isMP3 ? 'BEST' : 'AAC')
            : (colors.label || 'SD')}
        </span>
      </div>

      {/* File size & fps */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        {!isAudio && format.fps && (
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {format.fps}fps
          </span>
        )}
        {fileSize && (
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
            ~{fileSize}
          </span>
        )}
        {!fileSize && (
          <span className="text-gray-600 italic">Hajm noma'lum</span>
        )}
      </div>

      {/* Download button */}
      <button
        className={`
          w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold
          transition-all duration-300
          ${downloading
            ? 'bg-white/10 text-gray-400 cursor-wait'
            : 'bg-white/10 text-white hover:bg-red-600 hover:shadow-md hover:shadow-red-500/30 group-hover:bg-red-600'
          }
        `}
        disabled={downloading}
        onClick={e => { e.stopPropagation(); handleDownload() }}
      >
        {downloading ? (
          <>
            <svg className="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Yuklanmoqda...
          </>
        ) : (
          <>
            <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Yuklab olish
          </>
        )}
      </button>
    </div>
  )
}
