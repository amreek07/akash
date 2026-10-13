import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '@/components/common/Button'
import SelectField from '@/components/common/SelectField'
import TextArea from '@/components/common/TextArea'
import TextField from '@/components/common/TextField'
import { durationOptions, requirementOptions } from '@/constants/courses'
import { paths } from '@/routes/paths'

const emptyValues = {
  name: '',
  description: '',
  duration: '',
  subjects: [],
  requirement: '',
  fee: '',
  offerPrice: '',
  type: '',
  isActive: true,
}

function moneyError(value, label) {
  if (value === '' || value === null || value === undefined) return ''
  const amount = Number(value)
  if (!Number.isFinite(amount) || amount < 0) return `${label} must be a valid amount.`
  return ''
}

export default function CourseForm({
  initialValues,
  types,
  submitLabel,
  onSubmit,
}) {
  const [values, setValues] = useState(() => ({
    ...emptyValues,
    ...initialValues,
    fee: initialValues?.fee ?? '',
    offerPrice: initialValues?.offerPrice ?? '',
    subjects: initialValues?.subjects ? [...initialValues.subjects] : [],
  }))
  const [subjectDraft, setSubjectDraft] = useState('')
  const [typeDraft, setTypeDraft] = useState('')
  const [errors, setErrors] = useState({})

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  function addSubject() {
    const subject = subjectDraft.trim()
    if (!subject) return
    const exists = values.subjects.some((item) => item.toLowerCase() === subject.toLowerCase())
    if (!exists) update('subjects', [...values.subjects, subject])
    setSubjectDraft('')
  }

  function removeSubject(subject) {
    update(
      'subjects',
      values.subjects.filter((item) => item !== subject),
    )
  }

  function handleSubmit(event) {
    event.preventDefault()
    const type = typeDraft.trim() || values.type
    const feeError = values.fee === '' ? 'Course fee is required.' : moneyError(values.fee, 'Course fee')
    const offerError = moneyError(values.offerPrice, 'Offer price')
    const nextErrors = {
      name: values.name.trim() ? '' : 'Course name is required.',
      description: values.description.trim() ? '' : 'Description is required.',
      duration: values.duration ? '' : 'Select a duration.',
      requirement: values.requirement ? '' : 'Select a requirement.',
      type: type ? '' : 'Select a type or add one.',
      subjects: values.subjects.length ? '' : 'Add at least one subject.',
      fee: feeError,
      offerPrice:
        offerError ||
        (values.offerPrice !== '' && Number(values.offerPrice) > Number(values.fee)
          ? 'Offer price cannot be higher than the course fee.'
          : ''),
    }
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    onSubmit({
      name: values.name.trim(),
      description: values.description.trim(),
      duration: values.duration,
      subjects: values.subjects,
      requirement: values.requirement,
      fee: Number(values.fee),
      offerPrice: values.offerPrice === '' ? null : Number(values.offerPrice),
      type,
      isActive: values.isActive,
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <TextField
              label="Course name"
              name="name"
              value={values.name}
              error={errors.name}
              placeholder="Diploma in Computer Applications"
              onChange={(event) => update('name', event.target.value)}
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
            label="Duration"
            name="duration"
            value={values.duration}
            error={errors.duration}
            onChange={(event) => update('duration', event.target.value)}
          >
            <option value="">Select duration</option>
            {durationOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </SelectField>
          <SelectField
            label="Requirement"
            name="requirement"
            value={values.requirement}
            error={errors.requirement}
            onChange={(event) => update('requirement', event.target.value)}
          >
            <option value="">Select requirement</option>
            {requirementOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </SelectField>
          <div className="lg:col-span-2">
            <SelectField
              label="Type"
              name="type"
              value={values.type}
              error={errors.type}
              hint="Choose an existing type, or type a new one below. New types stay available for the next course."
              onChange={(event) => update('type', event.target.value)}
            >
              <option value="">Select type</option>
              {types.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </SelectField>
            <div className="mt-3">
              <TextField
                label="Add a type"
                name="typeDraft"
                value={typeDraft}
                placeholder="For example, Science"
                onChange={(event) => {
                  setTypeDraft(event.target.value)
                  setErrors((current) => ({ ...current, type: '' }))
                }}
              />
            </div>
          </div>
          <div className="lg:col-span-2">
            <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-heading">
              Subjects
            </label>
            <div className="flex gap-2">
              <input
                id="subject"
                value={subjectDraft}
                placeholder="Add a subject and press Enter"
                className={`h-11 min-w-0 flex-1 rounded-lg border bg-white px-3 text-sm text-heading outline-none transition placeholder:text-muted/70 focus:border-logo focus:ring-4 focus:ring-logo/15 ${
                  errors.subjects ? 'border-red-400' : 'border-line'
                }`}
                onChange={(event) => setSubjectDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    addSubject()
                  }
                }}
              />
              <Button type="button" variant="gold" onClick={addSubject}>
                Add
              </Button>
            </div>
            {errors.subjects ? <p className="mt-1.5 text-xs text-red-600">{errors.subjects}</p> : null}
            {values.subjects.length ? (
              <ul className="mt-3 flex flex-wrap gap-2">
                {values.subjects.map((subject) => (
                  <li
                    key={subject}
                    className="inline-flex items-center gap-2 rounded-full bg-logo/10 px-3 py-1.5 text-sm font-medium text-logo"
                  >
                    {subject}
                    <button
                      type="button"
                      className="text-base leading-none text-shade"
                      aria-label={`Remove ${subject}`}
                      onClick={() => removeSubject(subject)}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-xs text-muted">Subjects are stored as a list. Add one at a time.</p>
            )}
          </div>
          <TextField
            label="Course fee"
            name="fee"
            inputMode="decimal"
            leading="₹"
            value={values.fee}
            error={errors.fee}
            placeholder="45000"
            onChange={(event) => update('fee', event.target.value)}
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

      <section className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-white px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-heading">Active</p>
          <p className="mt-1 text-sm text-muted">Inactive courses stay in the catalogue and show as off.</p>
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
          to={paths.courses}
          className="inline-flex h-11 items-center justify-center rounded-lg border border-line bg-white px-4 text-sm font-semibold text-heading hover:bg-surface"
        >
          Cancel
        </Link>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  )
}
