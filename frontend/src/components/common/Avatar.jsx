import { initials } from '@/utils/format'

export default function Avatar({ user, name, size = 'md', rounded = 'full', className = '' }) {
  const label = name || user?.fullName || user?.name || 'Administrator'
  const src = user?.avatar
  const sizes = {
    sm: 'h-9 w-9 text-xs',
    md: 'h-11 w-11 text-sm',
    lg: 'h-16 w-16 text-xl',
  }
  const radius = rounded === '2xl' ? 'rounded-2xl' : 'rounded-full'

  if (src) {
    return (
      <img
        src={src}
        alt={label}
        className={`shrink-0 object-cover ${radius} ${sizes[size] || sizes.md} ${className}`}
      />
    )
  }

  return (
    <span
      className={`grid shrink-0 place-items-center font-semibold text-white ${radius} ${sizes[size] || sizes.md} ${className}`}
    >
      {initials(label)}
    </span>
  )
}
