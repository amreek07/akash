import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Alert from '@/components/common/Alert'
import Button from '@/components/common/Button'
import TextField from '@/components/common/TextField'
import { paths } from '@/routes/paths'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  clearGalleryFeedback,
  createGalleryImage,
  fetchGalleryById,
  updateGalleryImage,
} from '@/store/slices/contentSlice'

const MAX_IMAGE_BYTES = 5 * 1024 * 1024

export default function GalleryFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { gallery, galleryCurrent, galleryStatus, galleryRequest, galleryError } = useAppSelector(
    (state) => state.content,
  )
  const isEdit = Boolean(id)
  const image = gallery.find((item) => item.id === id) || (galleryCurrent?.id === id ? galleryCurrent : null)
  const loadingImage = isEdit && !image && galleryStatus !== 'failed'
  const saving =
    galleryStatus === 'loading' &&
    (galleryRequest.startsWith('content/gallery/create') || galleryRequest.startsWith('content/gallery/update'))
  const saveError =
    galleryStatus === 'failed' &&
    (galleryRequest.startsWith('content/gallery/create') || galleryRequest.startsWith('content/gallery/update'))
      ? galleryError
      : null

  const [title, setTitle] = useState(image?.title || '')
  const [preview, setPreview] = useState(image?.image || '')
  const [imageFile, setImageFile] = useState(null)
  const [error, setError] = useState('')
  const [titleError, setTitleError] = useState('')

  useEffect(() => {
    dispatch(clearGalleryFeedback())
    if (isEdit) dispatch(fetchGalleryById(id))
  }, [dispatch, id, isEdit])

  useEffect(() => {
    if (!image) return
    setTitle(image.title || '')
    setPreview((current) => (imageFile ? current : image.image || ''))
  }, [image, imageFile])

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview)
    }
  }, [preview])

  function handleFile(event) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Choose an image file.')
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError('Image must be 5MB or smaller.')
      return
    }
    if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview)
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const nextTitleError = title.trim() ? '' : 'Title is required.'
    const nextImageError = preview || imageFile ? '' : 'Add an image.'
    setTitleError(nextTitleError)
    setError(nextImageError)
    if (nextTitleError || nextImageError) return

    const formData = new FormData()
    formData.append('title', title.trim())
    if (imageFile) formData.append('image', imageFile)

    const result = isEdit
      ? await dispatch(updateGalleryImage({ id: image.id, payload: formData }))
      : await dispatch(createGalleryImage(formData))
    const succeeded = isEdit
      ? updateGalleryImage.fulfilled.match(result)
      : createGalleryImage.fulfilled.match(result)
    if (succeeded) navigate(paths.contentGallery)
  }

  if (isEdit && !image && !loadingImage) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-white p-8 text-center">
        <h2 className="text-xl font-semibold text-heading">This image is not in the gallery</h2>
        {galleryError ? <p className="mt-2 text-sm text-muted">{galleryError}</p> : null}
        <Link to={paths.contentGallery} className="mt-4 inline-flex text-sm font-semibold text-logo hover:underline">
          Back to gallery
        </Link>
      </div>
    )
  }

  if (loadingImage) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-white p-8 text-center">
        <h2 className="text-xl font-semibold text-heading">Loading image</h2>
        <p className="mt-2 text-sm text-muted">Fetching the latest details from the server.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-sm text-muted">
        <Link to={paths.contentGallery} className="font-semibold text-logo hover:underline">
          Gallery
        </Link>
        <span className="px-2">/</span>
        {isEdit ? 'Edit' : 'Add'}
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-heading">
        {isEdit ? 'Edit image' : 'Add image'}
      </h2>
      <p className="mt-1 mb-6 text-sm text-muted">Each gallery item is an image with a title.</p>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-line bg-white p-5 sm:p-6">
        {saveError ? <Alert>{saveError}</Alert> : null}
        <TextField
          label="Title"
          name="title"
          value={title}
          error={titleError}
          placeholder="Computer lab"
          onChange={(event) => {
            setTitle(event.target.value)
            setTitleError('')
          }}
        />
        <div>
          <p className="mb-1.5 text-sm font-medium text-heading">Image</p>
          <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-line bg-surface text-center">
            {preview ? (
              <img src={preview} alt="" className="max-h-64 w-full object-cover" />
            ) : (
              <span className="px-6 py-10 text-sm text-muted">Choose an image to upload</span>
            )}
            <input type="file" accept="image/*" className="sr-only" onChange={handleFile} />
          </label>
          {error ? <p className="mt-1.5 text-xs text-red-600">{error}</p> : null}
          {preview ? (
            <p className="mt-2 text-xs text-muted">Choose another file to replace this image. Maximum 5MB.</p>
          ) : (
            <p className="mt-2 text-xs text-muted">JPG, PNG, GIF, or WebP. Maximum 5MB.</p>
          )}
        </div>
        <div className="flex flex-wrap justify-end gap-3">
          <Link
            to={paths.contentGallery}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-line bg-white px-4 text-sm font-semibold text-heading hover:bg-surface"
          >
            Cancel
          </Link>
          <Button type="submit" loading={saving}>
            {isEdit ? 'Save image' : 'Add image'}
          </Button>
        </div>
      </form>
    </div>
  )
}
