import { useEffect } from 'react'
import EnrollmentChart from '@/components/dashboard/EnrollmentChart'
import Alert from '@/components/common/Alert'
import Icon from '@/components/common/Icon'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchDashboard } from '@/store/slices/dashboardSlice'
import { firstName } from '@/utils/format'

export default function Dashboard() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const { stats, status, error } = useAppSelector((state) => state.dashboard)
  const name = user?.fullName || 'Administrator'

  useEffect(() => {
    dispatch(fetchDashboard())
  }, [dispatch])

  const statsCards = [
    {
      label: 'Registrations',
      value: stats.registrations,
      detail: 'Responses with type registration',
      icon: 'inbox',
      tone: 'bg-logo/10 text-logo',
    },
    {
      label: 'Active courses',
      value: stats.courses.active,
      detail: `${stats.courses.total} courses in the catalogue`,
      icon: 'courses',
      tone: 'bg-primary/10 text-primary',
    },
    {
      label: 'Active partners',
      value: stats.partners.active,
      detail: `${stats.partners.total} people in the partner list`,
      icon: 'user',
      tone: 'bg-gold/25 text-heading',
    },
  ]

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="overflow-hidden rounded-2xl bg-shade text-white">
        <div className="grid gap-8 p-6 md:grid-cols-[1.4fr_0.8fr] md:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Coding Hubs Institute</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">Welcome back, {firstName(name)}</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/75">
              This session belongs to an administrator. The sidebar is the way through the panel, and sign-out ends it on this browser.
            </p>
          </div>
          <div className="rounded-xl bg-white/10 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">Signed in</p>
            <p className="mt-3 text-lg font-semibold">{name}</p>
            <p className="mt-1 text-sm text-white/75">{user?.email || 'No email on this session'}</p>
            <span className="mt-4 inline-flex rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
              Active session
            </span>
          </div>
        </div>
      </section>

      {status === 'failed' && error ? <Alert>{error}</Alert> : null}

      <section className="grid gap-4 md:grid-cols-3">
        {statsCards.map((stat) => (
          <article key={stat.label} className="rounded-2xl border border-line bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{stat.label}</p>
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${stat.tone}`}>
                <Icon name={stat.icon} className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-heading">{stat.value}</p>
            <p className="mt-1 text-sm text-muted">{stat.detail}</p>
          </article>
        ))}
      </section>

      <EnrollmentChart year={stats.year} months={stats.months} />

      <section className="rounded-2xl border border-gold/40 bg-gold/15 px-5 py-4">
        <h3 className="text-sm font-semibold text-heading">Access recovery</h3>
        <p className="mt-1 text-sm text-muted">
          Password reset starts from the public sign-in screen. A code is required before a new password can be saved.
        </p>
      </section>
    </div>
  )
}
