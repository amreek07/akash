import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import ResponseCard from '@/components/responses/ResponseCard'
import { responseRecords } from '@/constants/responses'
import { paths } from '@/routes/paths'

const tabs = [
  { kind: 'registrations', label: 'Registrations', recordKind: 'registration' },
  { kind: 'enquiries', label: 'Enquiries', recordKind: 'enquiry' },
]

export default function ResponseList() {
  const { kind } = useParams()
  const tab = tabs.find((item) => item.kind === kind)
  const [query, setQuery] = useState('')

  const counts = useMemo(
    () => ({
      registrations: responseRecords.filter((record) => record.kind === 'registration').length,
      enquiries: responseRecords.filter((record) => record.kind === 'enquiry').length,
    }),
    [],
  )

  const visible = useMemo(() => {
    if (!tab) return []
    const needle = query.trim().toLowerCase()
    return responseRecords.filter((record) => {
      if (record.kind !== tab.recordKind) return false
      if (!needle) return true
      return [record.courseTitle, record.userName, record.email, record.mobile, record.message]
        .join(' ')
        .toLowerCase()
        .includes(needle)
    })
  }, [query, tab])

  if (!tab) return <Navigate to={paths.responses} replace />

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-logo">Client panel</p>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight text-heading">Responses</h2>
      <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">
        Registrations and enquiries submitted for a course. These are the details collected on the client panel. No payment is taken here.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-xl bg-white p-1 shadow-[inset_0_0_0_1px_#e4e8ef]">
          {tabs.map((item) => {
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
                  {counts[item.kind]}
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
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>

      {visible.length ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {visible.map((record) => (
            <ResponseCard key={record.id} record={record} />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-line bg-white px-6 py-16 text-center">
          <h3 className="text-lg font-semibold text-heading">No {tab.label.toLowerCase()} match this search</h3>
          <p className="mt-1 text-sm text-muted">Try another name, course, or mobile number.</p>
        </div>
      )}
    </div>
  )
}
