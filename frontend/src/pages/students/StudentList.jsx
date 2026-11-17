import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { courseApi } from '@/api/courseApi'
import Alert from '@/components/common/Alert'
import Icon from '@/components/common/Icon'
import ConfirmDialog from '@/components/courses/ConfirmDialog'
import { paths } from '@/routes/paths'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearStudentFeedback, deleteStudent, fetchStudents } from '@/store/slices/studentsSlice'
import { formatDate } from '@/utils/format'

const PAGE_SIZE = 20

export default function StudentList() {
  const dispatch = useAppDispatch()
  const { items, pagination, status, request, error } = useAppSelector((state) => state.students)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const [courseId, setCourseId] = useState('')
  const [courses, setCourses] = useState([])
  const loadMoreRef = useRef(null)
  const loadingRef = useRef(false)
  const loading = status === 'loading' && request.startsWith('students/fetchAll')
  const deleting = status === 'loading' && request.startsWith('students/delete')
  const filtering = Boolean(query.trim() || courseId)
  const loadingMore = loading && items.length > 0

  useEffect(() => {
    if (!loading) loadingRef.current = false
  }, [loading])

  useEffect(() => {
    let cancelled = false
    async function loadCourses() {
      const collected = []
      let nextPage = 1
      let hasNextPage = true
      while (hasNextPage && nextPage <= 10) {
        const data = await courseApi.list({ page: nextPage, limit: 100 })
        const batch = Array.isArray(data?.courses) ? data.courses : []
        collected.push(...batch)
        hasNextPage = Boolean(data?.pagination?.hasNextPage) && batch.length > 0
        nextPage += 1
      }
      if (cancelled) return
      setCourses(
        collected
          .map((course) => ({
            id: String(course.id || course._id || ''),
            title: course.title || 'Untitled course',
          }))
          .filter((course) => course.id),
      )
    }
    loadCourses().catch(() => {
      if (!cancelled) setCourses([])
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    dispatch(clearStudentFeedback())
    const timer = window.setTimeout(
      () => {
        dispatch(fetchStudents({ page, limit: PAGE_SIZE, search: query.trim(), course: courseId }))
      },
      query.trim() ? 300 : 0,
    )
    return () => window.clearTimeout(timer)
  }, [dispatch, page, query, courseId])

  useEffect(() => {
    const node = loadMoreRef.current
    if (!node || !pagination.hasNextPage) return undefined
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        if (loadingRef.current) return
        loadingRef.current = true
        setPage((current) => current + 1)
      },
      { rootMargin: '240px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [pagination.hasNextPage, items.length, loading])

  async function handleDelete() {
    if (!pendingDelete) return
    await dispatch(deleteStudent(pendingDelete.id))
    setPendingDelete(null)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-logo">Institute</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-heading">Students</h2>
          <p className="mt-1 text-sm text-muted">
            {pagination.total} {pagination.total === 1 ? 'student' : 'students'}
          </p>
        </div>
        <Link
          to={paths.studentNew}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          <Icon name="plus" className="h-4 w-4" />
          Add student
        </Link>
      </div>

      <div className="flex flex-nowrap items-center gap-3">
        <label className="min-w-0 flex-1">
          <span className="sr-only">Search students</span>
          <input
            value={query}
            placeholder="Search name, ID, email, or contact"
            className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-heading outline-none transition placeholder:text-muted/70 focus:border-logo focus:ring-4 focus:ring-logo/15"
            onChange={(event) => {
              setQuery(event.target.value)
              setPage(1)
            }}
          />
        </label>
        <label className="w-72 shrink-0">
          <span className="sr-only">Filter by course</span>
          <select
            value={courseId}
            className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-heading outline-none transition focus:border-logo focus:ring-4 focus:ring-logo/15"
            onChange={(event) => {
              setCourseId(event.target.value)
              setPage(1)
            }}
          >
            <option value="">All courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error ? <Alert>{error}</Alert> : null}

      <section className="overflow-hidden rounded-2xl border border-line bg-white">
        {loading && !items.length ? (
          <div className="px-6 py-16 text-center">
            <h3 className="text-lg font-semibold text-heading">Loading students</h3>
            <p className="mt-1 text-sm text-muted">Fetching the latest list from the server.</p>
          </div>
        ) : items.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] text-left text-sm">
              <thead className="bg-surface text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                <tr>
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Student ID</th>
                  <th className="px-4 py-3 font-semibold">Course</th>
                  <th className="px-4 py-3 font-semibold">Contact</th>
                  <th className="px-4 py-3 font-semibold">Enrolled</th>
                  <th className="px-4 py-3 font-semibold">Reference</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((student) => (
                  <tr key={student.id} className="border-t border-line align-middle hover:bg-surface/70">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-heading">{student.name}</p>
                      <p className="mt-0.5 text-xs text-muted">{student.fatherName}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-full bg-logo/10 px-2.5 py-1 text-xs font-semibold text-logo">
                        {student.uuid}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-heading">{student.course?.title || '—'}</td>
                    <td className="px-4 py-4">
                      <p className="whitespace-nowrap text-heading">{student.contact}</p>
                      <p className="mt-0.5 text-xs text-muted">{student.email}</p>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-heading">{formatDate(student.enrollmentDate)}</td>
                    <td className="px-4 py-4 text-heading">{student.reference?.name || '—'}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={paths.studentDetails(student.id)}
                          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-line bg-white px-3 text-xs font-semibold text-heading hover:bg-surface"
                        >
                          <Icon name="eye" className="h-3.5 w-3.5" />
                          View
                        </Link>
                        <Link
                          to={paths.studentEdit(student.id)}
                          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-line bg-white px-3 text-xs font-semibold text-heading hover:bg-surface"
                        >
                          <Icon name="pencil" className="h-3.5 w-3.5" />
                          Edit
                        </Link>
                        <button
                          type="button"
                          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-line bg-white px-3 text-xs font-semibold text-heading hover:bg-surface hover:text-red-600"
                          onClick={() => setPendingDelete(student)}
                        >
                          <Icon name="trash" className="h-3.5 w-3.5" />
                          Delete
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
            <h3 className="text-lg font-semibold text-heading">
              {filtering ? 'No students match these filters' : 'No students yet'}
            </h3>
            <p className="mt-1 text-sm text-muted">
              {filtering
                ? 'Try another name, student ID, email, contact, or course.'
                : 'Add a student with course, contact details, and semester fees.'}
            </p>
          </div>
        )}
        {items.length && loadingMore ? (
          <p className="border-t border-line px-6 py-4 text-center text-sm text-muted">Loading more students</p>
        ) : null}
        {items.length && pagination.hasNextPage ? <div ref={loadMoreRef} className="h-px" aria-hidden="true" /> : null}
      </section>

      {pendingDelete ? (
        <ConfirmDialog
          title="Delete this student?"
          description={`${pendingDelete.name} will be removed from the students list.`}
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
