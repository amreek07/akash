import { Link, useNavigate, useParams } from 'react-router-dom'
import CategoryForm from '@/components/categories/CategoryForm'
import { paths } from '@/routes/paths'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addCategory, updateCategory } from '@/store/slices/categoriesSlice'

export default function CategoryFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const category = useAppSelector((state) => state.categories.items.find((item) => item.id === id))
  const isEdit = Boolean(id)

  if (isEdit && !category) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-white p-8 text-center">
        <h2 className="text-xl font-semibold text-heading">This category is not in the catalogue</h2>
        <Link to={paths.categories} className="mt-4 inline-flex text-sm font-semibold text-logo hover:underline">
          Back to categories
        </Link>
      </div>
    )
  }

  function handleSubmit(values) {
    if (isEdit) {
      dispatch(updateCategory({ ...values, id: category.id }))
    } else {
      dispatch(addCategory({ ...values, id: `cat-${Date.now()}` }))
    }
    navigate(paths.categories)
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
        onSubmit={handleSubmit}
      />
    </div>
  )
}
