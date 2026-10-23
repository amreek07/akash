import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { responseTabByKind } from '@/constants/responseTabs'
import { paths } from '@/routes/paths'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearResponseFeedback, fetchResponseById } from '@/store/slices/responsesSlice'
import { formatInr } from '@/utils/currency'

export default function ResponseDetails() {
  const { kind, id } = useParams()
  const dispatch = useAppDispatch()
  const meta = responseTabByKind[kind]
  const { items, current, status, error } = useAppSelector((state) => state.responses)
  const record = items.find((item) => item.id === id) || (current?.id === id ? current : null)
  const matchesTab = Boolean(record && meta && record.kind === meta.recordKind)
  const loading = Boolean(meta) && !record && status !== 'failed'

  useEffect(() => {
    dispatch(clearResponseFeedback())
    if (id) dispatch(fetchResponseById(id))
  }, [dispatch, id])

  if (!meta) return <Navigate to={paths.responses} replace />

  if (!matchesTab && !loading) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-white p-8 text-center">
        <h2 className="text-xl font-semibold text-heading">This response is not in the list</h2>
        {error ? <p className="mt-2 text-sm text-muted">{error}</p> : null}
        <Link to={paths.responseTab(kind)} className="mt-4 inline-flex text-sm font-semibold text-logo hover:underline">
          Back to {kind}
        </Link>
      </div>
    )
  }

  if (loading || !record) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-white p-8 text-center">
        <h2 className="text-xl font-semibold text-heading">Loading response</h2>
        <p className="mt-2 text-sm text-muted">Fetching the latest details from the server.</p>
      </div>
    )
  }

  const courseTitle = record.courseTitle || 'Course not selected'
  const fields = [
    { label: 'Course', value: courseTitle },
    { label: 'Price', value: formatInr(record.price) },
    { label: 'Name', value: record.userName },
    { label: 'Email', value: record.email },
    { label: 'Mobile', value: record.mobile },
  ]

  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-sm text-muted">
        <Link to={paths.responseTab(kind)} className="font-semibold text-logo hover:underline">
          {meta.label}
        </Link>
        <span className="px-2">/</span>
        Details
      </p>

      <section className="mt-4 overflow-hidden rounded-2xl bg-shade text-white">
        <div className="flex flex-wrap items-start justify-between gap-4 p-6 sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">{meta.singular}</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">{courseTitle}</h2>
            <p className="mt-2 text-sm text-white/75">{record.userName}</p>
          </div>
          <div className="rounded-xl bg-white/10 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.14em] text-white/60">Course price</p>
            <p className="mt-1 text-2xl font-semibold">{formatInr(record.price)}</p>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-line bg-white">
        <h3 className="border-b border-line px-6 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-muted">
          Collected details
        </h3>
        <dl className="divide-y divide-line">
          {fields.map((field) => (
            <div key={field.label} className="grid gap-1 px-6 py-4 sm:grid-cols-[180px_1fr] sm:items-center">
              <dt className="text-sm text-muted">{field.label}</dt>
              <dd className="text-sm font-semibold text-heading">{field.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-4 rounded-2xl border border-line bg-white p-6">
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Message</h3>
        <p className="mt-3 text-sm leading-7 text-heading">
          {record.message || 'No message was included with this request.'}
        </p>
      </section>

      <section className="mt-4 rounded-2xl border border-gold/40 bg-gold/15 px-5 py-4">
        <h3 className="text-sm font-semibold text-heading">No payment collected</h3>
        <p className="mt-1 text-sm leading-6 text-muted">
          The client panel does not charge for this {meta.singular.toLowerCase()}. The price above is the course price shown
          with the request.
        </p>
      </section>

      {record.courseId ? (
        <Link
          to={paths.courseDetails(record.courseId)}
          className="mt-5 inline-flex text-sm font-semibold text-logo hover:underline"
        >
          Open {courseTitle} in courses
        </Link>
      ) : null}
    </div>
  )
}
