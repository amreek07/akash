import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Alert from '@/components/common/Alert'
import Button from '@/components/common/Button'
import TextField from '@/components/common/TextField'
import AuthLayout from '@/components/layout/AuthLayout'
import { paths } from '@/routes/paths'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearAuthFeedback, forgetPassword } from '@/store/slices/authSlice'
import { validateEmail } from '@/utils/validators'

export default function ForgetPassword() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { status, error } = useAppSelector((state) => state.auth)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const loading = status === 'loading'

  useEffect(() => {
    dispatch(clearAuthFeedback())
  }, [dispatch])

  async function handleSubmit(event) {
    event.preventDefault()
    const nextError = validateEmail(email)
    setEmailError(nextError)
    if (nextError) return

    const result = await dispatch(forgetPassword({ email }))
    if (forgetPassword.fulfilled.match(result)) {
      navigate(paths.verifyOtp)
    }
  }

  return (
    <AuthLayout
      eyebrow="Step 1 of 3"
      title="Forget password"
      description="Enter the administrator email. We will send a code you can use to choose a new password."
      footer={
        <Link to={paths.login} className="font-semibold text-logo hover:underline">
          Back to sign in
        </Link>
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
          error={emailError}
          onChange={(event) => {
            setEmail(event.target.value)
            setEmailError('')
          }}
        />
        <Button type="submit" loading={loading} className="w-full">
          Send code
        </Button>
      </form>
    </AuthLayout>
  )
}
