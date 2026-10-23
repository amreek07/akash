export default function ToggleSwitch({
  checked = false,
  onChange,
  disabled = false,
  ariaLabel,
  size = 'md',
}) {
  const compact = size === 'sm'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => {
        if (!disabled) onChange?.(!checked)
      }}
      className={`relative shrink-0 rounded-full transition disabled:cursor-not-allowed disabled:opacity-50 ${
        compact ? 'h-6 w-10' : 'h-7 w-12'
      } ${checked ? 'bg-primary' : 'bg-line'}`}
    >
      <span
        className={`absolute rounded-full bg-white shadow transition ${
          compact ? 'top-0.5 left-0.5 h-5 w-5' : 'top-0.5 left-0.5 h-6 w-6'
        } ${checked ? (compact ? 'translate-x-4' : 'translate-x-5') : 'translate-x-0'}`}
      />
    </button>
  )
}
