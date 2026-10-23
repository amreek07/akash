import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CourseForm from '@/components/courses/CourseForm'
import { paths } from '@/routes/paths'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchCategories } from '@/store/slices/categoriesSlice'
import {
  clearCourseFeedback,
  createCourse,
  fetchCourseById,
  updateCourse,
} from '@/store/slices/coursesSlice'

export default function CourseFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { items, current, status, request, error } = useAppSelector((state) => state.courses)
  const categories = useAppSelector((state) => state.categories.items)
  const isEdit = Boolean(id)
  const course = items.find((item) => item.id === id) || (current?.id === id ? current : null)
  const loadingCourse = isEdit && !course && status !== 'failed'
  const saving = status === 'loading' && (request.startsWith('courses/create') || request.startsWith('courses/update'))
  const saveError =
    status === 'failed' && (request.startsWith('courses/create') || request.startsWith('courses/update'))
      ? error
      : null

  useEffect(() => {
    dispatch(clearCourseFeedback())
    dispatch(fetchCategories({ page: 1, limit: 100 }))
    if (isEdit) dispatch(fetchCourseById(id))
  }, [dispatch, id, isEdit])

  if (isEdit && !course && !loadingCourse) {
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

  if (loadingCourse) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-white p-8 text-center">
        <h2 className="text-xl font-semibold text-heading">Loading course</h2>
        <p className="mt-2 text-sm text-muted">Fetching the latest details from the server.</p>
      </div>
    )
  }

  async function handleSubmit(values) {
    const result = isEdit
      ? await dispatch(updateCourse({ id: course.id, ...values }))
      : await dispatch(createCourse(values))
    const succeeded = isEdit ? updateCourse.fulfilled.match(result) : createCourse.fulfilled.match(result)
    if (succeeded) navigate(isEdit ? paths.courseDetails(course.id) : paths.courses)
  }

  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-sm text-muted">
        <Link to={paths.courses} className="font-semibold text-logo hover:underline">
          Courses
        </Link>
        <span className="px-2">/</span>
        {isEdit ? 'Edit' : 'Add'}
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-heading">
        {isEdit ? 'Edit course' : 'Add course'}
      </h2>
      <p className="mt-1 mb-6 max-w-2xl text-sm text-muted">
        Category, duration, fees, eligibility, and the course, featured, and published flags.
      </p>
      <CourseForm
        key={course?.id || 'new'}
        initialValues={course}
        categories={categories}
        submitLabel={isEdit ? 'Save changes' : 'Add course'}
        loading={saving}
        error={saveError}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
