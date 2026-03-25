export default function Hero() {
  return (
    <div className="text-center max-w-2xl mx-auto animate-slide-up">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 text-red-400 text-xs font-medium mb-6">
        <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
        Bepul YouTube Yuklovchi
      </div>

      {/* Main Title */}
      <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
        YouTube Videolarni{' '}
        <span className="gradient-text">Yuklab Oling</span>
      </h1>

      {/* Subtitle */}
      <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-lg mx-auto">
        Istalgan YouTube videosini <span className="text-gray-200 font-medium">MP4</span> yoki{' '}
        <span className="text-gray-200 font-medium">MP3</span> formatida yuqori sifatda yuklab oling — tez va bepul.
      </p>

      {/* Stats row */}
      <div className="flex items-center justify-center gap-6 mt-8">
        {[
          { value: '4K', label: 'Maksimal sifat' },
          { value: '∞', label: 'Cheksiz yuklov' },
          { value: '0₽', label: 'Bepul' },
        ].map((stat, i) => (
          <div key={i} className="text-center">
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
