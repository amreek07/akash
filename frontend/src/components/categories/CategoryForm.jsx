import { useState } from 'react'
import { Link } from 'react-router-dom'
import Alert from '@/components/common/Alert'
import Button from '@/components/common/Button'
import TextArea from '@/components/common/TextArea'
import TextField from '@/components/common/TextField'
import { paths } from '@/routes/paths'

const emptyValues = {
  name: '',
  description: '',
  isActive: true,
}

export default function CategoryForm({ initialValues, submitLabel, onSubmit, loading = false, error }) {
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
      name: values.name.trim() ? '' : 'Title is required.',
      description: values.description.trim() ? '' : 'Description is required.',
    }
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    return onSubmit({
      name: values.name.trim(),
      description: values.description.trim(),
      isActive: values.isActive,
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 rounded-2xl border border-line bg-white p-5 sm:p-6">
      <Alert>{error}</Alert>
      <TextField
        label="Title"
        name="name"
        value={values.name}
        error={errors.name}
        placeholder="Computer"
        onChange={(event) => update('name', event.target.value)}
      />
      <TextArea
        label="Description"
        name="description"
        value={values.description}
        error={errors.description}
        rows={4}
        placeholder="Short description of this category"
        onChange={(event) => update('description', event.target.value)}
      />
      <section className="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-heading">Status</p>
          <p className="mt-1 text-sm text-muted">Inactive categories stay listed and show as off.</p>
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
          to={paths.categories}
          className="inline-flex h-11 items-center justify-center rounded-lg border border-line bg-white px-4 text-sm font-semibold text-heading hover:bg-surface"
        >
          Cancel
        </Link>
        <Button type="submit" loading={loading}>{submitLabel}</Button>
      </div>
    </form>
  )
}
