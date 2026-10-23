import { Link } from 'react-router-dom'
import { responseTabByRecordKind } from '@/constants/responseTabs'
import { paths } from '@/routes/paths'
import { formatInr } from '@/utils/currency'

export default function ResponseCard({ record }) {
  const kind = responseTabByRecordKind[record.kind]?.kind || 'general'

  return (
    <Link
      to={paths.responseDetails(kind, record.id)}
      className="flex h-full flex-col rounded-2xl border border-line bg-white p-5 transition hover:border-logo/40 hover:shadow-[0_12px_30px_rgba(21,27,36,0.06)]"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-logo">Course</p>
        <p className="text-sm font-semibold text-heading">{formatInr(record.price)}</p>
      </div>
      <h3 className="mt-2 text-lg font-semibold leading-snug text-heading">
        {record.courseTitle || 'Course not selected'}
      </h3>
      <div className="mt-4 border-t border-line pt-4">
        <p className="text-sm font-semibold text-heading">{record.userName}</p>
        <p className="mt-1 text-sm text-muted">{record.email}</p>
        <p className="mt-0.5 text-sm text-muted">{record.mobile}</p>
      </div>
      <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted">
        {record.message || 'No message included.'}
      </p>
      <span className="mt-4 text-sm font-semibold text-logo">View details</span>
    </Link>
  )
}
