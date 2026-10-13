import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '@/components/common/Icon'
import ConfirmDialog from '@/components/courses/ConfirmDialog'
import ContentTabs from '@/components/content/ContentTabs'
import { paths } from '@/routes/paths'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { deleteGalleryImage } from '@/store/slices/contentSlice'

export default function GalleryList() {
  const dispatch = useAppDispatch()
  const gallery = useAppSelector((state) => state.content.gallery)
  const [pending, setPending] = useState(null)

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-logo">Coding Hubs Institute</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-heading">Content</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            Gallery images and the institute footer shown on the client site.
          </p>
        </div>
        <Link
          to={paths.galleryNew}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          <Icon name="plus" className="h-4 w-4" />
          Add image
        </Link>
      </div>

      <div className="mt-6">
        <ContentTabs active="Gallery" />
      </div>

      {gallery.length ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {gallery.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-2xl border border-line bg-white">
              <div className="aspect-[4/3] bg-surface">
                <img src={item.image} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <h3 className="min-w-0 truncate text-sm font-semibold text-heading">{item.title}</h3>
                <div className="flex shrink-0 gap-1">
                  <Link
                    to={paths.galleryEdit(item.id)}
                    aria-label={`Edit ${item.title}`}
                    className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-surface hover:text-heading"
                  >
                    <Icon name="pencil" className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    aria-label={`Delete ${item.title}`}
                    className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-surface hover:text-red-600"
                    onClick={() => setPending(item)}
                  >
                    <Icon name="trash" className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-line bg-white px-6 py-16 text-center">
          <h3 className="text-lg font-semibold text-heading">No gallery images yet</h3>
          <p className="mt-1 text-sm text-muted">Add an image and a title for the client gallery.</p>
        </div>
      )}

      {pending ? (
        <ConfirmDialog
          title="Delete this image?"
          description={`${pending.title} will be removed from the gallery on this screen.`}
          onClose={() => setPending(null)}
          onConfirm={() => {
            dispatch(deleteGalleryImage(pending.id))
            setPending(null)
          }}
        />
      ) : null}
    </div>
  )
}
