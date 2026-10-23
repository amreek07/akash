import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Alert from '@/components/common/Alert'
import Icon from '@/components/common/Icon'
import ToggleSwitch from '@/components/common/ToggleSwitch'
import ConfirmDialog from '@/components/courses/ConfirmDialog'
import { formatDuration } from '@/constants/courses'
import { paths } from '@/routes/paths'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  clearCourseFeedback,
  deleteCourse,
  fetchCourses,
  toggleCourseFeatured,
  toggleCoursePublished,
} from '@/store/slices/coursesSlice'
import { formatInr } from '@/utils/currency'

const PAGE_SIZE = 50

function StatusBadge({ active, onLabel = 'Active', offLabel = 'Inactive' }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        active ? 'bg-primary/10 text-primary' : 'bg-surface text-muted'
      }`}
    >
      {active ? onLabel : offLabel}
    </span>
  )
}

export default function CourseList() {
  const dispatch = useAppDispatch()
  const { items, pagination, status, request, error } = useAppSelector((state) => state.courses)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [pendingDelete, setPendingDelete] = useState(null)
  const loading = status === 'loading' && request.startsWith('courses/fetchAll')
  const deleting = status === 'loading' && request.startsWith('courses/delete')
  const publishedCount = items.filter((course) => course.isPublished).length

  useEffect(() => {
    dispatch(clearCourseFeedback())
    const handle = setTimeout(() => {
      dispatch(fetchCourses({ page, limit: PAGE_SIZE, search: query.trim() }))
    }, query ? 300 : 0)
    return () => clearTimeout(handle)
  }, [dispatch, page, query])

  async function handleDelete() {
    if (!pendingDelete) return
    const result = await dispatch(deleteCourse(pendingDelete.id))
    setPendingDelete(null)
    if (deleteCourse.fulfilled.match(result)) {
      dispatch(fetchCourses({ page, limit: PAGE_SIZE, search: query.trim() }))
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-logo">Catalogue</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-heading">Courses</h2>
          <p className="mt-1 text-sm text-muted">
            {pagination.total} courses · {publishedCount} published on this page
          </p>
        </div>
        <Link
          to={paths.courseNew}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          <Icon name="plus" className="h-4 w-4" />
          Add course
        </Link>
      </div>

      {error ? <Alert>{error}</Alert> : null}

      <section className="overflow-hidden rounded-2xl border border-line bg-white">
        <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-4 sm:px-5">
          <label className="relative min-w-[220px] flex-1">
            <span className="sr-only">Search courses</span>
            <Icon name="search" className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={query}
              placeholder="Search course title"
              className="h-11 w-full rounded-lg border border-line bg-surface pr-3 pl-9 text-sm text-heading outline-none transition placeholder:text-muted/70 focus:border-logo focus:bg-white focus:ring-4 focus:ring-logo/15"
              onChange={(event) => {
                setPage(1)
                setQuery(event.target.value)
              }}
            />
          </label>
        </div>

        {loading && !items.length ? (
          <div className="px-6 py-16 text-center">
            <h3 className="text-lg font-semibold text-heading">Loading courses</h3>
            <p className="mt-1 text-sm text-muted">Fetching the latest list from the server.</p>
          </div>
        ) : items.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] text-left text-sm">
              <thead className="bg-surface text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                <tr>
                  <th className="px-5 py-3 font-semibold">Course</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Duration</th>
                  <th className="px-4 py-3 font-semibold">Eligibility</th>
                  <th className="px-4 py-3 font-semibold">Fees</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Featured</th>
                  <th className="px-4 py-3 font-semibold">Published</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((course) => (
                  <tr key={course.id} className="border-t border-line align-top hover:bg-surface/70">
                    <td className="px-5 py-4">
                      <Link
                        to={paths.courseDetails(course.id)}
                        className="font-semibold text-heading hover:text-logo"
                      >
                        {course.title}
                      </Link>
                      <p className="mt-1 max-w-xs text-xs leading-5 text-muted line-clamp-2">{course.description}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-heading">{course.categoryName || '—'}</p>
                      <p className="mt-1">
                        <StatusBadge
                          active={course.isParentActive}
                          onLabel="Category on"
                          offLabel="Category off"
                        />
                      </p>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-heading">{formatDuration(course.duration)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-heading">{course.eligibility || '—'}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <p className="font-semibold text-heading">
                        {course.fees.offerPrice
                          ? formatInr(course.fees.offerPrice)
                          : formatInr(course.fees.price)}
                      </p>
                      {course.fees.offerPrice ? (
                        <p className="text-xs text-muted line-through">{formatInr(course.fees.price)}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge active={course.isActive} />
                    </td>
                    <td className="px-4 py-4">
                      <ToggleSwitch
                        size="sm"
                        checked={course.isFeatured}
                        ariaLabel={`Featured ${course.title}`}
                        onChange={() => dispatch(toggleCourseFeatured(course.id))}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <ToggleSwitch
                        size="sm"
                        checked={course.isPublished}
                        ariaLabel={`Published ${course.title}`}
                        onChange={() => dispatch(toggleCoursePublished(course.id))}
                      />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <Link
                          to={paths.courseDetails(course.id)}
                          title="View"
                          aria-label={`View ${course.title}`}
                          className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-white hover:text-logo"
                        >
                          <Icon name="eye" className="h-4 w-4" />
                        </Link>
                        <Link
                          to={paths.courseEdit(course.id)}
                          title="Edit"
                          aria-label={`Edit ${course.title}`}
                          className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-white hover:text-heading"
                        >
                          <Icon name="pencil" className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          title="Delete"
                          aria-label={`Delete ${course.title}`}
                          className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-white hover:text-red-600"
                          onClick={() => setPendingDelete(course)}
                        >
                          <Icon name="trash" className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <h3 className="text-lg font-semibold text-heading">No courses match this view</h3>
            <p className="mt-1 text-sm text-muted">Clear the search or add a course to the catalogue.</p>
          </div>
        )}
      </section>

      {pagination.totalPages > 1 ? (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={!pagination.hasPreviousPage || loading}
            className="inline-flex h-10 items-center rounded-lg border border-line bg-white px-4 text-sm font-semibold text-heading hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Previous
          </button>
          <p className="text-sm text-muted">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <button
            type="button"
            disabled={!pagination.hasNextPage || loading}
            className="inline-flex h-10 items-center rounded-lg border border-line bg-white px-4 text-sm font-semibold text-heading hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </button>
        </div>
      ) : null}

      {pendingDelete ? (
        <ConfirmDialog
          title="Delete this course?"
          description={`${pendingDelete.title} will be removed from the catalogue.`}
          loading={deleting}
          onClose={() => {
            if (!deleting) setPendingDelete(null)
          }}
          onConfirm={handleDelete}
        />
      ) : null}
    </div>
  )
}
