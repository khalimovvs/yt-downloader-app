import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE = import.meta.env.VITE_API_URL || ''

export default function SearchBar({ onVideoData, onLoading, loading }) {
  const [url, setUrl] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = url.trim()

    if (!trimmed) {
      toast.error("YouTube URL kiriting!")
      return
    }

    // Basic YouTube URL check
    const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)[\w-]{11}/
    if (!ytRegex.test(trimmed)) {
      toast.error("To'g'ri YouTube URL kiriting!")
      return
    }

    onLoading(true)
    onVideoData(null)

    try {
      const res = await axios.get(`${API_BASE}/api/info`, {
        params: { url: trimmed },
        timeout: 60000,
      })
      onVideoData({ ...res.data, url: trimmed })
      toast.success("Video topildi!")
    } catch (err) {
      const msg = err.response?.data?.error || "Video ma'lumotlarini olishda xatolik"
      toast.error(msg)
      onVideoData(null)
    } finally {
      onLoading(false)
    }
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setUrl(text)
    } catch {
      // silently fail
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="glass-card p-2 glow-red">
        <div className="flex gap-2 items-center">
          {/* YouTube Icon */}
          <div className="flex-shrink-0 pl-3">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>

          {/* Input */}
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="YouTube URL manzilini kiriting (masalan: https://youtu.be/...)"
            className="flex-1 bg-transparent text-white placeholder-gray-600 text-sm py-3 focus:outline-none"
            disabled={loading}
          />

          {/* Paste button */}
          {!url && (
            <button
              type="button"
              onClick={handlePaste}
              className="flex-shrink-0 text-gray-500 hover:text-gray-300 transition-colors text-xs px-3 py-2 hover:bg-white/5 rounded-lg"
            >
              Joylash
            </button>
          )}

          {/* Clear button */}
          {url && !loading && (
            <button
              type="button"
              onClick={() => setUrl('')}
              className="flex-shrink-0 text-gray-500 hover:text-gray-300 transition-colors p-2 hover:bg-white/5 rounded-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center gap-2 flex-shrink-0 text-sm px-5 py-3"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Izlanmoqda...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Qidirish
              </>
            )}
          </button>
        </div>
      </div>

      {/* Helper text */}
      <p className="text-center text-gray-600 text-xs mt-3">
        youtube.com/watch?v=... • youtu.be/... • YouTube Shorts — hammasi ishlaydi
      </p>
    </form>
  )
}
