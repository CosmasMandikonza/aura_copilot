// src/app/HomeClient.tsx
'use client'

import { useState } from 'react'
import AddressForm from './components/AddressForm'
import StrategyList from './components/StrategyList'
import AIAnalysis from './components/AIAnalysis'
import Dashboard from './components/Dashboard'

export default function HomeClient() {
  const [addr, setAddr] = useState<string>('')

  return (
    <main>
      <AddressForm onAnalyze={setAddr} />
      {/* optional: only render when we have a valid hex (AddressForm resolves ENS) */}
      <AIAnalysis address={addr} />
      <StrategyList address={addr} />
    </main>
  )
}


