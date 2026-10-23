import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Alert from '@/components/common/Alert'
import Button from '@/components/common/Button'
import SelectField from '@/components/common/SelectField'
import TextArea from '@/components/common/TextArea'
import TextField from '@/components/common/TextField'
import ToggleSwitch from '@/components/common/ToggleSwitch'
import { durationUnits, eligibilityOptions } from '@/constants/courses'
import { paths } from '@/routes/paths'

const emptyValues = {
  title: '',
  description: '',
  categoryId: '',
  durationValue: '',
  durationUnit: 'months',
  price: '',
  offerPrice: '',
  eligibility: '',
  isActive: true,
  isFeatured: false,
  isPublished: false,
}

function moneyError(value, label, required = false) {
  if (value === '' || value === null || value === undefined) {
    return required ? `${label} is required.` : ''
  }
  const amount = Number(value)
  if (!Number.isFinite(amount) || amount < 0) return `${label} must be a valid amount.`
  return ''
}

function fromInitial(initialValues) {
  return {
    ...emptyValues,
    title: initialValues?.title || '',
    description: initialValues?.description || '',
    categoryId: initialValues?.categoryId || '',
    durationValue: initialValues?.duration?.value ?? '',
    durationUnit: initialValues?.duration?.unit || 'months',
    price: initialValues?.fees?.price ?? '',
    offerPrice: initialValues?.fees?.offerPrice ?? '',
    eligibility: initialValues?.eligibility || '',
    isActive: initialValues?.isActive !== false,
    isFeatured: Boolean(initialValues?.isFeatured),
    isPublished: Boolean(initialValues?.isPublished),
  }
}

function ToggleRow({ title, description, checked, onChange, disabled }) {
  return (
    <section className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-white px-5 py-4">
      <div>
        <p className="text-sm font-semibold text-heading">{title}</p>
        <p className="mt-1 text-sm text-muted">{description}</p>
      </div>
      <ToggleSwitch checked={checked} onChange={onChange} disabled={disabled} ariaLabel={title} />
    </section>
  )
}

export default function CourseForm({
  initialValues,
  categories = [],
  submitLabel,
  onSubmit,
  loading = false,
  error,
}) {
  const [values, setValues] = useState(() => fromInitial(initialValues))
  const [errors, setErrors] = useState({})

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === values.categoryId) || null,
    [categories, values.categoryId],
  )
  const isParentActive = selectedCategory ? selectedCategory.isActive : false

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const priceError = moneyError(values.price, 'Course fee', true)
    const offerError = moneyError(values.offerPrice, 'Offer price')
    const nextErrors = {
      title: values.title.trim() ? '' : 'Course title is required.',
      description: values.description.trim() ? '' : 'Description is required.',
      categoryId: values.categoryId ? '' : 'Select a category.',
      durationValue: Number(values.durationValue) >= 1 ? '' : 'Duration must be at least 1.',
      durationUnit: values.durationUnit ? '' : 'Select a duration unit.',
      eligibility: values.eligibility ? '' : 'Select eligibility.',
      price: priceError,
      offerPrice:
        offerError ||
        (values.offerPrice !== '' && Number(values.offerPrice) > Number(values.price)
          ? 'Offer price cannot be higher than the course fee.'
          : ''),
    }
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    return onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      category: values.categoryId,
      duration: {
        value: Number(values.durationValue),
        unit: values.durationUnit,
      },
      fees: {
        price: Number(values.price),
        offerPrice: values.offerPrice === '' ? 0 : Number(values.offerPrice),
        currency: 'INR',
      },
      eligibility: values.eligibility,
      isActive: values.isActive,
      isFeatured: values.isFeatured,
      isPublished: values.isPublished,
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <Alert>{error}</Alert>
      <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <TextField
              label="Title"
              name="title"
              value={values.title}
              error={errors.title}
              placeholder="Diploma in Computer Applications"
              onChange={(event) => update('title', event.target.value)}
            />
          </div>
          <div className="lg:col-span-2">
            <TextArea
              label="Description"
              name="description"
              value={values.description}
              error={errors.description}
              placeholder="What this course covers and who it is for."
              onChange={(event) => update('description', event.target.value)}
            />
          </div>
          <SelectField
            label="Category"
            name="categoryId"
            value={values.categoryId}
            error={errors.categoryId}
            hint="The category status is copied onto the course as parent status."
            onChange={(event) => update('categoryId', event.target.value)}
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
                {category.isActive ? '' : ' (inactive)'}
              </option>
            ))}
          </SelectField>
          <SelectField
            label="Eligibility"
            name="eligibility"
            value={values.eligibility}
            error={errors.eligibility}
            onChange={(event) => update('eligibility', event.target.value)}
          >
            <option value="">Select eligibility</option>
            {eligibilityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </SelectField>
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
        <h3 className="text-sm font-semibold text-heading">Duration</h3>
        <p className="mt-1 mb-4 text-sm text-muted">Number of days, months, or years this course runs.</p>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Duration value"
            name="durationValue"
            inputMode="numeric"
            value={values.durationValue}
            error={errors.durationValue}
            placeholder="12"
            onChange={(event) => update('durationValue', event.target.value)}
          />
          <SelectField
            label="Duration unit"
            name="durationUnit"
            value={values.durationUnit}
            error={errors.durationUnit}
            onChange={(event) => update('durationUnit', event.target.value)}
          >
            {durationUnits.map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </SelectField>
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
        <h3 className="text-sm font-semibold text-heading">Fees</h3>
        <p className="mt-1 mb-4 text-sm text-muted">Amounts are stored in INR.</p>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Course fee"
            name="price"
            inputMode="decimal"
            leading="₹"
            value={values.price}
            error={errors.price}
            placeholder="45000"
            onChange={(event) => update('price', event.target.value)}
          />
          <TextField
            label="Offer price"
            name="offerPrice"
            inputMode="decimal"
            leading="₹"
            value={values.offerPrice}
            error={errors.offerPrice}
            hint="Leave blank if this course has no offer."
            placeholder="39900"
            onChange={(event) => update('offerPrice', event.target.value)}
          />
        </div>
      </section>

      <ToggleRow
        title="Course status"
        description="Inactive courses stay in the catalogue and show as off."
        checked={values.isActive}
        onChange={(checked) => update('isActive', checked)}
      />
      <ToggleRow
        title="Category status"
        description={
          selectedCategory
            ? `${selectedCategory.name} is ${isParentActive ? 'active' : 'inactive'}. This follows the category, not the course.`
            : 'Select a category to see whether its parent status is active.'
        }
        checked={isParentActive}
        disabled
      />
      <ToggleRow
        title="Featured"
        description="Featured courses can be highlighted on the public site."
        checked={values.isFeatured}
        onChange={(checked) => update('isFeatured', checked)}
      />
      <ToggleRow
        title="Published"
        description="Unpublished courses stay in the admin catalogue and are hidden from the public site."
        checked={values.isPublished}
        onChange={(checked) => update('isPublished', checked)}
      />

      <div className="flex flex-wrap justify-end gap-3">
        <Link
          to={paths.courses}
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
