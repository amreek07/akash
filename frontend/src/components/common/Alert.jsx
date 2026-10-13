const tones = {
  error: 'border-red-200 bg-red-50 text-red-700',
  success: 'border-primary/20 bg-primary/10 text-heading',
  info: 'border-logo/15 bg-logo/5 text-heading',
}

export default function Alert({ tone = 'error', children }) {
  if (!children) return null

  return (
    <div role="alert" className={`rounded-lg border px-3 py-2.5 text-sm ${tones[tone]}`}>
      {children}
    </div>
  )
}
