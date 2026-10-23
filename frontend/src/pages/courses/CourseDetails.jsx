import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Button from '@/components/common/Button'
import ConfirmDialog from '@/components/courses/ConfirmDialog'
import { formatDuration } from '@/constants/courses'
import { paths } from '@/routes/paths'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { deleteCourse, fetchCourseById } from '@/store/slices/coursesSlice'
import { formatInr } from '@/utils/currency'

function StatusBadge({ active, onLabel, offLabel }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        active ? 'bg-primary text-white' : 'bg-white/15 text-white'
      }`}
    >
      {active ? onLabel : offLabel}
    </span>
  )
}

export default function CourseDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { items, current, status, error } = useAppSelector((state) => state.courses)
  const course = items.find((item) => item.id === id) || (current?.id === id ? current : null)
  const [confirming, setConfirming] = useState(false)
  const loading = !course && status !== 'failed'

  useEffect(() => {
    dispatch(fetchCourseById(id))
  }, [dispatch, id])

  if (!course && !loading) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-white p-8 text-center">
        <h2 className="text-xl font-semibold text-heading">This course is not in the catalogue</h2>
        {error ? <p className="mt-2 text-sm text-muted">{error}</p> : null}
        <Link to={paths.courses} className="mt-4 inline-flex text-sm font-semibold text-logo hover:underline">
          Back to courses
        </Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-white p-8 text-center">
        <h2 className="text-xl font-semibold text-heading">Loading course</h2>
        <p className="mt-2 text-sm text-muted">Fetching the latest details from the server.</p>
      </div>
    )
  }

  const offer = Number(course.fees.offerPrice) || 0
  const price = Number(course.fees.price) || 0
  const saving = offer > 0 && offer < price ? price - offer : 0

  async function handleDelete() {
    const result = await dispatch(deleteCourse(course.id))
    if (deleteCourse.fulfilled.match(result)) navigate(paths.courses)
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
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
              {course.categoryName || 'Uncategorised'}
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">{course.title}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">{course.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge active={course.isActive} onLabel="Active" offLabel="Inactive" />
            <StatusBadge active={course.isPublished} onLabel="Published" offLabel="Unpublished" />
            <StatusBadge active={course.isFeatured} onLabel="Featured" offLabel="Not featured" />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <section className="rounded-2xl border border-line bg-white p-6">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Description</h3>
          <p className="mt-3 text-sm leading-7 text-heading">{course.description}</p>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2 text-sm">
            <div>
              <dt className="text-muted">Eligibility</dt>
              <dd className="mt-1 font-semibold text-heading">{course.eligibility || '—'}</dd>
            </div>
            <div>
              <dt className="text-muted">Duration</dt>
              <dd className="mt-1 font-semibold text-heading">{formatDuration(course.duration)}</dd>
            </div>
            <div>
              <dt className="text-muted">Category status</dt>
              <dd className="mt-1 font-semibold text-heading">
                {course.isParentActive ? 'Active' : 'Inactive'}
              </dd>
            </div>
            <div>
              <dt className="text-muted">Course status</dt>
              <dd className="mt-1 font-semibold text-heading">{course.isActive ? 'Active' : 'Inactive'}</dd>
            </div>
          </dl>
        </section>

        <aside className="h-fit rounded-2xl border border-line bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Fees</p>
          <p className="mt-3 text-3xl font-semibold text-heading">
            {formatInr(offer || price)}
          </p>
          {offer ? (
            <p className="mt-1 text-sm text-muted">
              <span className="line-through">{formatInr(price)}</span>
              {saving > 0 ? <span className="ml-2 font-semibold text-primary">Save {formatInr(saving)}</span> : null}
            </p>
          ) : (
            <p className="mt-1 text-sm text-muted">No offer price</p>
          )}

          <dl className="mt-6 space-y-4 border-t border-line pt-5 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted">Category</dt>
              <dd className="font-semibold text-heading">{course.categoryName || '—'}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted">Published</dt>
              <dd className="font-semibold text-heading">{course.isPublished ? 'Yes' : 'No'}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted">Featured</dt>
              <dd className="font-semibold text-heading">{course.isFeatured ? 'Yes' : 'No'}</dd>
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
          description={`${course.title} will be removed from the catalogue.`}
          onClose={() => setConfirming(false)}
          onConfirm={handleDelete}
        />
      ) : null}
    </div>
  )
}
