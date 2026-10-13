export default function Button({
  variant = 'primary',
  loading = false,
  children,
  className = '',
  type = 'button',
  disabled,
  ...props
}) {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    gold: 'bg-gold text-heading hover:bg-gold-dark',
    ghost: 'border border-line bg-white text-heading hover:bg-surface',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
      ) : null}
      {loading ? 'Please wait' : children}
    </button>
  )
}
