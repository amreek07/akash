import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Alert from '@/components/common/Alert'
import Button from '@/components/common/Button'
import OtpInput from '@/components/auth/OtpInput'
import AuthLayout from '@/components/layout/AuthLayout'
import { paths } from '@/routes/paths'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearAuthFeedback, resendOtp, verifyLoginOtp, verifyResetOtp } from '@/store/slices/authSlice'

const OTP_LENGTH = 6

export default function VerifyOtp() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { status, error, resendStatus, resendMessage, recovery } = useAppSelector((state) => state.auth)
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const isReset = recovery.purpose === 'reset'
  const loading = status === 'loading'

  useEffect(() => {
    dispatch(clearAuthFeedback())
  }, [dispatch])

  if (!recovery.email) {
    return <Navigate to={isReset ? paths.forgetPassword : paths.login} replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (otp.length !== OTP_LENGTH) {
      setOtpError('Enter the 6-digit code.')
      return
    }
    setOtpError('')

    const payload = { email: recovery.email, otp }
    const result = isReset
      ? await dispatch(verifyResetOtp(payload))
      : await dispatch(verifyLoginOtp(payload))

    if (verifyResetOtp.fulfilled.match(result)) {
      navigate(paths.resetPassword)
    }
    if (verifyLoginOtp.fulfilled.match(result)) {
      const nextPath = location.state?.from?.pathname || paths.dashboard
      navigate(nextPath, { replace: true })
    }
  }

  async function handleResend() {
    await dispatch(resendOtp({ email: recovery.email, purpose: recovery.purpose }))
  }

  return (
    <AuthLayout
      eyebrow={isReset ? 'Step 2 of 3' : 'Step 2 of 2'}
      title="Verify code"
      description={
        isReset
          ? `Enter the code sent to ${recovery.email} to continue resetting the password.`
          : `Enter the code sent to ${recovery.email} to open Coding Hubs Institute.`
      }
      footer={
        <Link to={isReset ? paths.forgetPassword : paths.login} className="font-semibold text-logo hover:underline">
          Use a different email
        </Link>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <Alert>{status === 'failed' ? error : null}</Alert>
        <Alert tone={resendStatus === 'failed' ? 'error' : 'success'}>
          {resendStatus === 'idle' ? null : resendMessage}
        </Alert>
        <div>
          <p className="mb-2 text-sm font-medium text-heading">One-time code</p>
          <OtpInput
            value={otp}
            onChange={(next) => {
              setOtp(next)
              setOtpError('')
            }}
            length={OTP_LENGTH}
            disabled={loading}
          />
          {otpError ? <p className="mt-2 text-xs text-red-600">{otpError}</p> : null}
        </div>
        <Button type="submit" loading={loading} className="w-full">
          {isReset ? 'Verify and continue' : 'Open Coding Hubs Institute'}
        </Button>
        <Button
          type="button"
          variant="gold"
          className="w-full"
          loading={resendStatus === 'loading'}
          onClick={handleResend}
        >
          Resend code
        </Button>
      </form>
    </AuthLayout>
  )
}
