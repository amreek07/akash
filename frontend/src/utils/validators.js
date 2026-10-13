export function validateEmail(value) {
  const email = value.trim()
  if (!email) return 'Email is required.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address.'
  return ''
}

export function validatePassword(value, { label = 'Password', min = 8 } = {}) {
  if (!value) return `${label} is required.`
  if (value.length < min) return `${label} must be at least ${min} characters.`
  return ''
}
