import { useState } from 'react'
import Alert from '@/components/common/Alert'
import Button from '@/components/common/Button'
import TextField from '@/components/common/TextField'
import ContentTabs from '@/components/content/ContentTabs'
import ImageField from '@/components/content/ImageField'
import { instituteName, seedGeneral } from '@/constants/content'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { saveGeneral } from '@/store/slices/contentSlice'

export default function GeneralContent() {
  const dispatch = useAppDispatch()
  const stored = useAppSelector((state) => state.content.general) || seedGeneral
  const [general, setGeneral] = useState(stored)
  const [yearError, setYearError] = useState('')
  const [saved, setSaved] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    const nextYearError = general.admissionYear.trim() ? '' : 'Admission year is required.'
    setYearError(nextYearError)
    if (nextYearError) return
    dispatch(saveGeneral({ logo: general.logo, admissionYear: general.admissionYear.trim() }))
    setSaved(true)
  }

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-logo">{instituteName}</p>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight text-heading">Content</h2>
      <p className="mt-1 max-w-2xl text-sm text-muted">
        Logo and the admission year shown for {instituteName}.
      </p>
      <div className="mt-6">
        <ContentTabs active="General" />
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        {saved ? <Alert tone="success">General content saved for this visit.</Alert> : null}
        <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
            <ImageField
              label="Logo"
              value={general.logo}
              emptyLabel="Choose a logo image"
              onChange={(logo) => {
                setGeneral((current) => ({ ...current, logo }))
                setSaved(false)
              }}
            />
            <TextField
              label="Admission year"
              name="admissionYear"
              value={general.admissionYear}
              error={yearError}
              placeholder="2026-27"
              onChange={(event) => {
                setGeneral((current) => ({ ...current, admissionYear: event.target.value }))
                setYearError('')
                setSaved(false)
              }}
            />
          </div>
        </section>
        <div className="flex justify-end">
          <Button type="submit">Save general</Button>
        </div>
      </form>

      <div className="mt-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted">General preview</p>
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-white px-5 py-4 shadow-[inset_0_0_0_1px_#e4e8ef]">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-logo text-white">
              {general.logo ? (
                <img src={general.logo} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-sm font-semibold">CH</span>
              )}
            </span>
            <p className="text-sm font-semibold text-heading">{instituteName}</p>
          </div>
          <p className="text-sm font-semibold text-logo">{general.admissionYear || 'Admission year'}</p>
        </div>
      </div>
    </div>
  )
}
