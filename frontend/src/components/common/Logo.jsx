export default function Logo({ tone = 'dark', compact = false }) {
  const title = tone === 'light' ? 'text-white' : 'text-heading'
  const caption = tone === 'light' ? 'text-white/70' : 'text-muted'

  return (
    <div className={`flex items-center ${compact ? 'justify-center' : 'gap-3'}`}>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-logo text-white shadow-[0_8px_20px_rgba(28,77,251,0.28)]">
        <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden="true">
          <path
            fill="currentColor"
            d="M16 3.5 27 9.2v13.6L16 28.5 5 22.8V9.2L16 3.5Zm0 4.1L8.2 11.1v9.8L16 25.4l7.8-4.5v-9.8L16 7.6Z"
          />
          <circle cx="16" cy="16" r="2.3" fill="currentColor" />
        </svg>
      </span>
      {compact ? null : (
        <span className="min-w-0">
          <span className={`block text-[15px] font-semibold leading-none tracking-tight ${title}`}>
            Admin
          </span>
          <span className={`mt-1 block text-xs ${caption}`}>Control panel</span>
        </span>
      )}
    </div>
  )
}
