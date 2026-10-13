import { instituteName } from '@/constants/content'
import { useAppSelector } from '@/store/hooks'

export default function Logo({ tone = 'dark', compact = false }) {
  const logo = useAppSelector((state) => state.content.general?.logo || '')
  const title = tone === 'light' ? 'text-white' : 'text-heading'
  const caption = tone === 'light' ? 'text-white/70' : 'text-muted'
  const [primary, secondary] = instituteName.split(/ (?=[^ ]+$)/)

  return (
    <div className={`flex items-center ${compact ? 'justify-center' : 'gap-3'}`}>
      <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-logo text-white shadow-[0_8px_20px_rgba(28,77,251,0.28)]">
        {logo ? (
          <img src={logo} alt="" className="h-full w-full object-cover" />
        ) : (
          <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden="true">
            <path
              fill="currentColor"
              d="M16 3.5 27 9.2v13.6L16 28.5 5 22.8V9.2L16 3.5Zm0 4.1L8.2 11.1v9.8L16 25.4l7.8-4.5v-9.8L16 7.6Z"
            />
            <circle cx="16" cy="16" r="2.3" fill="currentColor" />
          </svg>
        )}
      </span>
      {compact ? null : (
        <span className="min-w-0">
          <span className={`block text-[15px] font-semibold leading-tight tracking-tight ${title}`}>{primary}</span>
          <span className={`mt-0.5 block text-xs ${caption}`}>{secondary}</span>
        </span>
      )}
    </div>
  )
}
