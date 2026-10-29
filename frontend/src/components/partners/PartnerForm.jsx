import { useState } from 'react'
import { Link } from 'react-router-dom'
import Alert from '@/components/common/Alert'
import Button from '@/components/common/Button'
import TextField from '@/components/common/TextField'
import { paths } from '@/routes/paths'
import { validateEmail } from '@/utils/validators'

const emptyValues = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  partnerId: '',
  status: 'active',
  isActive: true,
}

function validatePhone(value) {
  const phone = value.trim()
  if (!phone) return 'Phone is required.'
  if (!/^[0-9+\-\s()]{7,20}$/.test(phone)) return 'Enter a valid phone number.'
  return ''
}

export default function PartnerForm({ initialValues, submitLabel, onSubmit, loading = false, error }) {
  const [values, setValues] = useState(() => ({
    ...emptyValues,
    ...initialValues,
    status: initialValues?.status || (initialValues?.isActive === false ? 'inactive' : 'active'),
    isActive: initialValues ? initialValues.isActive !== false && initialValues.status !== 'inactive' : true,
  }))
  const [errors, setErrors] = useState({})
  const isActive = values.status === 'active'

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  function setStatus(nextStatus) {
    setValues((current) => ({
      ...current,
      status: nextStatus,
      isActive: nextStatus === 'active',
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = {
      name: values.name.trim() ? '' : 'Name is required.',
      email: validateEmail(values.email),
      phone: validatePhone(values.phone),
      address: values.address.trim() ? '' : 'Address is required.',
      city: values.city.trim() ? '' : 'City is required.',
    }
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    onSubmit({
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      address: values.address.trim(),
      city: values.city.trim(),
      status: values.status,
      isActive: values.status === 'active',
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 rounded-2xl border border-line bg-white p-5 sm:p-6">
      {error ? <Alert>{error}</Alert> : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Name"
          name="name"
          value={values.name}
          error={errors.name}
          placeholder="Rahul Verma"
          onChange={(event) => update('name', event.target.value)}
        />
        <TextField
          label="Partner ID"
          name="partnerId"
          value={values.partnerId || 'Assigned on save'}
          readOnly
          hint="CHI-P-year-count, for example CHI-P-2026-001."
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={values.email}
          error={errors.email}
          placeholder="partner@example.com"
          onChange={(event) => update('email', event.target.value)}
        />
        <TextField
          label="Phone"
          name="phone"
          type="tel"
          value={values.phone}
          error={errors.phone}
          placeholder="9876543210"
          onChange={(event) => update('phone', event.target.value)}
        />
        <div className="sm:col-span-2">
          <TextField
            label="Address"
            name="address"
            value={values.address}
            error={errors.address}
            placeholder="House number, street, area"
            onChange={(event) => update('address', event.target.value)}
          />
        </div>
        <TextField
          label="City"
          name="city"
          value={values.city}
          error={errors.city}
          placeholder="Ludhiana"
          onChange={(event) => update('city', event.target.value)}
        />
      </div>

      <section className="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-heading">Status</p>
          <p className="mt-1 text-sm text-muted">
            {isActive ? 'This partner is active.' : 'This partner is inactive and stays on the list.'}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={isActive}
          aria-label="Active"
          onClick={() => setStatus(isActive ? 'inactive' : 'active')}
          className={`relative h-7 w-12 shrink-0 rounded-full transition ${isActive ? 'bg-primary' : 'bg-line'}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
              isActive ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </section>

      <div className="flex flex-wrap justify-end gap-3">
        <Link
          to={paths.partners}
          className="inline-flex h-11 items-center justify-center rounded-lg border border-line bg-white px-4 text-sm font-semibold text-heading hover:bg-surface"
        >
          Cancel
        </Link>
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
