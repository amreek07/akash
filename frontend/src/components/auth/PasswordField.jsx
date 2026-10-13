import { useState } from 'react'
import TextField from '@/components/common/TextField'

export default function PasswordField({ label = 'Password', ...props }) {
  const [visible, setVisible] = useState(false)

  return (
    <TextField
      label={label}
      type={visible ? 'text' : 'password'}
      trailing={
        <button
          type="button"
          className="text-xs font-semibold text-logo"
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      }
      {...props}
    />
  )
}
