import { useEffect } from 'react'
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import Avatar from '@/components/common/Avatar'
import Icon from '@/components/common/Icon'
import Logo from '@/components/common/Logo'
import { adminNavigation } from '@/config/navigation'
import { useSidebar } from '@/context/useSidebar'
import { paths } from '@/routes/paths'
import { logout } from '@/store/slices/authSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

export default function Sidebar() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const user = useAppSelector((state) => state.auth.user)
  const { collapsed, mobileOpen, closeMobile } = useSidebar()
  const name = user?.fullName || 'Administrator'
  const unreadCount = useAppSelector((state) => state.notifications.counts.unread)

  useEffect(() => {
    closeMobile()
  }, [pathname, closeMobile])

  function handleLogout() {
    dispatch(logout())
    navigate(paths.login, { replace: true })
  }

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-heading/40 lg:hidden"
          onClick={closeMobile}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-line bg-white transition-[width,transform] duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } w-[260px] lg:translate-x-0 ${collapsed ? 'lg:w-20' : 'lg:w-[260px]'}`}
      >
        <div className={`flex h-16 items-center border-b border-line ${collapsed ? 'justify-center px-2' : 'justify-between px-4'}`}>
          <Logo compact={collapsed} />
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-surface lg:hidden"
            onClick={closeMobile}
            aria-label="Close sidebar"
          >
            <Icon name="close" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Admin">
          <p className={`px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted ${collapsed ? 'lg:hidden' : ''}`}>
            Menu
          </p>
          {adminNavigation.map((item) => {
            const showBadge = item.to === paths.notifications && unreadCount > 0
            return (
              <NavLink
                key={item.to}
                to={item.to}
                title={item.label}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    collapsed ? 'lg:justify-center lg:px-0' : ''
                  } ${isActive ? 'bg-logo text-white' : 'text-muted hover:bg-surface hover:text-heading'}`
                }
              >
                <span className="relative">
                  <Icon name={item.icon} />
                  {showBadge && collapsed ? (
                    <span className="absolute -right-1.5 -top-1.5 hidden h-2 w-2 rounded-full bg-red-500 lg:block" />
                  ) : null}
                </span>
                <span className={`flex min-w-0 flex-1 items-center justify-between gap-2 ${collapsed ? 'lg:hidden' : ''}`}>
                  <span className="truncate">{item.label}</span>
                  {showBadge ? (
                    <span className="grid min-w-5 place-items-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold leading-5 text-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  ) : null}
                </span>
              </NavLink>
            )
          })}
        </nav>

        <div className="border-t border-line p-3">
          <Link
            to={paths.profile}
            title="Profile"
            className={`flex items-center gap-3 rounded-xl bg-surface p-2.5 transition hover:ring-2 hover:ring-logo/30 ${
              collapsed ? 'lg:justify-center' : ''
            }`}
          >
            <Avatar user={user} name={name} size="sm" />
            <span className={`min-w-0 ${collapsed ? 'lg:hidden' : ''}`}>
              <span className="block truncate text-sm font-semibold text-heading">{name}</span>
              <span className="block truncate text-xs text-muted">{user?.email || 'Administrator'}</span>
            </span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className={`mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold text-heading hover:bg-gold/40 ${
              collapsed ? 'lg:px-0' : ''
            }`}
          >
            <Icon name="logout" className="h-4 w-4" />
            <span className={collapsed ? 'lg:sr-only' : ''}>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  )
}
