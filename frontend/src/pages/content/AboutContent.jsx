import { useState } from 'react'
import Alert from '@/components/common/Alert'
import Button from '@/components/common/Button'
import TextArea from '@/components/common/TextArea'
import TextField from '@/components/common/TextField'
import AboutPreview from '@/components/content/AboutPreview'
import ContentTabs from '@/components/content/ContentTabs'
import ImageField from '@/components/content/ImageField'
import { instituteName, seedAbout } from '@/constants/content'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { saveAbout } from '@/store/slices/contentSlice'

const requiredFields = [
  ['heroEyebrow', 'Eyebrow is required.'],
  ['heroTitle', 'Heading is required.'],
  ['heroDescription', 'Description is required.'],
  ['storyEyebrow', 'Eyebrow is required.'],
  ['storyTitle', 'Heading is required.'],
  ['storyBody', 'Story is required.'],
  ['missionTitle', 'Mission title is required.'],
  ['missionText', 'Mission text is required.'],
  ['valuesTitle', 'Values title is required.'],
  ['valuesText', 'Values text is required.'],
]

export default function AboutContent() {
  const dispatch = useAppDispatch()
  const stored = useAppSelector((state) => state.content.about) || seedAbout
  const [about, setAbout] = useState(stored)
  const [errors, setErrors] = useState({})
  const [saved, setSaved] = useState(false)

  function update(field, value) {
    setAbout((current) => ({ ...current, [field]: value }))
    setSaved(false)
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = {}
    requiredFields.forEach(([field, message]) => {
      nextErrors[field] = about[field].trim() ? '' : message
    })
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    const savedAbout = { ...about }
    requiredFields.forEach(([field]) => {
      savedAbout[field] = about[field].trim()
    })
    dispatch(saveAbout(savedAbout))
    setSaved(true)
  }

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-logo">{instituteName}</p>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight text-heading">Content</h2>
      <p className="mt-1 max-w-2xl text-sm text-muted">
        The About Us page: the blue introduction, the story, and the mission and values cards.
      </p>
      <div className="mt-6">
        <ContentTabs active="About us" />
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        {saved ? <Alert tone="success">About us content saved for this visit.</Alert> : null}

        <section className="space-y-4 rounded-2xl border border-line bg-white p-5 sm:p-6">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Introduction</h3>
          <TextField
            label="Eyebrow"
            name="heroEyebrow"
            value={about.heroEyebrow}
            error={errors.heroEyebrow}
            onChange={(event) => update('heroEyebrow', event.target.value)}
          />
          <TextField
            label="Heading"
            name="heroTitle"
            value={about.heroTitle}
            error={errors.heroTitle}
            onChange={(event) => update('heroTitle', event.target.value)}
          />
          <TextArea
            label="Description"
            name="heroDescription"
            rows={4}
            value={about.heroDescription}
            error={errors.heroDescription}
            onChange={(event) => update('heroDescription', event.target.value)}
          />
        </section>

        <section className="space-y-4 rounded-2xl border border-line bg-white p-5 sm:p-6">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Our story</h3>
          <ImageField
            label="Image"
            value={about.storyImage}
            emptyLabel="Choose the story image"
            onChange={(storyImage) => update('storyImage', storyImage)}
          />
          <TextField
            label="Eyebrow"
            name="storyEyebrow"
            value={about.storyEyebrow}
            error={errors.storyEyebrow}
            onChange={(event) => update('storyEyebrow', event.target.value)}
          />
          <TextField
            label="Heading"
            name="storyTitle"
            value={about.storyTitle}
            error={errors.storyTitle}
            onChange={(event) => update('storyTitle', event.target.value)}
          />
          <TextArea
            label="Story"
            name="storyBody"
            rows={5}
            value={about.storyBody}
            error={errors.storyBody}
            onChange={(event) => update('storyBody', event.target.value)}
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-4 rounded-2xl border border-line bg-white p-5 sm:p-6">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Our mission</h3>
            <TextField
              label="Title"
              name="missionTitle"
              value={about.missionTitle}
              error={errors.missionTitle}
              onChange={(event) => update('missionTitle', event.target.value)}
            />
            <TextArea
              label="Text"
              name="missionText"
              rows={3}
              value={about.missionText}
              error={errors.missionText}
              onChange={(event) => update('missionText', event.target.value)}
            />
          </div>
          <div className="space-y-4 rounded-2xl border border-line bg-white p-5 sm:p-6">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Our values</h3>
            <TextField
              label="Title"
              name="valuesTitle"
              value={about.valuesTitle}
              error={errors.valuesTitle}
              onChange={(event) => update('valuesTitle', event.target.value)}
            />
            <TextArea
              label="Text"
              name="valuesText"
              rows={3}
              value={about.valuesText}
              error={errors.valuesText}
              onChange={(event) => update('valuesText', event.target.value)}
            />
          </div>
        </section>

        <div className="flex justify-end">
          <Button type="submit">Save about us</Button>
        </div>
      </form>

      <div className="mt-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted">About us preview</p>
        <AboutPreview about={about} />
      </div>
    </div>
  )
}
