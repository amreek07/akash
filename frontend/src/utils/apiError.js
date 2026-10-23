export function getErrorMessage(error) {
  const data = error?.response?.data
  const message = data?.message
  if (typeof message === 'string' && message.trim()) return message
  if (Array.isArray(data?.errors) && data.errors.length) {
    return data.errors.filter(Boolean).join(', ')
  }
  if (error?.code === 'ERR_NETWORK') {
    return 'Unable to reach the server. Check your connection and try again.'
  }
  return 'Something went wrong. Please try again.'
}
