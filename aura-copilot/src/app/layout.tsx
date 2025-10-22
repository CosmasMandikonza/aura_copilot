import './globals.css'

export const metadata = {
  title: 'AURA Copilot — AI-Powered DeFi Intelligence',
  description: 'Discover hidden opportunities worth thousands. AI analyzes your wallet in seconds.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

        <nav className="relative z-10 border-b border-white/10 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="text-2xl">🔮</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">AURA Copilot</h1>
                <p className="text-xs text-purple-300">AI-Powered DeFi Intelligence</p>
              </div>
            </div>
            <a href="/bookmarks" className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors text-sm font-medium">
              📌 Watchlist
            </a>
          </div>
        </nav>

        <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
          {children}
        </main>

        {/* animated gradient orbs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </body>
    </html>
  )
}

