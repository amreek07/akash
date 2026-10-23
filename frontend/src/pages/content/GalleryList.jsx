import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Alert from '@/components/common/Alert'
import Icon from '@/components/common/Icon'
import ConfirmDialog from '@/components/courses/ConfirmDialog'
import ContentTabs from '@/components/content/ContentTabs'
import { paths } from '@/routes/paths'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearGalleryFeedback, deleteGalleryImage, fetchGallery } from '@/store/slices/contentSlice'

const PAGE_SIZE = 50

export default function GalleryList() {
  const dispatch = useAppDispatch()
  const { gallery, galleryPagination, galleryStatus, galleryRequest, galleryError } = useAppSelector(
    (state) => state.content,
  )
  const [pending, setPending] = useState(null)
  const [page, setPage] = useState(1)
  const loading = galleryStatus === 'loading' && galleryRequest.startsWith('content/gallery/fetchAll')
  const deleting = galleryStatus === 'loading' && galleryRequest.startsWith('content/gallery/delete')

  useEffect(() => {
    dispatch(clearGalleryFeedback())
    dispatch(fetchGallery({ page, limit: PAGE_SIZE }))
  }, [dispatch, page])

  async function handleDelete() {
    if (!pending) return
    const result = await dispatch(deleteGalleryImage(pending.id))
    setPending(null)
    if (deleteGalleryImage.fulfilled.match(result)) {
      dispatch(fetchGallery({ page, limit: PAGE_SIZE }))
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-logo">Coding Hubs Institute</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-heading">Content</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            {galleryPagination.total} gallery images for the client site.
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

      {galleryError ? (
        <div className="mt-5">
          <Alert>{galleryError}</Alert>
        </div>
      ) : null}

      {loading && !gallery.length ? (
        <div className="mt-5 rounded-2xl border border-line bg-white px-6 py-16 text-center">
          <h3 className="text-lg font-semibold text-heading">Loading gallery</h3>
          <p className="mt-1 text-sm text-muted">Fetching the latest images from the server.</p>
        </div>
      ) : gallery.length ? (
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

      {galleryPagination.totalPages > 1 ? (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={!galleryPagination.hasPreviousPage || loading}
            className="inline-flex h-10 items-center rounded-lg border border-line bg-white px-4 text-sm font-semibold text-heading hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Previous
          </button>
          <p className="text-sm text-muted">
            Page {galleryPagination.page} of {galleryPagination.totalPages}
          </p>
          <button
            type="button"
            disabled={!galleryPagination.hasNextPage || loading}
            className="inline-flex h-10 items-center rounded-lg border border-line bg-white px-4 text-sm font-semibold text-heading hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </button>
        </div>
      ) : null}

      {pending ? (
        <ConfirmDialog
          title="Delete this image?"
          description={`${pending.title} will be removed from the gallery.`}
          loading={deleting}
          onClose={() => {
            if (!deleting) setPending(null)
          }}
          onConfirm={handleDelete}
        />
      ) : null}
    </div>
  )
}
