import { Link, useNavigate, useParams } from 'react-router-dom'
import CourseForm from '@/components/courses/CourseForm'
import { paths } from '@/routes/paths'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addCourse, updateCourse } from '@/store/slices/coursesSlice'

export default function CourseFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const course = useAppSelector((state) => state.courses.items.find((item) => item.id === id))
  const types = useAppSelector((state) => state.courses.types)
  const isEdit = Boolean(id)

  if (isEdit && !course) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-white p-8 text-center">
        <h2 className="text-xl font-semibold text-heading">This course is not in the catalogue</h2>
        <Link to={paths.courses} className="mt-4 inline-flex text-sm font-semibold text-logo hover:underline">
          Back to courses
        </Link>
      </div>
    )
  }

  function handleSubmit(values) {
    if (isEdit) {
      dispatch(updateCourse({ ...values, id: course.id }))
      navigate(paths.courseDetails(course.id))
      return
    }
    const nextId = `c-${Date.now()}`
    dispatch(addCourse({ ...values, id: nextId }))
    navigate(paths.courseDetails(nextId))
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
        The same form is used to create a course and to change one that is already in the catalogue.
      </p>
      <CourseForm
        key={course?.id || 'new'}
        initialValues={course}
        types={types}
        submitLabel={isEdit ? 'Save changes' : 'Add course'}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
