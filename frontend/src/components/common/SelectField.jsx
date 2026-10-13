export default function SelectField({
  label,
  error,
  hint,
  className = '',
  id,
  name,
  children,
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
      <select
        id={fieldId}
        name={name}
        className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-heading outline-none transition focus:border-logo focus:ring-4 focus:ring-logo/15 ${
          error ? 'border-red-400' : 'border-line'
        } ${className}`}
        {...props}
      >
        {children}
      </select>
      {error ? <p className="mt-1.5 text-xs text-red-600">{error}</p> : null}
      {!error && hint ? <p className="mt-1.5 text-xs text-muted">{hint}</p> : null}
    </div>
  )
}
