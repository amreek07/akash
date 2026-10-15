export default function EnrollmentChart({ months }) {
  const width = 640
  const height = 240
  const pad = { top: 24, right: 8, bottom: 32, left: 40 }
  const innerW = width - pad.left - pad.right
  const innerH = height - pad.top - pad.bottom
  const max = Math.max(...months.map((month) => month.students), 1)
  const gap = 18
  const barWidth = (innerW - gap * (months.length - 1)) / months.length
  const ticks = [0, 0.5, 1]

  return (
    <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Enrollment</p>
          <h3 className="mt-1 text-lg font-semibold text-heading">Student enrollment</h3>
        </div>
        <p className="text-sm text-muted">May – October</p>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mt-4 w-full"
        role="img"
        aria-label="Bar chart of student enrollment from May to October"
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
          const barHeight = (month.students / max) * innerH
          const x = pad.left + index * (barWidth + gap)
          const y = pad.top + innerH - barHeight
          const current = index === months.length - 1
          return (
            <g key={month.label}>
              <rect x={x} y={y} width={barWidth} height={barHeight} rx="6" fill={current ? '#f9bd01' : '#1c4dfb'} />
              <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" fill="#151b24" fontSize="12" fontWeight="600">
                {month.students}
              </text>
              <text x={x + barWidth / 2} y={height - 8} textAnchor="middle" fill="#555f69" fontSize="12">
                {month.label}
              </text>
            </g>
          )
        })}
      </svg>
    </section>
  )
}
