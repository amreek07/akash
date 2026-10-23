import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Alert from '@/components/common/Alert'
import Button from '@/components/common/Button'
import SelectField from '@/components/common/SelectField'
import TextField from '@/components/common/TextField'
import { paths } from '@/routes/paths'
import { clearAuthFeedback, updateProfile } from '@/store/slices/authSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { initials } from '@/utils/format'
import { validateEmail } from '@/utils/validators'

const countryCodes = ['+91', '+1', '+44', '+61', '+971', '+977']

export default function EditProfile() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user, status, request, error } = useAppSelector((state) => state.auth)
  const [fullName, setFullName] = useState(user?.fullName || '')
  const [email, setEmail] = useState(user?.email || '')
  const [countryCode, setCountryCode] = useState(user?.countryCode || '+91')
  const [phone, setPhone] = useState(user?.phone || '')
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '')
  const [errors, setErrors] = useState({})
  const loading = status === 'loading' && request.startsWith('auth/updateProfile')
  const failed = status === 'failed' && request.startsWith('auth/updateProfile')
  const codeOptions = countryCodes.includes(countryCode) ? countryCodes : [countryCode, ...countryCodes]

  useEffect(() => {
    dispatch(clearAuthFeedback())
  }, [dispatch])

  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith('blob:')) URL.revokeObjectURL(avatarPreview)
    }
  }, [avatarPreview])

  function handleAvatar(event) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setErrors((current) => ({ ...current, avatar: 'Choose an image file.' }))
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors((current) => ({ ...current, avatar: 'Avatar must be 2MB or smaller.' }))
      return
    }
    if (avatarPreview && avatarPreview.startsWith('blob:')) URL.revokeObjectURL(avatarPreview)
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
    setErrors((current) => ({ ...current, avatar: '' }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const phoneDigits = phone.trim()
    const nextErrors = {
      fullName: fullName.trim() ? '' : 'Full name is required.',
      email: validateEmail(email),
      phone: phoneDigits && !/^\d{7,15}$/.test(phoneDigits) ? 'Enter a phone number with 7 to 15 digits.' : '',
    }
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    const formData = new FormData()
    formData.append('fullName', fullName.trim())
    formData.append('email', email.trim())
    formData.append('countryCode', countryCode)
    formData.append('phone', phoneDigits)
    if (avatarFile) formData.append('avatar', avatarFile)

    const result = await dispatch(updateProfile(formData))
    if (updateProfile.fulfilled.match(result)) {
      navigate(paths.profile, { state: { saved: true } })
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-sm text-muted">
        <Link to={paths.profile} className="font-semibold text-logo hover:underline">
          Profile
        </Link>
        <span className="px-2">/</span>
        Edit
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-heading">Edit profile</h2>
      <p className="mt-1 mb-6 text-sm text-muted">
        Update the details shown for this administrator. The role stays Administrator.
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <Alert>{failed ? error : null}</Alert>
        <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <p className="mb-1.5 text-sm font-medium text-heading">Avatar</p>
              <div className="flex flex-wrap items-center gap-4">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="" className="h-20 w-20 rounded-2xl object-cover" />
                ) : (
                  <span className="grid h-20 w-20 place-items-center rounded-2xl bg-shade text-xl font-semibold text-white">
                    {initials(fullName || 'Administrator')}
                  </span>
                )}
                <label className="inline-flex h-11 cursor-pointer items-center rounded-lg border border-line bg-white px-4 text-sm font-semibold text-heading hover:bg-surface">
                  {avatarFile ? 'Replace image' : 'Upload image'}
                  <input type="file" accept="image/*" className="sr-only" onChange={handleAvatar} />
                </label>
              </div>
              {errors.avatar ? <p className="mt-1.5 text-xs text-red-600">{errors.avatar}</p> : (
                <p className="mt-1.5 text-xs text-muted">PNG or JPG, up to 2MB.</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <TextField
                label="Full name"
                name="fullName"
                autoComplete="name"
                value={fullName}
                error={errors.fullName}
                placeholder="Administrator"
                onChange={(event) => {
                  setFullName(event.target.value)
                  setErrors((current) => ({ ...current, fullName: '' }))
                }}
              />
            </div>
            <div className="sm:col-span-2">
              <TextField
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                error={errors.email}
                placeholder="admin@company.com"
                onChange={(event) => {
                  setEmail(event.target.value)
                  setErrors((current) => ({ ...current, email: '' }))
                }}
              />
            </div>
            <SelectField
              label="Country code"
              name="countryCode"
              value={countryCode}
              onChange={(event) => setCountryCode(event.target.value)}
            >
              {codeOptions.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </SelectField>
            <TextField
              label="Phone"
              name="phone"
              inputMode="numeric"
              autoComplete="tel"
              value={phone}
              error={errors.phone}
              hint="Optional. Digits only."
              placeholder="9876543210"
              onChange={(event) => {
                setPhone(event.target.value)
                setErrors((current) => ({ ...current, phone: '' }))
              }}
            />
            <div className="sm:col-span-2">
              <p className="text-sm font-medium text-heading">Role</p>
              <p className="mt-2 inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                Administrator
              </p>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap justify-end gap-3">
          <Link
            to={paths.profile}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-line bg-white px-4 text-sm font-semibold text-heading hover:bg-surface"
          >
            Cancel
          </Link>
          <Button type="submit" loading={loading}>
            Save details
          </Button>
        </div>
      </form>
    </div>
  )
}
