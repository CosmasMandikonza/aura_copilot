// aura-copilot/src/app/HomeClient.tsx
'use client';

import { useState } from 'react';
import AddressForm from './components/AddressForm';
import StrategyList from './components/StrategyList';

type HomeClientProps = {
  /** Accept (and ignore) this DOM-only prop to satisfy TS when passed from page.tsx */
  suppressHydrationWarning?: boolean;
};

export default function HomeClient(_props: HomeClientProps) {
  const [addr, setAddr] = useState<string>('');

  return (
    <main className="relative mx-auto max-w-7xl px-4 pt-10 md:pt-16">
      <AddressForm onAnalyze={setAddr} />
      <div className="mt-10 md:mt-12">
        <StrategyList address={addr} />
      </div>
    </main>
  );
}




