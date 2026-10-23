import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Alert from '@/components/common/Alert'
import Button from '@/components/common/Button'
import Icon from '@/components/common/Icon'
import ConfirmDialog from '@/components/courses/ConfirmDialog'
import { responseTabByRecordKind } from '@/constants/responseTabs'
import { paths } from '@/routes/paths'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  clearNotificationFeedback,
  deleteNotification,
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/store/slices/notificationsSlice'

const typeMeta = {
  registration: { label: 'Registration', icon: 'inbox', tone: 'bg-logo/10 text-logo' },
  enquiry: { label: 'Enquiry', icon: 'inbox', tone: 'bg-logo/10 text-logo' },
  general: { label: 'General', icon: 'inbox', tone: 'bg-surface text-muted' },
}

const filters = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'read', label: 'Read' },
]

const PAGE_SIZE = 50

function formatWhen(value) {
  if (!value) return ''
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

function responsePath(item) {
  if (!item.responseId) return ''
  const tab = responseTabByRecordKind[item.type]
  if (!tab) return ''
  return paths.responseDetails(tab.kind, item.responseId)
}

export default function NotificationList() {
  const dispatch = useAppDispatch()
  const { items, pagination, counts, status, request, error } = useAppSelector((state) => state.notifications)
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [pending, setPending] = useState(null)
  const loading = status === 'loading' && request.startsWith('notifications/fetchAll')
  const markingAll = status === 'loading' && request.startsWith('notifications/markAllAsRead')
  const deleting = status === 'loading' && request.startsWith('notifications/delete')

  useEffect(() => {
    setPage(1)
  }, [filter, query])

  useEffect(() => {
    dispatch(clearNotificationFeedback())
    const timer = window.setTimeout(
      () => {
        dispatch(
          fetchNotifications({
            page,
            limit: PAGE_SIZE,
            search: query.trim(),
            read: filter,
          }),
        )
      },
      query.trim() ? 300 : 0,
    )
    return () => window.clearTimeout(timer)
  }, [dispatch, filter, page, query])

  async function handleMarkRead(item) {
    if (item.read) return
    await dispatch(markNotificationRead(item.id))
  }

  async function handleMarkAll() {
    const result = await dispatch(markAllNotificationsRead())
    if (markAllNotificationsRead.fulfilled.match(result)) {
      dispatch(fetchNotifications({ page, limit: PAGE_SIZE, search: query.trim(), read: filter }))
    }
  }

  async function handleDelete() {
    if (!pending) return
    const result = await dispatch(deleteNotification(pending.id))
    setPending(null)
    if (deleteNotification.fulfilled.match(result)) {
      dispatch(fetchNotifications({ page, limit: PAGE_SIZE, search: query.trim(), read: filter }))
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-logo">Alerts</p>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight text-heading">Notifications</h2>
      <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">
        Alerts created when a registration, enquiry, or general response is submitted.
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
        <div className="flex w-full flex-wrap items-center justify-end gap-3 sm:w-auto">
          {counts.unread > 0 ? (
            <Button type="button" variant="ghost" loading={markingAll} onClick={handleMarkAll}>
              Mark all as read
            </Button>
          ) : null}
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
      </div>

      {error ? (
        <div className="mt-5">
          <Alert>{error}</Alert>
        </div>
      ) : null}

      {loading && !items.length ? (
        <div className="mt-5 rounded-2xl border border-line bg-white px-6 py-16 text-center">
          <h3 className="text-lg font-semibold text-heading">Loading notifications</h3>
          <p className="mt-1 text-sm text-muted">Fetching the latest alerts from the server.</p>
        </div>
      ) : items.length ? (
        <ul className="mt-5 space-y-3">
          {items.map((item) => {
            const meta = typeMeta[item.type] || typeMeta.general
            const href = responsePath(item)
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
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <p className="text-xs text-muted">{formatWhen(item.createdAt)}</p>
                      {href ? (
                        <Link
                          to={href}
                          className="text-xs font-semibold text-logo hover:underline"
                          onClick={() => handleMarkRead(item)}
                        >
                          View response
                        </Link>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {!item.read ? (
                      <button
                        type="button"
                        className="h-9 rounded-lg px-2 text-xs font-semibold text-logo hover:bg-surface"
                        onClick={() => handleMarkRead(item)}
                      >
                        Mark as read
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-surface hover:text-red-600"
                      aria-label={`Delete ${item.title}`}
                      onClick={() => setPending(item)}
                    >
                      <Icon name="trash" className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="mt-5 rounded-2xl border border-line bg-white px-6 py-16 text-center">
          <h3 className="text-lg font-semibold text-heading">
            {query.trim() ? 'No notifications match this search' : 'No notifications yet'}
          </h3>
          <p className="mt-1 text-sm text-muted">
            {query.trim()
              ? 'Try another filter or search term.'
              : 'A new alert appears here when a response is submitted.'}
          </p>
        </div>
      )}

      {pagination.totalPages > 1 ? (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={!pagination.hasPreviousPage || loading}
            className="inline-flex h-10 items-center rounded-lg border border-line bg-white px-4 text-sm font-semibold text-heading hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Previous
          </button>
          <p className="text-sm text-muted">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <button
            type="button"
            disabled={!pagination.hasNextPage || loading}
            className="inline-flex h-10 items-center rounded-lg border border-line bg-white px-4 text-sm font-semibold text-heading hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </button>
        </div>
      ) : null}

      {pending ? (
        <ConfirmDialog
          title="Delete this notification?"
          description={`${pending.title} will be removed from your alerts.`}
          loading={deleting}
          onClose={() => {
            if (!deleting) setPending(null)
          }}
          onConfirm={handleDelete}
        />
      ) : null}
    </div>
  )
}
