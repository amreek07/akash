import { useState } from 'react'
import { Link } from 'react-router-dom'
import Alert from '@/components/common/Alert'
import Button from '@/components/common/Button'
import Icon from '@/components/common/Icon'
import SelectField from '@/components/common/SelectField'
import TextField from '@/components/common/TextField'
import { paths } from '@/routes/paths'
import { toDateInput } from '@/utils/format'
import { validateEmail } from '@/utils/validators'

const emptyFee = {
  semester: '',
  amount: '',
  paidAmount: '',
  dueDate: '',
  paidDate: '',
}

function emptyStudent() {
  return {
    uuid: '',
    name: '',
    fatherName: '',
    dob: '',
    contact: '',
    email: '',
    course: '',
    reference: '',
    enrollmentDate: '',
    courseCompletionDate: '',
    semesterFees: [],
  }
}

function fromStudent(student) {
  if (!student) return emptyStudent()
  return {
    uuid: student.uuid || '',
    name: student.name || '',
    fatherName: student.fatherName || '',
    dob: toDateInput(student.dob),
    contact: student.contact || '',
    email: student.email || '',
    course: student.course?.id || '',
    reference: student.reference?.id || '',
    enrollmentDate: toDateInput(student.enrollmentDate),
    courseCompletionDate: toDateInput(student.courseCompletionDate),
    semesterFees: (student.semesterFees || []).map((fee) => ({
      semester: fee.semester === '' || fee.semester == null ? '' : String(fee.semester),
      amount: fee.amount === '' || fee.amount == null ? '' : String(fee.amount),
      paidAmount: fee.paidAmount === '' || fee.paidAmount == null ? '' : String(fee.paidAmount),
      dueDate: toDateInput(fee.dueDate),
      paidDate: toDateInput(fee.paidDate),
    })),
  }
}

function validateContact(value) {
  const contact = value.trim()
  if (!contact) return 'Contact is required.'
  if (!/^[0-9+\-\s()]{7,20}$/.test(contact)) return 'Enter a valid contact number.'
  return ''
}

function feeStatus(amount, paidAmount) {
  const amountValue = Number(amount)
  const paidValue = paidAmount === '' ? 0 : Number(paidAmount)
  if (!Number.isFinite(paidValue) || paidValue <= 0) return 'pending'
  if (Number.isFinite(amountValue) && paidValue >= amountValue) return 'paid'
  return 'partial'
}

const statusLabel = {
  pending: 'Pending',
  partial: 'Partial',
  paid: 'Paid',
}

