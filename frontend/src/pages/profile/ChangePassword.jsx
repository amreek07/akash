import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Alert from '@/components/common/Alert'
import Button from '@/components/common/Button'
import PasswordField from '@/components/auth/PasswordField'
import { paths } from '@/routes/paths'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { changePassword, clearAuthFeedback } from '@/store/slices/authSlice'
import { validatePassword } from '@/utils/validators'

export default function ChangePassword() {
  const dispatch = useAppDispatch()
  const { status, error, request } = useAppSelector((state) => state.auth)
  const [currentPassword, setCurrentPassword] = useState('')
  const [nextPassword, setNextPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [saved, setSaved] = useState(false)
  const loading = status === 'loading' && request.startsWith('auth/changePassword')
  const failed = status === 'failed' && request.startsWith('auth/changePassword')

  useEffect(() => {
    dispatch(clearAuthFeedback())
  }, [dispatch])

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = {
      currentPassword: currentPassword ? '' : 'Current password is required.',
      nextPassword: validatePassword(nextPassword, { label: 'New password' }),
      confirmPassword: confirmPassword ? '' : 'Confirm the new password.',
    }
    if (!nextErrors.nextPassword && nextPassword === currentPassword) {
      nextErrors.nextPassword = 'Choose a password that is different from the current one.'
    }
    if (!nextErrors.confirmPassword && nextPassword !== confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.'
    }
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) {
      setSaved(false)
      return
    }

    const result = await dispatch(
      changePassword({
        oldPassword: currentPassword,
        newPassword: nextPassword,
      }),
    )
    if (changePassword.fulfilled.match(result)) {
      setCurrentPassword('')
      setNextPassword('')
      setConfirmPassword('')
      setSaved(true)
    } else {
      setSaved(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <p className="text-sm text-muted">
        <Link to={paths.profile} className="font-semibold text-logo hover:underline">
          Profile
        </Link>
        <span className="px-2">/</span>
        Password
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-heading">Change password</h2>
      <p className="mt-1 mb-6 text-sm leading-6 text-muted">
        Use the current password, then choose a new one with at least 8 characters.
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-5 rounded-2xl border border-line bg-white p-5 sm:p-6">
        <Alert>{failed ? error : null}</Alert>
        {saved ? <Alert tone="success">Password updated for this account.</Alert> : null}
        <PasswordField
          label="Current password"
          name="currentPassword"
          autoComplete="current-password"
          value={currentPassword}
          error={errors.currentPassword}
          placeholder="Enter the current password"
          onChange={(event) => {
            setCurrentPassword(event.target.value)
            setErrors((current) => ({ ...current, currentPassword: '' }))
            setSaved(false)
          }}
        />
        <PasswordField
          label="New password"
          name="nextPassword"
          autoComplete="new-password"
          value={nextPassword}
          error={errors.nextPassword}
          hint="At least 8 characters."
          placeholder="Enter a new password"
          onChange={(event) => {
            setNextPassword(event.target.value)
            setErrors((current) => ({ ...current, nextPassword: '' }))
            setSaved(false)
          }}
        />
        <PasswordField
          label="Confirm new password"
          name="confirmPassword"
          autoComplete="new-password"
          value={confirmPassword}
          error={errors.confirmPassword}
          placeholder="Repeat the new password"
          onChange={(event) => {
            setConfirmPassword(event.target.value)
            setErrors((current) => ({ ...current, confirmPassword: '' }))
            setSaved(false)
          }}
        />
        <div className="flex flex-wrap justify-end gap-3 pt-1">
          <Link
            to={paths.profile}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-line bg-white px-4 text-sm font-semibold text-heading hover:bg-surface"
          >
            Back
          </Link>
          <Button type="submit" loading={loading}>
            Update password
          </Button>
        </div>
      </form>
    </div>
  )
}
