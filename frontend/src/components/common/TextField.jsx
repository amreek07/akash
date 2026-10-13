export default function TextField({
  label,
  error,
  hint,
  trailing,
  leading,
  className = '',
  id,
  name,
  ...props
}) {
  const fieldId = id || name

  return (
    <div>
      {label ? (
        <label htmlFor={fieldId} className="mb-1.5 block text-sm font-medium text-heading">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <input
          id={fieldId}
          name={name}
          className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-heading outline-none transition placeholder:text-muted/70 focus:border-logo focus:ring-4 focus:ring-logo/15 ${
            error ? 'border-red-400' : 'border-line'
          } ${leading ? 'pl-8' : ''} ${trailing ? 'pr-16' : ''} ${className}`}
          {...props}
        />
        {leading ? (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm font-semibold text-muted">
            {leading}
          </div>
        ) : null}
        {trailing ? (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">{trailing}</div>
        ) : null}
      </div>
      {error ? <p className="mt-1.5 text-xs text-red-600">{error}</p> : null}
      {!error && hint ? <p className="mt-1.5 text-xs text-muted">{hint}</p> : null}
    </div>
  )
}
