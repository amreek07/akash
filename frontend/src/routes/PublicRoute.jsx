import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { paths } from '@/routes/paths'
import { useAppSelector } from '@/store/hooks'

export default function PublicRoute() {
  const location = useLocation()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  if (isAuthenticated) {
    const redirectTo = location.state?.from?.pathname || paths.dashboard
    return <Navigate to={redirectTo} replace />
  }

  return <Outlet />
}
