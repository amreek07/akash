export function getErrorMessage(error) {
  const message = error?.response?.data?.message
  if (typeof message === 'string' && message.trim()) return message
  if (error?.code === 'ERR_NETWORK') {
    return 'Unable to reach the server. Check your connection and try again.'
  }
  return 'Something went wrong. Please try again.'
}
