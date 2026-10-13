import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Button from '@/components/common/Button'
import TextField from '@/components/common/TextField'
import { paths } from '@/routes/paths'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addGalleryImage, updateGalleryImage } from '@/store/slices/contentSlice'

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Unable to read the image'))
    reader.readAsDataURL(file)
  })
}

export default function GalleryFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const image = useAppSelector((state) => state.content.gallery.find((item) => item.id === id))
  const isEdit = Boolean(id)
  const [title, setTitle] = useState(image?.title || '')
  const [preview, setPreview] = useState(image?.image || '')
  const [error, setError] = useState('')
  const [titleError, setTitleError] = useState('')

  if (isEdit && !image) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-white p-8 text-center">
        <h2 className="text-xl font-semibold text-heading">This image is not in the gallery</h2>
        <Link to={paths.contentGallery} className="mt-4 inline-flex text-sm font-semibold text-logo hover:underline">
          Back to gallery
        </Link>
      </div>
    )
  }

  async function handleFile(event) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Choose an image file.')
      return
    }
    const dataUrl = await readFile(file)
    setPreview(dataUrl)
    setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextTitleError = title.trim() ? '' : 'Title is required.'
    const nextImageError = preview ? '' : 'Add an image.'
    setTitleError(nextTitleError)
    setError(nextImageError)
    if (nextTitleError || nextImageError) return

    if (isEdit) {
      dispatch(updateGalleryImage({ id: image.id, title: title.trim(), image: preview }))
    } else {
      dispatch(addGalleryImage({ id: `g-${Date.now()}`, title: title.trim(), image: preview }))
    }
    navigate(paths.contentGallery)
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
          {preview ? <p className="mt-2 text-xs text-muted">Choose another file to replace this image.</p> : null}
        </div>
        <div className="flex flex-wrap justify-end gap-3">
          <Link
            to={paths.contentGallery}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-line bg-white px-4 text-sm font-semibold text-heading hover:bg-surface"
          >
            Cancel
          </Link>
          <Button type="submit">{isEdit ? 'Save image' : 'Add image'}</Button>
        </div>
      </form>
    </div>
  )
}
