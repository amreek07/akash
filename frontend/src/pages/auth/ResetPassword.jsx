import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Alert from '@/components/common/Alert'
import Button from '@/components/common/Button'
import PasswordField from '@/components/auth/PasswordField'
import AuthLayout from '@/components/layout/AuthLayout'
import { paths } from '@/routes/paths'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearAuthFeedback, resetPassword } from '@/store/slices/authSlice'
import { validatePassword } from '@/utils/validators'

export default function ResetPassword() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { status, error, recovery } = useAppSelector((state) => state.auth)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const loading = status === 'loading'

  useEffect(() => {
    dispatch(clearAuthFeedback())
  }, [dispatch])

  if (!recovery.email || !recovery.otpVerified || recovery.purpose !== 'reset') {
    return <Navigate to={paths.forgetPassword} replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = {
      password: validatePassword(password, { label: 'New password' }),
      confirmPassword:
        password === confirmPassword ? '' : 'Passwords do not match.',
    }
    if (!confirmPassword) nextErrors.confirmPassword = 'Confirm the new password.'
    setFieldErrors(nextErrors)
    if (nextErrors.password || nextErrors.confirmPassword) return

    const result = await dispatch(
      resetPassword({
        email: recovery.email,
        password,
      }),
    )
    if (resetPassword.fulfilled.match(result)) {
      navigate(paths.login, { replace: true })
    }
  }

  return (
    <AuthLayout
      eyebrow="Step 3 of 3"
      title="Reset password"
      description={`Choose a new password for ${recovery.email}. You will sign in again after it is saved.`}
      footer={
        <Link to={paths.login} className="font-semibold text-logo hover:underline">
          Back to sign in
        </Link>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <Alert>{status === 'failed' ? error : null}</Alert>
        <PasswordField
          label="New password"
          name="password"
          autoComplete="new-password"
          autoFocus
          placeholder="At least 8 characters"
          value={password}
          error={fieldErrors.password}
          hint="Use at least 8 characters."
          onChange={(event) => {
            setPassword(event.target.value)
            setFieldErrors((current) => ({ ...current, password: '' }))
          }}
        />
        <PasswordField
          label="Confirm password"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Repeat the new password"
          value={confirmPassword}
          error={fieldErrors.confirmPassword}
          onChange={(event) => {
            setConfirmPassword(event.target.value)
            setFieldErrors((current) => ({ ...current, confirmPassword: '' }))
          }}
        />
        <Button type="submit" loading={loading} className="w-full">
          Save password
        </Button>
      </form>
    </AuthLayout>
  )
}
