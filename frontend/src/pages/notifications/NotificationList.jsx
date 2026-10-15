import { useMemo, useState } from 'react'
import Icon from '@/components/common/Icon'
import { notificationRecords } from '@/constants/notifications'

const typeMeta = {
  registration: { label: 'Registration', icon: 'inbox', tone: 'bg-logo/10 text-logo' },
  enquiry: { label: 'Enquiry', icon: 'inbox', tone: 'bg-logo/10 text-logo' },
  partner: { label: 'Partner', icon: 'user', tone: 'bg-gold/25 text-heading' },
  course: { label: 'Course', icon: 'courses', tone: 'bg-primary/10 text-primary' },
  profile: { label: 'Profile', icon: 'user', tone: 'bg-surface text-muted' },
}

const filters = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'read', label: 'Read' },
]

function formatWhen(value) {
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

export default function NotificationList() {
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')

  const counts = useMemo(
    () => ({
      all: notificationRecords.length,
      unread: notificationRecords.filter((item) => !item.read).length,
      read: notificationRecords.filter((item) => item.read).length,
    }),
    [],
  )

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return notificationRecords.filter((item) => {
      if (filter === 'unread' && item.read) return false
      if (filter === 'read' && !item.read) return false
      if (!needle) return true
      return [item.title, item.message, item.type].join(' ').toLowerCase().includes(needle)
    })
  }, [filter, query])

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-logo">Alerts</p>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight text-heading">Notifications</h2>
      <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">
        Registrations, partner requests, and other admin alerts for this session.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-xl bg-white p-1 shadow-[inset_0_0_0_1px_#e4e8ef]">
          {filters.map((item) => {
            const active = item.id === filter
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={`inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold ${
                  active ? 'bg-logo text-white' : 'text-muted hover:text-heading'
                }`}
              >
                {item.label}
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    active ? 'bg-white/20 text-white' : 'bg-surface text-muted'
                  }`}
                >
                  {counts[item.id]}
                </span>
              </button>
            )
          })}
        </div>
        <label className="w-full sm:w-72">
          <span className="sr-only">Search notifications</span>
          <input
            value={query}
            placeholder="Search title or message"
            className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-heading outline-none transition placeholder:text-muted/70 focus:border-logo focus:ring-4 focus:ring-logo/15"
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>

      {visible.length ? (
        <ul className="mt-5 space-y-3">
          {visible.map((item) => {
            const meta = typeMeta[item.type] || typeMeta.profile
            return (
              <li
                key={item.id}
                className={`rounded-2xl border bg-white p-5 transition ${
                  item.read ? 'border-line' : 'border-logo/30 shadow-[0_12px_30px_rgba(28,77,251,0.06)]'
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${meta.tone}`}>
                    <Icon name={meta.icon} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-heading">{item.title}</h3>
                      {!item.read ? (
                        <span className="rounded-full bg-logo px-2 py-0.5 text-[11px] font-semibold text-white">
                          Unread
                        </span>
                      ) : (
                        <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] font-semibold text-muted">
                          Read
                        </span>
                      )}
                      <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] font-semibold text-muted">
                        {meta.label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-muted">{item.message}</p>
                    <p className="mt-2 text-xs text-muted">{formatWhen(item.createdAt)}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="mt-5 rounded-2xl border border-line bg-white px-6 py-16 text-center">
          <h3 className="text-lg font-semibold text-heading">No notifications match this search</h3>
          <p className="mt-1 text-sm text-muted">Try another filter or search term.</p>
        </div>
      )}
    </div>
  )
}
