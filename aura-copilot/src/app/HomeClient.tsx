// src/app/HomeClient.tsx
'use client'

import { useState } from 'react'
import AddressForm from './components/AddressForm'
import StrategyList from './components/StrategyList'
import AIAnalysis from './components/AIAnalysis'

export default function HomeClient() {
  const [addr, setAddr] = useState('')
  return (
    <main>
      <AddressForm onAnalyze={setAddr} />
      {addr ? <AIAnalysis address={addr} /> : null}
      <StrategyList address={addr} />
    </main>
  )
}



