export function firstName(fullName = '') {
  return fullName.trim().split(/\s+/)[0] || 'Admin'
}

export function initials(fullName = '') {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return 'A'
  return parts
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}
