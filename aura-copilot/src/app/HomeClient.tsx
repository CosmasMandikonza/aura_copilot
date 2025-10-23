'use client'

import { useState } from 'react'
import AddressForm from './components/AddressForm'
import StrategyList from './components/StrategyList'

export default function HomeClient() {
  const [addr, setAddr] = useState<string>('')

  return (
    <main className="relative mx-auto max-w-7xl px-4 pt-10 md:pt-16">
      <AddressForm onAnalyze={setAddr} />
      <div className="mt-10 md:mt-12">
        <StrategyList address={addr} />
      </div>
    </main>
  )
}





