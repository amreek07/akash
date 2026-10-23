import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CategoryForm from '@/components/categories/CategoryForm'
import { paths } from '@/routes/paths'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  clearCategoryFeedback,
  createCategory,
  fetchCategoryById,
  updateCategory,
} from '@/store/slices/categoriesSlice'

export default function CategoryFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { items, current, status, request, error } = useAppSelector((state) => state.categories)
  const isEdit = Boolean(id)
  const category = items.find((item) => item.id === id) || (current?.id === id ? current : null)
  const loadingCategory = isEdit && !category && status !== 'failed'
  const saving = status === 'loading' && (request.startsWith('categories/create') || request.startsWith('categories/update'))
  const saveError = status === 'failed' && (request.startsWith('categories/create') || request.startsWith('categories/update')) ? error : null

  useEffect(() => {
    dispatch(clearCategoryFeedback())
    if (isEdit) dispatch(fetchCategoryById(id))
  }, [dispatch, id, isEdit])

  if (isEdit && !category && !loadingCategory) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-white p-8 text-center">
        <h2 className="text-xl font-semibold text-heading">This category is not in the catalogue</h2>
        {error ? <p className="mt-2 text-sm text-muted">{error}</p> : null}
        <Link to={paths.categories} className="mt-4 inline-flex text-sm font-semibold text-logo hover:underline">
          Back to categories
        </Link>
      </div>
    )
  }

  if (loadingCategory) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-white p-8 text-center">
        <h2 className="text-xl font-semibold text-heading">Loading category</h2>
        <p className="mt-2 text-sm text-muted">Fetching the latest details from the server.</p>
      </div>
    )
  }

  async function handleSubmit(values) {
    const result = isEdit
      ? await dispatch(updateCategory({ id: category.id, ...values }))
      : await dispatch(createCategory(values))
    const succeeded = isEdit
      ? updateCategory.fulfilled.match(result)
      : createCategory.fulfilled.match(result)
    if (succeeded) navigate(paths.categories)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-sm text-muted">
        <Link to={paths.categories} className="font-semibold text-logo hover:underline">
          Categories
        </Link>
        <span className="px-2">/</span>
        {isEdit ? 'Edit' : 'Add'}
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-heading">
        {isEdit ? 'Edit category' : 'Add category'}
      </h2>
      <p className="mt-1 mb-6 text-sm text-muted">
        Set a title, description, and whether the category is active.
      </p>
      <CategoryForm
        key={category?.id || 'new'}
        initialValues={category}
        submitLabel={isEdit ? 'Save changes' : 'Add category'}
        loading={saving}
        error={saveError}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
