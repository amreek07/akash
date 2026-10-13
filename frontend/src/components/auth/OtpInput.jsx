import { useRef } from 'react'

export default function OtpInput({ value, onChange, length = 6, disabled = false }) {
  const inputs = useRef([])
  const digits = Array.from({ length }, (_, index) => value[index] || '')

  function commit(nextDigits) {
    onChange(nextDigits.join('').replace(/\D/g, '').slice(0, length))
  }

  function handleChange(index, raw) {
    const clean = raw.replace(/\D/g, '')
    const next = [...digits]
    if (!clean) {
      next[index] = ''
      commit(next)
      return
    }

    clean.split('').forEach((digit, offset) => {
      if (index + offset < length) next[index + offset] = digit
    })
    commit(next)
    const focusIndex = Math.min(index + clean.length, length - 1)
    inputs.current[focusIndex]?.focus()
  }

  function handleKeyDown(index, event) {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
    if (event.key === 'ArrowLeft' && index > 0) inputs.current[index - 1]?.focus()
    if (event.key === 'ArrowRight' && index < length - 1) inputs.current[index + 1]?.focus()
  }

  function handlePaste(event) {
    event.preventDefault()
    const text = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    onChange(text)
    inputs.current[Math.min(Math.max(text.length - 1, 0), length - 1)]?.focus()
  }

  return (
    <div className="flex gap-2 sm:gap-3" onPaste={handlePaste}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(node) => {
            inputs.current[index] = node
          }}
          value={digit}
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          disabled={disabled}
          aria-label={`Digit ${index + 1}`}
          className="h-12 w-full min-w-0 rounded-lg border border-line bg-white text-center text-lg font-semibold text-heading outline-none transition focus:border-logo focus:ring-4 focus:ring-logo/15 disabled:bg-surface sm:h-14"
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
        />
      ))}
    </div>
  )
}
