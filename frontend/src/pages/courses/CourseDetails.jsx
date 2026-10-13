import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Button from '@/components/common/Button'
import ConfirmDialog from '@/components/courses/ConfirmDialog'
import { paths } from '@/routes/paths'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { deleteCourse } from '@/store/slices/coursesSlice'
import { formatInr } from '@/utils/currency'

export default function CourseDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const course = useAppSelector((state) => state.courses.items.find((item) => item.id === id))
  const [confirming, setConfirming] = useState(false)

  if (!course) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-white p-8 text-center">
        <h2 className="text-xl font-semibold text-heading">This course is not in the catalogue</h2>
        <Link to={paths.courses} className="mt-4 inline-flex text-sm font-semibold text-logo hover:underline">
          Back to courses
        </Link>
      </div>
    )
  }

  const saving =
    course.offerPrice !== null && course.offerPrice < course.fee ? course.fee - course.offerPrice : 0

  function handleDelete() {
    dispatch(deleteCourse(course.id))
    navigate(paths.courses)
  }

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-sm text-muted">
        <Link to={paths.courses} className="font-semibold text-logo hover:underline">
          Courses
        </Link>
        <span className="px-2">/</span>
        Details
      </p>

      <div className="mt-4 overflow-hidden rounded-2xl bg-shade text-white">
        <div className="flex flex-wrap items-start justify-between gap-4 p-6 sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">{course.type}</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">{course.name}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">{course.description}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              course.isActive ? 'bg-primary text-white' : 'bg-white/15 text-white'
            }`}
          >
            {course.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <section className="rounded-2xl border border-line bg-white p-6">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Subjects</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {course.subjects.map((subject) => (
              <li key={subject} className="rounded-full bg-logo/10 px-3 py-1.5 text-sm font-medium text-logo">
                {subject}
              </li>
            ))}
          </ul>
          <h3 className="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-muted">Description</h3>
          <p className="mt-3 text-sm leading-7 text-heading">{course.description}</p>
        </section>

        <aside className="h-fit rounded-2xl border border-line bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Fees</p>
          <p className="mt-3 text-3xl font-semibold text-heading">
            {formatInr(course.offerPrice ?? course.fee)}
          </p>
          {course.offerPrice !== null ? (
            <p className="mt-1 text-sm text-muted">
              <span className="line-through">{formatInr(course.fee)}</span>
              {saving > 0 ? <span className="ml-2 font-semibold text-primary">Save {formatInr(saving)}</span> : null}
            </p>
          ) : (
            <p className="mt-1 text-sm text-muted">No offer price</p>
          )}

          <dl className="mt-6 space-y-4 border-t border-line pt-5 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted">Duration</dt>
              <dd className="font-semibold text-heading">{course.duration}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted">Requirement</dt>
              <dd className="font-semibold text-heading">{course.requirement}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted">Type</dt>
              <dd className="font-semibold text-heading">{course.type}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted">Subjects</dt>
              <dd className="font-semibold text-heading">{course.subjects.length}</dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-col gap-2">
            <Link
              to={paths.courseEdit(course.id)}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-white hover:bg-primary-dark"
            >
              Edit course
            </Link>
            <Button variant="ghost" onClick={() => setConfirming(true)}>
              Delete course
            </Button>
          </div>
        </aside>
      </div>

      {confirming ? (
        <ConfirmDialog
          title="Delete this course?"
          description={`${course.name} will be removed from the catalogue on this screen.`}
          onClose={() => setConfirming(false)}
          onConfirm={handleDelete}
        />
      ) : null}
    </div>
  )
}
