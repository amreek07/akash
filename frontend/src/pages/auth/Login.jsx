import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Alert from '@/components/common/Alert'
import Button from '@/components/common/Button'
import TextField from '@/components/common/TextField'
import PasswordField from '@/components/auth/PasswordField'
import AuthLayout from '@/components/layout/AuthLayout'
import { paths } from '@/routes/paths'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearAuthFeedback, login } from '@/store/slices/authSlice'
import { validateEmail, validatePassword } from '@/utils/validators'

export default function Login() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { status, error } = useAppSelector((state) => state.auth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const loading = status === 'loading'

  useEffect(() => {
    dispatch(clearAuthFeedback())
  }, [dispatch])

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    }
    setFieldErrors(nextErrors)
    if (nextErrors.email || nextErrors.password) return

    const result = await dispatch(login({ email, password }))
    if (login.fulfilled.match(result)) {
      navigate(paths.verifyOtp, { state: { from: location.state?.from } })
    }
  }

  return (
    <AuthLayout
      eyebrow="Administrator"
      title="Sign in"
      description="Sign in with your administrator email and password. We will send a one-time code to continue."
      footer={
        <>
          Forgot the password?{' '}
          <Link to={paths.forgetPassword} className="font-semibold text-logo hover:underline">
            Recover access
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <Alert>{status === 'failed' ? error : null}</Alert>
        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          autoFocus
          placeholder="admin@company.com"
          value={email}
          error={fieldErrors.email}
          onChange={(event) => {
            setEmail(event.target.value)
            setFieldErrors((current) => ({ ...current, email: '' }))
          }}
        />
        <PasswordField
          label="Password"
          name="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          error={fieldErrors.password}
          onChange={(event) => {
            setPassword(event.target.value)
            setFieldErrors((current) => ({ ...current, password: '' }))
          }}
        />
        <Button type="submit" loading={loading} className="w-full">
          Sign in
        </Button>
      </form>
    </AuthLayout>
  )
}
