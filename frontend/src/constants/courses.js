export const durationUnits = [
  { value: 'days', label: 'Days' },
  { value: 'months', label: 'Months' },
  { value: 'years', label: 'Years' },
]

export const eligibilityOptions = ['8th', '10th', '10+2', 'Graduate', 'Post graduate']

export function formatDuration(duration) {
  if (!duration || duration.value === '' || duration.value == null) return '—'
  return `${duration.value} ${duration.unit || 'months'}`
}
