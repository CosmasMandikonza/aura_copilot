// src/app/components/DemoMenu.tsx
'use client'
export default function DemoMenu({ onPick }:{ onPick:(s:string)=>void }) {
  const presets = [
    'vitalik.eth',
    '0x0000000000000000000000000000000000000000',
    // add addresses you know will produce nice output
  ]
  return (
    <div className="flex gap-2 flex-wrap text-xs text-slate-500">
      {presets.map(p=>(
        <button key={p} type="button" className="underline" onClick={()=>onPick(p)}>
          Demo: {p}
        </button>
      ))}
    </div>
  )
}
