const series = [
  { key: 'registration', label: 'Registration', color: '#1c4dfb' },
  { key: 'enquiry', label: 'Enquiry', color: '#11a22f' },
  { key: 'general', label: 'General', color: '#f9bd01' },
]

export default function EnrollmentChart({ year, months = [] }) {
  const width = 720
  const height = 260
  const pad = { top: 28, right: 8, bottom: 32, left: 36 }
  const innerW = width - pad.left - pad.right
  const innerH = height - pad.top - pad.bottom
  const max = Math.max(...months.map((month) => month.total || 0), 1)
  const gap = 10
  const barWidth = months.length ? (innerW - gap * (months.length - 1)) / months.length : 0
  const ticks = [0, 0.5, 1]
  const yearTotal = months.reduce((sum, month) => sum + (month.total || 0), 0)

  return (
    <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Responses</p>
          <h3 className="mt-1 text-lg font-semibold text-heading">Responses through the year</h3>
        </div>
        <p className="text-sm text-muted">
          Jan – Dec {year} · {yearTotal} total
        </p>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mt-4 w-full"
        role="img"
        aria-label={`Stacked bar chart of registration, enquiry, and general responses for each month of ${year}`}
      >
        {ticks.map((tick) => {
          const y = pad.top + innerH - tick * innerH
          const value = Math.round(max * tick)
          return (
            <g key={tick}>
              <line x1={pad.left} x2={width - pad.right} y1={y} y2={y} stroke="#e4e8ef" strokeWidth="1" />
              <text x={pad.left - 8} y={y + 4} textAnchor="end" fill="#555f69" fontSize="11">
                {value}
              </text>
            </g>
          )
        })}

        {months.map((month, index) => {
          const x = pad.left + index * (barWidth + gap)
          let stacked = 0
          return (
            <g key={month.label}>
              {series.map((item) => {
                const value = Number(month[item.key]) || 0
                const barHeight = (value / max) * innerH
                const y = pad.top + innerH - stacked - barHeight
                stacked += barHeight
                if (barHeight <= 0) return null
                return <rect key={item.key} x={x} y={y} width={barWidth} height={barHeight} fill={item.color} />
              })}
              {month.total > 0 ? (
                <text
                  x={x + barWidth / 2}
                  y={pad.top + innerH - (month.total / max) * innerH - 8}
                  textAnchor="middle"
                  fill="#151b24"
                  fontSize="11"
                  fontWeight="600"
                >
                  {month.total}
                </text>
              ) : null}
              <text x={x + barWidth / 2} y={height - 8} textAnchor="middle" fill="#555f69" fontSize="11">
                {month.label}
              </text>
            </g>
          )
        })}
      </svg>

      <ul className="mt-2 flex flex-wrap gap-4">
        {series.map((item) => (
          <li key={item.key} className="inline-flex items-center gap-2 text-xs font-semibold text-muted">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
            {item.label}
          </li>
        ))}
      </ul>
    </section>
  )
}
