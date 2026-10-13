import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { paths } from '@/routes/paths'
import { useAppSelector } from '@/store/hooks'

export default function PrivateRoute() {
  const location = useLocation()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to={paths.login} replace state={{ from: location }} />
  }

  return <Outlet />
}
