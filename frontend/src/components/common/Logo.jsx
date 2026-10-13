import { instituteName } from '@/constants/content'

function splitName(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length < 2) return [name.trim() || instituteName, '']
  const secondary = parts.pop()
  return [parts.join(' '), secondary.toUpperCase()]
}

function Cap() {
  return (
    <svg viewBox="0 0 24 24" className="h-[58%] w-[58%]" aria-hidden="true">
      <path fill="currentColor" d="M12 3.2 2.2 7.7 12 12.2l9.8-4.5L12 3.2Z" />
      <path fill="currentColor" d="M6.1 9.6v3.1c0 2.4 2.6 4.3 5.9 4.3s5.9-1.9 5.9-4.3V9.6L12 12.3 6.1 9.6Z" />
      <path stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" d="M19.4 8.1v5.4" />
      <circle cx="19.4" cy="14.8" r="1.2" fill="currentColor" />
    </svg>
  )
}

export default function Logo({ tone = 'dark', compact = false, name = instituteName, image = '' }) {
  const [primary, secondary] = splitName(name)
  const title = tone === 'light' ? 'text-white' : 'text-logo'
  const caption = tone === 'light' ? 'text-white/70' : 'text-muted'

  return (
    <div className={`flex items-center ${compact ? 'justify-center' : 'gap-3'}`}>
      <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-2xl bg-logo text-white">
        {image ? <img src={image} alt="" className="h-full w-full object-cover" /> : <Cap />}
      </span>
      {compact ? null : (
        <span className="min-w-0">
          <span className={`block text-[17px] font-bold leading-none tracking-tight ${title}`}>{primary}</span>
          {secondary ? (
            <span className={`mt-1 block text-[10px] font-semibold uppercase tracking-[0.28em] ${caption}`}>
              {secondary}
            </span>
          ) : null}
        </span>
      )}
    </div>
  )
}
