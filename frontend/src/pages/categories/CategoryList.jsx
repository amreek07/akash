import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '@/components/common/Icon'
import ConfirmDialog from '@/components/courses/ConfirmDialog'
import { paths } from '@/routes/paths'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { deleteCategory } from '@/store/slices/categoriesSlice'

export default function CategoryList() {
  const dispatch = useAppDispatch()
  const categories = useAppSelector((state) => state.categories.items)
  const [pendingDelete, setPendingDelete] = useState(null)
  const activeCount = categories.filter((category) => category.isActive).length

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-logo">Catalogue</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-heading">Categories</h2>
          <p className="mt-1 text-sm text-muted">
            {categories.length} categories · {activeCount} active
          </p>
        </div>
        <Link
          to={paths.categoryNew}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          <Icon name="plus" className="h-4 w-4" />
          Add category
        </Link>
      </div>

      {categories.length ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <article
              key={category.id}
              className="flex flex-col rounded-2xl border border-line bg-white p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="min-w-0 text-lg font-semibold tracking-tight text-heading">{category.name}</h3>
                <span
                  className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    category.isActive ? 'bg-primary/10 text-primary' : 'bg-surface text-muted'
                  }`}
                >
                  {category.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="mt-3 flex-1 text-sm leading-6 text-muted line-clamp-3">{category.description}</p>
              <div className="mt-5 flex gap-2 border-t border-line pt-4">
                <Link
                  to={paths.categoryEdit(category.id)}
                  className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-line bg-white text-sm font-semibold text-heading hover:bg-surface"
                >
                  <Icon name="pencil" className="h-4 w-4" />
                  Edit
                </Link>
                <button
                  type="button"
                  className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-line bg-white text-sm font-semibold text-heading hover:bg-surface hover:text-red-600"
                  onClick={() => setPendingDelete(category)}
                >
                  <Icon name="trash" className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-line bg-white px-6 py-16 text-center">
          <h3 className="text-lg font-semibold text-heading">No categories yet</h3>
          <p className="mt-1 text-sm text-muted">Add a category with a title, description, and status.</p>
        </div>
      )}

      {pendingDelete ? (
        <ConfirmDialog
          title="Delete this category?"
          description={`${pendingDelete.name} will be removed from the catalogue on this screen.`}
          onClose={() => setPendingDelete(null)}
          onConfirm={() => {
            dispatch(deleteCategory(pendingDelete.id))
            setPendingDelete(null)
          }}
        />
      ) : null}
    </div>
  )
}
