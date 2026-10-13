import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '@/components/common/Icon'
import ConfirmDialog from '@/components/courses/ConfirmDialog'
import { paths } from '@/routes/paths'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { deleteCourse } from '@/store/slices/coursesSlice'
import { formatInr } from '@/utils/currency'

function subjectPreview(subjects) {
  if (!subjects.length) return '—'
  const shown = subjects.slice(0, 2).join(', ')
  const extra = subjects.length - 2
  return extra > 0 ? `${shown} +${extra}` : shown
}

export default function CourseList() {
  const dispatch = useAppDispatch()
  const courses = useAppSelector((state) => state.courses.items)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [pendingDelete, setPendingDelete] = useState(null)

  const visibleCourses = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return courses.filter((course) => {
      const matchesStatus =
        status === 'all' || (status === 'active' ? course.isActive : !course.isActive)
      if (!matchesStatus) return false
      if (!needle) return true
      const haystack = [course.name, course.type, course.requirement, course.duration, ...course.subjects]
        .join(' ')
        .toLowerCase()
      return haystack.includes(needle)
    })
  }, [courses, query, status])

  const activeCount = courses.filter((course) => course.isActive).length

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-logo">Catalogue</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-heading">Courses</h2>
          <p className="mt-1 text-sm text-muted">
            {courses.length} courses · {activeCount} active
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

      <section className="overflow-hidden rounded-2xl border border-line bg-white">
        <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-4 sm:px-5">
          <label className="relative min-w-[220px] flex-1">
            <span className="sr-only">Search courses</span>
            <Icon name="search" className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={query}
              placeholder="Search name, type, or subject"
              className="h-11 w-full rounded-lg border border-line bg-surface pr-3 pl-9 text-sm text-heading outline-none transition placeholder:text-muted/70 focus:border-logo focus:bg-white focus:ring-4 focus:ring-logo/15"
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <div className="flex rounded-lg bg-surface p-1">
            {[
              ['all', 'All'],
              ['active', 'Active'],
              ['inactive', 'Inactive'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setStatus(value)}
                className={`h-9 rounded-md px-3 text-sm font-semibold ${
                  status === value ? 'bg-white text-heading shadow-sm' : 'text-muted'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {visibleCourses.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-surface text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                <tr>
                  <th className="px-5 py-3 font-semibold">Course</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Duration</th>
                  <th className="px-4 py-3 font-semibold">Requirement</th>
                  <th className="px-4 py-3 font-semibold">Subjects</th>
                  <th className="px-4 py-3 font-semibold">Fee</th>
                  <th className="px-4 py-3 font-semibold">Offer</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleCourses.map((course) => (
                  <tr key={course.id} className="border-t border-line align-top hover:bg-surface/70">
                    <td className="px-5 py-4">
                      <Link
                        to={paths.courseDetails(course.id)}
                        className="font-semibold text-heading hover:text-logo"
                      >
                        {course.name}
                      </Link>
                      <p className="mt-1 max-w-xs text-xs leading-5 text-muted line-clamp-2">{course.description}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-full bg-logo/10 px-2.5 py-1 text-xs font-semibold text-logo">
                        {course.type}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-heading">{course.duration}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-heading">{course.requirement}</td>
                    <td className="px-4 py-4 max-w-[180px] text-muted">{subjectPreview(course.subjects)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-heading">{formatInr(course.fee)}</td>
                    <td className="px-4 py-4 whitespace-nowrap font-semibold text-heading">
                      {course.offerPrice === null ? '—' : formatInr(course.offerPrice)}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          course.isActive ? 'bg-primary/10 text-primary' : 'bg-surface text-muted'
                        }`}
                      >
                        {course.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <Link
                          to={paths.courseDetails(course.id)}
                          title="View"
                          aria-label={`View ${course.name}`}
                          className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-white hover:text-logo"
                        >
                          <Icon name="eye" className="h-4 w-4" />
                        </Link>
                        <Link
                          to={paths.courseEdit(course.id)}
                          title="Edit"
                          aria-label={`Edit ${course.name}`}
                          className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-white hover:text-heading"
                        >
                          <Icon name="pencil" className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          title="Delete"
                          aria-label={`Delete ${course.name}`}
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

      {pendingDelete ? (
        <ConfirmDialog
          title="Delete this course?"
          description={`${pendingDelete.name} will be removed from the catalogue on this screen.`}
          onClose={() => setPendingDelete(null)}
          onConfirm={() => {
            dispatch(deleteCourse(pendingDelete.id))
            setPendingDelete(null)
          }}
        />
      ) : null}
    </div>
  )
}
