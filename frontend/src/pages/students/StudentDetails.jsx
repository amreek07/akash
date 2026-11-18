import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Button from '@/components/common/Button'
import ConfirmDialog from '@/components/courses/ConfirmDialog'
import { paths } from '@/routes/paths'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearStudentFeedback, deleteStudent, fetchStudentById } from '@/store/slices/studentsSlice'
import { formatInr } from '@/utils/currency'
import { formatDate } from '@/utils/format'

const statusLabel = {
  pending: 'Pending',
  partial: 'Partial',
  paid: 'Paid',
}

function statusClass(status) {
  if (status === 'paid') return 'bg-primary/10 text-primary'
  if (status === 'partial') return 'bg-gold/25 text-heading'
  return 'bg-surface text-muted'
}

export default function StudentDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { items, current, status, request, error } = useAppSelector((state) => state.students)
  const student = items.find((item) => item.id === id) || (current?.id === id ? current : null)
  const [confirming, setConfirming] = useState(false)
  const loading = !student && status !== 'failed'
  const deleting = status === 'loading' && request.startsWith('students/delete')

  useEffect(() => {
    dispatch(clearStudentFeedback())
    dispatch(fetchStudentById(id))
  }, [dispatch, id])

  if (!student && !loading) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-white p-8 text-center">
        <h2 className="text-xl font-semibold text-heading">This student is not in the list</h2>
        {error ? <p className="mt-2 text-sm text-muted">{error}</p> : null}
        <Link to={paths.students} className="mt-4 inline-flex text-sm font-semibold text-logo hover:underline">
          Back to students
        </Link>
      </div>
    )
  }

  if (loading || !student) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-white p-8 text-center">
        <h2 className="text-xl font-semibold text-heading">Loading student</h2>
        <p className="mt-2 text-sm text-muted">Fetching the latest details from the server.</p>
      </div>
    )
  }

  const fees = student.semesterFees || []
  const totalAmount = fees.reduce((sum, fee) => sum + (Number(fee.amount) || 0), 0)
  const totalPaid = fees.reduce((sum, fee) => sum + (Number(fee.paidAmount) || 0), 0)
  const fields = [
    { label: 'Student ID', value: student.uuid },
    { label: "Father's name", value: student.fatherName },
    { label: 'Date of birth', value: formatDate(student.dob) },
    { label: 'Contact', value: student.contact },
    { label: 'Email', value: student.email },
    { label: 'Course', value: student.course?.title || '—' },
    { label: 'Reference', value: student.reference?.name || '—' },
    { label: 'Enrollment date', value: formatDate(student.enrollmentDate) },
    { label: 'Course completion date', value: formatDate(student.courseCompletionDate) },
  ]

  async function handleDelete() {
    const result = await dispatch(deleteStudent(student.id))
    if (deleteStudent.fulfilled.match(result)) navigate(paths.students)
  }

  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-sm text-muted">
        <Link to={paths.students} className="font-semibold text-logo hover:underline">
          Students
        </Link>
        <span className="px-2">/</span>
        Details
      </p>

      <section className="mt-4 overflow-hidden rounded-2xl bg-shade text-white">
        <div className="flex flex-wrap items-start justify-between gap-4 p-6 sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">{student.uuid}</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">{student.name}</h2>
            <p className="mt-2 text-sm text-white/75">{student.course?.title || 'No course'}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to={paths.studentEdit(student.id)}
              className="inline-flex h-10 items-center rounded-lg bg-white px-4 text-sm font-semibold text-heading hover:bg-surface"
            >
              Edit
            </Link>
            <Button variant="danger" onClick={() => setConfirming(true)}>
              Delete
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-line bg-white">
        <h3 className="border-b border-line px-6 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-muted">
          Student details
        </h3>
        <dl className="divide-y divide-line">
          {fields.map((field) => (
            <div key={field.label} className="grid gap-1 px-6 py-4 sm:grid-cols-[220px_1fr] sm:items-center">
              <dt className="text-sm text-muted">{field.label}</dt>
              <dd className="text-sm font-semibold text-heading">{field.value || '—'}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-4 overflow-hidden rounded-2xl border border-line bg-white">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line px-6 py-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Semester fees</h3>
          <p className="text-sm text-muted">
            {formatInr(totalPaid)} paid of {formatInr(totalAmount)}
          </p>
        </div>
        {fees.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-surface text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                <tr>
                  <th className="px-6 py-3 font-semibold">Semester</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Paid</th>
                  <th className="px-4 py-3 font-semibold">Due</th>
                  <th className="px-4 py-3 font-semibold">Paid on</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {fees.map((fee) => (
                  <tr key={fee.id || fee.semester} className="border-t border-line">
                    <td className="px-6 py-4 font-semibold text-heading">{fee.semester}</td>
                    <td className="px-4 py-4 text-heading">{formatInr(fee.amount)}</td>
                    <td className="px-4 py-4 text-heading">{formatInr(fee.paidAmount)}</td>
                    <td className="px-4 py-4 text-heading">{formatDate(fee.dueDate)}</td>
                    <td className="px-4 py-4 text-heading">{formatDate(fee.paidDate)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(fee.status)}`}>
                        {statusLabel[fee.status] || 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="px-6 py-8 text-sm text-muted">No semester fees have been added for this student.</p>
        )}
      </section>

      {confirming ? (
        <ConfirmDialog
          title="Delete this student?"
          description={`${student.name} will be removed from the students list.`}
          loading={deleting}
          onClose={() => {
            if (!deleting) setConfirming(false)
          }}
          onConfirm={handleDelete}
        />
      ) : null}
    </div>
  )
}
