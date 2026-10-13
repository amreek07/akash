import { useLocation } from 'react-router-dom'
import Icon from '@/components/common/Icon'
import { useSidebar } from '@/context/useSidebar'
import { resolvePageTitle } from '@/routes/paths'

export default function Topbar() {
  const { pathname } = useLocation()
  const { openMobile } = useSidebar()
  const title = resolvePageTitle(pathname)
  const today = new Intl.DateTimeFormat('en', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date())

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-line bg-white/95 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-lg border border-line text-heading lg:hidden"
          onClick={openMobile}
          aria-label="Open sidebar"
        >
          <Icon name="menu" />
        </button>
        <div>
          <h1 className="text-base font-semibold text-heading">{title}</h1>
          <p className="text-xs text-muted">{today}</p>
        </div>
      </div>
      <span className="hidden rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary sm:inline-flex">
        Administrator
      </span>
    </header>
  )
}
