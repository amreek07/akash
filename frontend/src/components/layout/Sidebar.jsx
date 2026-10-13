import { useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import Icon from '@/components/common/Icon'
import Logo from '@/components/common/Logo'
import { adminNavigation } from '@/config/navigation'
import { useSidebar } from '@/context/useSidebar'
import { paths } from '@/routes/paths'
import { logout } from '@/store/slices/authSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { initials } from '@/utils/format'

export default function Sidebar() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const user = useAppSelector((state) => state.auth.user)
  const { collapsed, mobileOpen, closeMobile, toggleCollapsed } = useSidebar()
  const name = user?.fullName || 'Administrator'

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
          {adminNavigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              title={item.label}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  collapsed ? 'lg:justify-center lg:px-0' : ''
                } ${isActive ? 'bg-logo text-white' : 'text-muted hover:bg-surface hover:text-heading'}`
              }
            >
              <Icon name={item.icon} />
              <span className={collapsed ? 'lg:hidden' : ''}>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-line p-3">
          <button
            type="button"
            onClick={toggleCollapsed}
            className="mb-3 hidden h-10 w-full items-center justify-center gap-2 rounded-lg border border-line text-sm font-medium text-muted hover:bg-surface lg:flex"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Icon name="panel" className="h-4 w-4" />
            {collapsed ? null : <span>Collapse</span>}
          </button>

          <div className={`flex items-center gap-3 rounded-xl bg-surface p-2.5 ${collapsed ? 'lg:justify-center' : ''}`}>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-shade text-xs font-semibold text-white">
              {initials(name)}
            </span>
            <span className={`min-w-0 ${collapsed ? 'lg:hidden' : ''}`}>
              <span className="block truncate text-sm font-semibold text-heading">{name}</span>
              <span className="block truncate text-xs text-muted">{user?.email || 'Administrator'}</span>
            </span>
          </div>

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
