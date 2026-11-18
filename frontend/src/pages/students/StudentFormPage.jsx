import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { courseApi } from '@/api/courseApi'
import { partnerApi } from '@/api/partnerApi'
import StudentForm from '@/components/students/StudentForm'
import { paths } from '@/routes/paths'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearStudentFeedback, createStudent, fetchStudentById, updateStudent } from '@/store/slices/studentsSlice'
import { getErrorMessage } from '@/utils/apiError'

async function fetchPages(list, key) {
  const items = []
  let page = 1
  let hasNextPage = true
  while (hasNextPage && page <= 10) {
    const data = await list({ page, limit: 100 })
    const batch = Array.isArray(data?.[key]) ? data[key] : []
    items.push(...batch)
    hasNextPage = Boolean(data?.pagination?.hasNextPage) && batch.length > 0
    page += 1
  }
  return items
}

export default function StudentFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { items, current, status, request, error } = useAppSelector((state) => state.students)
  const isEdit = Boolean(id)
  const student = items.find((item) => item.id === id) || (current?.id === id ? current : null)
  const loadingStudent = isEdit && !student && status !== 'failed'
  const saving = status === 'loading' && (request.startsWith('students/create') || request.startsWith('students/update'))
  const saveError =
    status === 'failed' && (request.startsWith('students/create') || request.startsWith('students/update'))
      ? error
      : null
  const [courses, setCourses] = useState([])
  const [partners, setPartners] = useState([])
  const [optionsLoading, setOptionsLoading] = useState(true)
  const [optionsError, setOptionsError] = useState('')

  useEffect(() => {
    dispatch(clearStudentFeedback())
    if (isEdit) dispatch(fetchStudentById(id))
  }, [dispatch, id, isEdit])

  useEffect(() => {
    let cancelled = false
    async function loadOptions() {
      setOptionsLoading(true)
      setOptionsError('')
      try {
        const [courseItems, partnerItems] = await Promise.all([
          fetchPages(courseApi.list, 'courses'),
          fetchPages(partnerApi.list, 'partners'),
        ])
        if (cancelled) return
        setCourses(
          courseItems
            .map((course) => ({
              id: String(course.id || course._id || ''),
              title: course.title || 'Untitled course',
            }))
            .filter((course) => course.id),
        )
        setPartners(
          partnerItems
            .map((partner) => ({
              id: String(partner.id || partner._id || ''),
              name: partner.name || 'Partner',
              partnerId: partner.partnerId || '',
            }))
            .filter((partner) => partner.id),
        )
      } catch (loadError) {
        if (!cancelled) setOptionsError(getErrorMessage(loadError))
      } finally {
        if (!cancelled) setOptionsLoading(false)
      }
    }
    loadOptions()
    return () => {
      cancelled = true
    }
  }, [])

  if (isEdit && !student && !loadingStudent) {
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

  if (loadingStudent) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-white p-8 text-center">
        <h2 className="text-xl font-semibold text-heading">Loading student</h2>
        <p className="mt-2 text-sm text-muted">Fetching the latest details from the server.</p>
      </div>
    )
  }

  async function handleSubmit(values) {
    const result = isEdit
      ? await dispatch(updateStudent({ id: student.id, ...values }))
      : await dispatch(createStudent(values))
    const succeeded = isEdit ? updateStudent.fulfilled.match(result) : createStudent.fulfilled.match(result)
    if (succeeded) navigate(paths.students)
  }

  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-sm text-muted">
        <Link to={paths.students} className="font-semibold text-logo hover:underline">
          Students
        </Link>
        <span className="px-2">/</span>
        {isEdit ? 'Edit' : 'Add'}
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-heading">
        {isEdit ? 'Edit student' : 'Add student'}
      </h2>
      <p className="mt-1 mb-6 text-sm text-muted">
        Course is required. Reference is an optional partner. Semester fees can be added now or later.
      </p>
      {optionsError ? <p className="mb-4 text-sm text-red-600">{optionsError}</p> : null}
      <StudentForm
        key={student?.id || 'new'}
        initialValues={student}
        courses={courses}
        partners={partners}
        optionsLoading={optionsLoading}
        submitLabel={isEdit ? 'Save changes' : 'Add student'}
        loading={saving}
        error={saveError}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
