import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Alert from '@/components/common/Alert'
import ResponseCard from '@/components/responses/ResponseCard'
import { responseTabs } from '@/constants/responseTabs'
import { paths } from '@/routes/paths'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearResponseFeedback, fetchResponses } from '@/store/slices/responsesSlice'

const PAGE_SIZE = 50

export default function ResponseList() {
  const { kind } = useParams()
  const tab = responseTabs.find((item) => item.kind === kind)
  const dispatch = useAppDispatch()
  const { items, pagination, counts, status, request, error } = useAppSelector((state) => state.responses)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const loading = status === 'loading' && request.startsWith('responses/fetchAll')
  const visible = items.filter((item) => item.kind === tab?.recordKind)

  useEffect(() => {
    setQuery('')
    setPage(1)
  }, [kind])

  useEffect(() => {
    if (!tab) return undefined
    dispatch(clearResponseFeedback())
    const timer = window.setTimeout(
      () => {
        dispatch(
          fetchResponses({
            responseType: tab.recordKind,
            page,
            limit: PAGE_SIZE,
            search: query.trim(),
          }),
        )
      },
      query.trim() ? 300 : 0,
    )
    return () => window.clearTimeout(timer)
  }, [dispatch, tab, page, query])

  if (!tab) return <Navigate to={paths.responses} replace />

  const tabCounts = {
    registrations: counts.registration,
    enquiries: counts.enquiry,
    general: counts.general,
  }

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-logo">Client panel</p>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight text-heading">Responses</h2>
      <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">
        Registrations, enquiries, and general messages submitted from the client panel. No payment is taken here.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-xl bg-white p-1 shadow-[inset_0_0_0_1px_#e4e8ef]">
          {responseTabs.map((item) => {
            const active = item.kind === kind
            return (
              <Link
                key={item.kind}
                to={paths.responseTab(item.kind)}
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
                  {tabCounts[item.kind]}
                </span>
              </Link>
            )
          })}
        </div>
        <label className="w-full sm:w-72">
          <span className="sr-only">Search responses</span>
          <input
            value={query}
            placeholder="Search name, course, or mobile"
            className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-heading outline-none transition placeholder:text-muted/70 focus:border-logo focus:ring-4 focus:ring-logo/15"
            onChange={(event) => {
              setQuery(event.target.value)
              setPage(1)
            }}
          />
        </label>
      </div>

      {error ? (
        <div className="mt-5">
          <Alert>{error}</Alert>
        </div>
      ) : null}

      {loading && !visible.length ? (
        <div className="mt-5 rounded-2xl border border-line bg-white px-6 py-16 text-center">
          <h3 className="text-lg font-semibold text-heading">Loading {tab.label.toLowerCase()}</h3>
          <p className="mt-1 text-sm text-muted">Fetching the latest submissions from the server.</p>
        </div>
      ) : visible.length ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {visible.map((record) => (
            <ResponseCard key={record.id} record={record} />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-line bg-white px-6 py-16 text-center">
          <h3 className="text-lg font-semibold text-heading">
            {query.trim() ? `No ${tab.label.toLowerCase()} match this search` : `No ${tab.label.toLowerCase()} yet`}
          </h3>
          <p className="mt-1 text-sm text-muted">
            {query.trim()
              ? 'Try another name, course, or mobile number.'
              : 'New submissions from the client panel will appear here.'}
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
    </div>
  )
}
