import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '@/components/common/Button'
import TextField from '@/components/common/TextField'
import { paths } from '@/routes/paths'
import { validateEmail } from '@/utils/validators'

const emptyValues = {
  name: '',
  email: '',
  partnerSince: '',
  phone: '',
  partnerId: '',
  isActive: true,
}

function validatePhone(value) {
  const phone = value.trim()
  if (!phone) return 'Phone is required.'
  if (!/^[0-9+\-\s()]{7,15}$/.test(phone)) return 'Enter a valid phone number.'
  return ''
}

export default function PartnerForm({ initialValues, submitLabel, onSubmit }) {
  const [values, setValues] = useState(() => ({
    ...emptyValues,
    ...initialValues,
  }))
  const [errors, setErrors] = useState({})

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = {
      name: values.name.trim() ? '' : 'Name is required.',
      email: validateEmail(values.email),
      partnerSince: values.partnerSince ? '' : 'Partner since date is required.',
      phone: validatePhone(values.phone),
      partnerId: values.partnerId.trim() ? '' : 'Partner ID is required.',
    }
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    onSubmit({
      name: values.name.trim(),
      email: values.email.trim(),
      partnerSince: values.partnerSince,
      phone: values.phone.trim(),
      partnerId: values.partnerId.trim(),
      isActive: values.isActive,
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 rounded-2xl border border-line bg-white p-5 sm:p-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Name"
          name="name"
          value={values.name}
          error={errors.name}
          placeholder="Punjab University"
          onChange={(event) => update('name', event.target.value)}
        />
        <TextField
          label="Partner ID"
          name="partnerId"
          value={values.partnerId}
          error={errors.partnerId}
          placeholder="PU-2018"
          onChange={(event) => update('partnerId', event.target.value)}
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
        <TextField
          label="Partner since"
          name="partnerSince"
          type="date"
          value={values.partnerSince}
          error={errors.partnerSince}
          onChange={(event) => update('partnerSince', event.target.value)}
        />
      </div>

      <section className="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-heading">Status</p>
          <p className="mt-1 text-sm text-muted">Inactive partners stay listed and show as off.</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={values.isActive}
          aria-label="Active"
          onClick={() => update('isActive', !values.isActive)}
          className={`relative h-7 w-12 shrink-0 rounded-full transition ${values.isActive ? 'bg-primary' : 'bg-line'}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
              values.isActive ? 'translate-x-5' : 'translate-x-0'
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
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  )
}