export default function StudentForm({
  initialValues,
  courses = [],
  partners = [],
  optionsLoading = false,
  submitLabel,
  onSubmit,
  loading = false,
  error,
}) {
  const [values, setValues] = useState(() => fromStudent(initialValues))
  const [errors, setErrors] = useState({})
  const [feeErrors, setFeeErrors] = useState([])

  const courseOptions = [...courses]
  if (values.course && !courseOptions.some((course) => course.id === values.course) && initialValues?.course?.id) {
    courseOptions.unshift({
      id: initialValues.course.id,
      title: initialValues.course.title || 'Selected course',
    })
  }

  const partnerOptions = [...partners]
  if (
    values.reference &&
    !partnerOptions.some((partner) => partner.id === values.reference) &&
    initialValues?.reference?.id
  ) {
    partnerOptions.unshift({
      id: initialValues.reference.id,
      name: initialValues.reference.name || 'Selected partner',
      partnerId: initialValues.reference.partnerId || '',
    })
  }

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  function updateFee(index, field, value) {
    setValues((current) => ({
      ...current,
      semesterFees: current.semesterFees.map((fee, feeIndex) =>
        feeIndex === index ? { ...fee, [field]: value } : fee,
      ),
    }))
    setFeeErrors((current) => current.map((fee, feeIndex) => (feeIndex === index ? { ...fee, [field]: '' } : fee)))
  }

  function addFee() {
    setValues((current) => {
      const highest = current.semesterFees.reduce((max, fee) => Math.max(max, Number(fee.semester) || 0), 0)
      return {
        ...current,
        semesterFees: [...current.semesterFees, { ...emptyFee, semester: String(highest + 1) }],
      }
    })
  }

  function removeFee(index) {
    setValues((current) => ({
      ...current,
      semesterFees: current.semesterFees.filter((_, feeIndex) => feeIndex !== index),
    }))
    setFeeErrors((current) => current.filter((_, feeIndex) => feeIndex !== index))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const today = toDateInput(new Date())
    const nextErrors = {
      uuid: /^\d{10}$/.test(values.uuid.trim()) ? '' : 'Student ID must be exactly 10 digits.',
      name: values.name.trim() ? '' : 'Name is required.',
      fatherName: values.fatherName.trim() ? '' : "Father's name is required.",
      dob: !values.dob ? 'Date of birth is required.' : values.dob > today ? 'Date of birth cannot be in the future.' : '',
      contact: validateContact(values.contact),
      email: validateEmail(values.email),
      course: values.course ? '' : 'Select a course.',
      enrollmentDate: values.enrollmentDate ? '' : 'Enrollment date is required.',
      courseCompletionDate: !values.courseCompletionDate
        ? 'Course completion date is required.'
        : values.enrollmentDate && values.courseCompletionDate < values.enrollmentDate
          ? 'Course completion date must be on or after the enrollment date.'
          : '',
    }

    const nextFeeErrors = values.semesterFees.map((fee) => {
      const semester = Number(fee.semester)
      const amount = Number(fee.amount)
      const paidAmount = fee.paidAmount === '' ? 0 : Number(fee.paidAmount)
      return {
        semester:
          fee.semester === '' || !Number.isInteger(semester) || semester < 1 ? 'Enter a semester number.' : '',
        amount: fee.amount === '' || !Number.isFinite(amount) || amount < 0 ? 'Enter the semester fee.' : '',
        paidAmount:
          fee.paidAmount !== '' && (!Number.isFinite(paidAmount) || paidAmount < 0)
            ? 'Paid amount cannot be negative.'
            : '',
      }
    })
    const seen = new Map()
    values.semesterFees.forEach((fee, index) => {
      const semester = Number(fee.semester)
      if (!nextFeeErrors[index].semester && seen.has(semester)) {
        nextFeeErrors[index].semester = 'This semester is already listed.'
      } else if (!nextFeeErrors[index].semester) {
        seen.set(semester, index)
      }
    })

    setErrors(nextErrors)
    setFeeErrors(nextFeeErrors)
    const feesInvalid = nextFeeErrors.some((fee) => Object.values(fee).some(Boolean))
    if (Object.values(nextErrors).some(Boolean) || feesInvalid) return

    onSubmit({
      uuid: values.uuid.trim(),
      name: values.name.trim(),
      fatherName: values.fatherName.trim(),
      dob: values.dob,
      contact: values.contact.trim(),
      email: values.email.trim(),
      course: values.course,
      reference: values.reference || null,
      enrollmentDate: values.enrollmentDate,
      courseCompletionDate: values.courseCompletionDate,
      semesterFees: values.semesterFees.map((fee) => ({
        semester: Number(fee.semester),
        amount: Number(fee.amount),
        paidAmount: fee.paidAmount === '' ? 0 : Number(fee.paidAmount),
        currency: 'INR',
        dueDate: fee.dueDate || null,
        paidDate: fee.paidDate || null,
      })),
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {error ? <Alert>{error}</Alert> : null}

      <section className="space-y-5 rounded-2xl border border-line bg-white p-5 sm:p-6">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Student details</h3>
          <p className="mt-1 text-sm text-muted">All of these details are required. Reference can be left empty.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Student ID"
            name="uuid"
            inputMode="numeric"
            maxLength={10}
            value={values.uuid}
            error={errors.uuid}
            placeholder="1234567890"
            hint="Exactly 10 digits."
            onChange={(event) => update('uuid', event.target.value.replace(/\D/g, '').slice(0, 10))}
          />
          <TextField
            label="Name"
            name="name"
            value={values.name}
            error={errors.name}
            placeholder="Aman Singh"
            onChange={(event) => update('name', event.target.value)}
          />
          <TextField
            label="Father's name"
            name="fatherName"
            value={values.fatherName}
            error={errors.fatherName}
            placeholder="Raj Singh"
            onChange={(event) => update('fatherName', event.target.value)}
          />
          <TextField
            label="Date of birth"
            name="dob"
            type="date"
            value={values.dob}
            error={errors.dob}
            max={toDateInput(new Date())}
            onChange={(event) => update('dob', event.target.value)}
          />
          <TextField
            label="Contact"
            name="contact"
            type="tel"
            value={values.contact}
            error={errors.contact}
            placeholder="9876543210"
            onChange={(event) => update('contact', event.target.value)}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={values.email}
            error={errors.email}
            placeholder="student@example.com"
            onChange={(event) => update('email', event.target.value)}
          />
          <SelectField
            label="Course"
            name="course"
            value={values.course}
            error={errors.course}
            disabled={optionsLoading}
            onChange={(event) => update('course', event.target.value)}
          >
            <option value="">{optionsLoading ? 'Loading courses…' : 'Select a course'}</option>
            {courseOptions.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </SelectField>
          <SelectField
            label="Reference"
            name="reference"
            value={values.reference}
            hint="Optional partner who referred this student."
            disabled={optionsLoading}
            onChange={(event) => update('reference', event.target.value)}
          >
            <option value="">{optionsLoading ? 'Loading partners…' : 'No reference'}</option>
            {partnerOptions.map((partner) => (
              <option key={partner.id} value={partner.id}>
                {partner.partnerId ? `${partner.name} · ${partner.partnerId}` : partner.name}
              </option>
            ))}
          </SelectField>
          <TextField
            label="Enrollment date"
            name="enrollmentDate"
            type="date"
            value={values.enrollmentDate}
            error={errors.enrollmentDate}
            onChange={(event) => update('enrollmentDate', event.target.value)}
          />
          <TextField
            label="Course completion date"
            name="courseCompletionDate"
            type="date"
            value={values.courseCompletionDate}
            error={errors.courseCompletionDate}
            min={values.enrollmentDate || undefined}
            onChange={(event) => update('courseCompletionDate', event.target.value)}
          />
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-line bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Semester fees</h3>
            <p className="mt-1 text-sm text-muted">Add one row for each semester. Status follows the amount paid.</p>
          </div>
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-line bg-white px-3 text-sm font-semibold text-heading hover:bg-surface"
            onClick={addFee}
          >
            <Icon name="plus" className="h-4 w-4" />
            Add semester
          </button>
        </div>

        {values.semesterFees.length ? (
          <div className="space-y-4">
            {values.semesterFees.map((fee, index) => {
              const status = feeStatus(fee.amount, fee.paidAmount)
              const fieldErrors = feeErrors[index] || {}
              return (
                <div key={index} className="rounded-xl border border-line bg-surface/60 p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        status === 'paid'
                          ? 'bg-primary/10 text-primary'
                          : status === 'partial'
                            ? 'bg-gold/25 text-heading'
                            : 'bg-white text-muted'
                      }`}
                    >
                      {statusLabel[status]}
                    </span>
                    <button
                      type="button"
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-muted hover:text-red-600"
                      onClick={() => removeFee(index)}
                    >
                      <Icon name="trash" className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <TextField
                      label="Semester"
                      name={`semester-${index}`}
                      type="number"
                      min="1"
                      step="1"
                      value={fee.semester}
                      error={fieldErrors.semester}
                      onChange={(event) => updateFee(index, 'semester', event.target.value)}
                    />
                    <TextField
                      label="Amount"
                      name={`amount-${index}`}
                      type="number"
                      min="0"
                      step="1"
                      leading="₹"
                      value={fee.amount}
                      error={fieldErrors.amount}
                      onChange={(event) => updateFee(index, 'amount', event.target.value)}
                    />
                    <TextField
                      label="Paid amount"
                      name={`paid-${index}`}
                      type="number"
                      min="0"
                      step="1"
                      leading="₹"
                      value={fee.paidAmount}
                      error={fieldErrors.paidAmount}
                      onChange={(event) => updateFee(index, 'paidAmount', event.target.value)}
                    />
                    <TextField
                      label="Due date"
                      name={`due-${index}`}
                      type="date"
                      value={fee.dueDate}
                      onChange={(event) => updateFee(index, 'dueDate', event.target.value)}
                    />
                    <TextField
                      label="Paid date"
                      name={`paid-date-${index}`}
                      type="date"
                      value={fee.paidDate}
                      onChange={(event) => updateFee(index, 'paidDate', event.target.value)}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-line px-4 py-8 text-center">
            <p className="text-sm font-semibold text-heading">No semester fees yet</p>
            <p className="mt-1 text-sm text-muted">Add a semester when the fee for that term is known.</p>
          </div>
        )}
      </section>

      <div className="flex flex-wrap justify-end gap-3">
        <Link
          to={paths.students}
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
