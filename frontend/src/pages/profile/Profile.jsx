import { Link, useLocation } from 'react-router-dom'
import Alert from '@/components/common/Alert'
import Icon from '@/components/common/Icon'
import { paths } from '@/routes/paths'
import { useAppSelector } from '@/store/hooks'
import { initials } from '@/utils/format'

function displayPhone(user) {
  if (!user?.phone) return 'Not added'
  return `${user.countryCode || ''} ${user.phone}`.trim()
}

export default function Profile() {
  const location = useLocation()
  const user = useAppSelector((state) => state.auth.user)
  const name = user?.fullName || 'Administrator'
  const saved = Boolean(location.state?.saved)

  const details = [
    { label: 'Full name', value: name },
    { label: 'Email', value: user?.email || 'Not added' },
    { label: 'Phone', value: displayPhone(user) },
    { label: 'Role', value: 'Administrator' },
  ]

  return (
    <div className="mx-auto max-w-4xl">
      <div className="overflow-hidden rounded-2xl bg-shade text-white">
        <div className="flex flex-wrap items-center gap-5 p-6 sm:p-8">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-logo text-xl font-semibold">
            {initials(name)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Administrator</p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight">{name}</h2>
            <p className="mt-1 truncate text-sm text-white/75">{user?.email || 'No email on this session'}</p>
          </div>
        </div>
      </div>

      {saved ? (
        <div className="mt-4">
          <Alert tone="success">Profile details were saved.</Alert>
        </div>
      ) : null}

      <section className="mt-6 rounded-2xl border border-line bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Account details</h3>
          <Link to={paths.profileEdit} className="text-sm font-semibold text-logo hover:underline">
            Edit details
          </Link>
        </div>
        <dl className="divide-y divide-line">
          {details.map((item) => (
            <div key={item.label} className="grid gap-1 px-6 py-4 sm:grid-cols-[180px_1fr] sm:items-center">
              <dt className="text-sm text-muted">{item.label}</dt>
              <dd className="text-sm font-semibold text-heading">{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Link
          to={paths.profileEdit}
          className="flex items-center gap-4 rounded-2xl border border-line bg-white p-5 transition hover:border-logo/40"
        >
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-logo/10 text-logo">
            <Icon name="user" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-heading">Edit profile</span>
            <span className="mt-1 block text-sm text-muted">Update name, email, and phone.</span>
          </span>
        </Link>
        <Link
          to={paths.changePassword}
          className="flex items-center gap-4 rounded-2xl border border-line bg-white p-5 transition hover:border-gold"
        >
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold/25 text-heading">
            <Icon name="key" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-heading">Change password</span>
            <span className="mt-1 block text-sm text-muted">Set a new password for this account.</span>
          </span>
        </Link>
      </div>
    </div>
  )
}
