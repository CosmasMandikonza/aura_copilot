import './globals.css'
export const metadata = {
  title: 'AURA Copilot — Airdrop & Double-Dip Finder',
  description: 'Surface unclaimed airdrops and stacked yield from your on-chain activity.',
}
export default function RootLayout({ children }:{ children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold">AURA Copilot</h1>
          <p className="text-slate-600">Find unclaimed airdrops and double-dip opportunities.</p>
          <div className="mt-6">{children}</div>
        </div>
      </body>
    </html>
  )
}
