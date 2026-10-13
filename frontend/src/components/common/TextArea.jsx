export default function TextArea({ label, error, hint, id, name, rows = 4, className = '', ...props }) {
  const fieldId = id || name

  return (
    <div>
      {label ? (
        <label htmlFor={fieldId} className="mb-1.5 block text-sm font-medium text-heading">
          {label}
        </label>
      ) : null}
      <textarea
        id={fieldId}
        name={name}
        rows={rows}
        className={`w-full rounded-lg border bg-white px-3 py-3 text-sm leading-6 text-heading outline-none transition placeholder:text-muted/70 focus:border-logo focus:ring-4 focus:ring-logo/15 ${
          error ? 'border-red-400' : 'border-line'
        } ${className}`}
        {...props}
      />
      {error ? <p className="mt-1.5 text-xs text-red-600">{error}</p> : null}
      {!error && hint ? <p className="mt-1.5 text-xs text-muted">{hint}</p> : null}
    </div>
  )
}
