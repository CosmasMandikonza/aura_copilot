import { clsx } from 'clsx'

export default function Badge({ children, tone='neutral' }:{ children: React.ReactNode, tone?: 'neutral'|'success'|'warn'|'danger' }) {
  const map = {
    neutral: 'bg-slate-100 text-slate-700',
    success: 'bg-green-100 text-green-700',
    warn:    'bg-amber-100 text-amber-700',
    danger:  'bg-red-100 text-red-700',
  } as const
  return <span className={clsx('px-2 py-0.5 rounded text-xs font-medium', map[tone])}>{children}</span>
}
