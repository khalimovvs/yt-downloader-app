import { useState } from 'react'
import SearchBar from './components/SearchBar'
import VideoInfo from './components/VideoInfo'
import Hero from './components/Hero'
import Footer from './components/Footer'

function App() {
  const [videoData, setVideoData] = useState(null)
  const [loading, setLoading] = useState(false)

  return (
    <div className="min-h-screen relative">
      {/* Animated Background Orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      {/* Grid pattern overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Main Layout */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-red-600 to-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.56V6.82a4.85 4.85 0 01-1.07-.13z"/>
              </svg>
            </div>
            <div>
              <span className="text-white font-bold text-lg tracking-tight">YT<span className="gradient-text">Loader</span></span>
              <div className="text-xs text-gray-500 leading-none">Video Yuklovchi</div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="hidden sm:block text-gray-400 font-medium">
              Created by <span className="text-red-400">khalimovvs</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse inline-block" />
              Bepul & Tez
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center px-4 py-8 md:py-12">
          <Hero />

          {/* Search Section */}
          <div className="w-full max-w-3xl mt-8 mb-6">
            <SearchBar
              onVideoData={setVideoData}
              onLoading={setLoading}
              loading={loading}
            />
          </div>

          {/* Features (shown when no video) */}
          {!videoData && !loading && (
            <div className="w-full max-w-3xl animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {[
                  {
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    ),
                    title: 'Yuqori Tezlik',
                    desc: 'Videolar maksimal tezlikda yuklanadi',
                    color: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/20',
                    iconColor: 'text-yellow-400',
                  },
                  {
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ),
                    title: 'Barcha Formatlar',
                    desc: 'MP4 (4K/1080p/720p) va MP3 audio',
                    color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/20',
                    iconColor: 'text-emerald-400',
                  },
                  {
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    ),
                    title: 'Xavfsiz',
                    desc: 'Hech qanday ro\'yxatdan o\'tish kerak emas',
                    color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/20',
                    iconColor: 'text-blue-400',
                  },
                ].map((feature, i) => (
                  <div
                    key={i}
                    className={`glass-card bg-gradient-to-br ${feature.color} p-5 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1`}
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className={`${feature.iconColor}`}>{feature.icon}</div>
                    <div>
                      <div className="text-white font-semibold text-sm">{feature.title}</div>
                      <div className="text-gray-400 text-xs mt-1">{feature.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && (
            <div className="w-full max-w-3xl mt-6 animate-fade-in">
              <div className="glass-card p-6">
                <div className="flex gap-4 mb-5">
                  <div className="w-44 h-28 bg-white/10 rounded-xl shimmer flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-white/10 rounded-lg shimmer" />
                    <div className="h-4 bg-white/10 rounded-lg shimmer w-3/4" />
                    <div className="h-4 bg-white/10 rounded-lg shimmer w-1/2" />
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-20 bg-white/10 rounded-xl shimmer" />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Video Info */}
          {videoData && !loading && (
            <div className="w-full max-w-3xl mt-6">
              <VideoInfo data={videoData} />
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default App
