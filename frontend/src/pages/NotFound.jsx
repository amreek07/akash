import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Logo from '@/components/common/Logo'
import { appConfig } from '@/config/appConfig'
import { paths } from '@/routes/paths'
import { useAppSelector } from '@/store/hooks'

export default function NotFound() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  useEffect(() => {
    document.title = `Not found · ${appConfig.appName}`
  }, [])

  return (
    <main className="grid min-h-svh place-items-center bg-white px-6">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-logo">404</p>
        <h1 className="mt-2 text-3xl font-semibold text-heading">This page is not in the panel</h1>
        <p className="mt-2 text-sm text-muted">The address does not match a public auth screen or an administrator page.</p>
        <Link
          to={isAuthenticated ? paths.dashboard : paths.login}
          className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          {isAuthenticated ? 'Back to dashboard' : 'Back to sign in'}
        </Link>
      </div>
    </main>
  )
}
