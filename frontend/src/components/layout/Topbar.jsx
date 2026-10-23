import { Link, useLocation } from 'react-router-dom'
import Avatar from '@/components/common/Avatar'
import Icon from '@/components/common/Icon'
import { unreadNotificationCount } from '@/constants/notifications'
import { useSidebar } from '@/context/useSidebar'
import { paths, resolvePageTitle } from '@/routes/paths'
import { useAppSelector } from '@/store/hooks'

export default function Topbar() {
  const { pathname } = useLocation()
  const { collapsed, openMobile, toggleCollapsed } = useSidebar()
  const title = resolvePageTitle(pathname)
  const unreadCount = unreadNotificationCount()
  const user = useAppSelector((state) => state.auth.user)
  const name = user?.fullName || 'Admin'
  const today = new Intl.DateTimeFormat('en', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date())

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-line bg-white/95 px-4 backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-lg border border-line text-heading lg:hidden"
          onClick={openMobile}
          aria-label="Open sidebar"
        >
          <Icon name="menu" />
        </button>
        <button
          type="button"
          className="hidden h-9 w-9 place-items-center rounded-lg text-heading hover:bg-surface lg:grid"
          onClick={toggleCollapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
        >
          <Icon
            name="chevronLeft"
            className={`h-5 w-5 transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`}
          />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold text-heading">{title}</h1>
          <p className="text-xs text-muted">{today}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <Link
          to={paths.notifications}
          className="relative grid h-10 w-10 place-items-center rounded-full text-heading transition hover:bg-surface"
          aria-label={unreadCount ? `${unreadCount} unread notifications` : 'Notifications'}
        >
          <Icon name="bell" className="h-5 w-5" />
          {unreadCount > 0 ? (
            <span className="absolute right-1 top-1 grid min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-4 text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          ) : null}
        </Link>

        <Link
          to={paths.profile}
          className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2 transition hover:bg-surface sm:pr-3"
          aria-label="Open profile management"
        >
          <Avatar user={user} name={name} size="sm" className="bg-[#d9e2f5] text-shade" />
          <span className="hidden min-w-0 sm:block">
            <span className="block truncate text-sm font-semibold leading-tight text-heading">{name}</span>
            <span className="block truncate text-xs leading-tight text-muted">
              {user?.role === 'admin' ? 'Administrator' : user?.role || 'Administrator'}
            </span>
          </span>
        </Link>
      </div>
    </header>
  )
}
