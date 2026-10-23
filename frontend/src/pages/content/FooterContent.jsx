import { useEffect, useState } from 'react'
import Alert from '@/components/common/Alert'
import Button from '@/components/common/Button'
import TextArea from '@/components/common/TextArea'
import TextField from '@/components/common/TextField'
import ContentTabs from '@/components/content/ContentTabs'
import FooterPreview from '@/components/content/FooterPreview'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearFooterFeedback, fetchFooter, toFooter, updateFooter } from '@/store/slices/contentSlice'
import { validateEmail } from '@/utils/validators'

function cloneFooter(footer) {
  const next = toFooter(footer)
  return {
    ...next,
    quickLinks: next.quickLinks.map((link) => ({ ...link })),
    popularCourses: next.popularCourses.map((course) => ({ ...course })),
  }
}

function RowActions({ onRemove, label }) {
  return (
    <button type="button" onClick={onRemove} className="h-11 shrink-0 px-2 text-sm font-semibold text-red-600">
      {label}
    </button>
  )
}

export default function FooterContent() {
  const dispatch = useAppDispatch()
  const stored = useAppSelector((state) => state.content.footer)
  const logo = useAppSelector((state) => state.content.general?.logo || '')
  const { footerStatus, footerRequest, footerError } = useAppSelector((state) => state.content)
  const [footer, setFooter] = useState(() => cloneFooter(stored))
  const [errors, setErrors] = useState({})
  const [saved, setSaved] = useState(false)
  const loading = footerStatus === 'loading' && footerRequest.startsWith('content/fetchFooter')
  const saving = footerStatus === 'loading' && footerRequest.startsWith('content/updateFooter')
  const failed = footerStatus === 'failed' ? footerError : null

  useEffect(() => {
    dispatch(clearFooterFeedback())
    dispatch(fetchFooter())
  }, [dispatch])

  useEffect(() => {
    setFooter(cloneFooter(stored))
    setErrors({})
  }, [stored])

  function update(field, value) {
    setFooter((current) => ({ ...current, [field]: value }))
    setSaved(false)
  }

  function updateLink(id, field, value) {
    setFooter((current) => ({
      ...current,
      quickLinks: current.quickLinks.map((link) => (link.id === id ? { ...link, [field]: value } : link)),
    }))
    setSaved(false)
  }

  function updateCourse(id, value) {
    setFooter((current) => ({
      ...current,
      popularCourses: current.popularCourses.map((course) =>
        course.id === id ? { ...course, label: value } : course,
      ),
    }))
    setSaved(false)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = {
      instituteName: footer.instituteName.trim() ? '' : 'Institute name is required.',
      tagline: footer.tagline.trim() ? '' : 'Tagline is required.',
      address: footer.address.trim() ? '' : 'Address is required.',
      phone: footer.phone.trim() ? '' : 'Phone is required.',
      email: validateEmail(footer.email),
      copyright: footer.copyright.trim() ? '' : 'Copyright line is required.',
      quickLinks: footer.quickLinks.some((link) => !link.label.trim()) ? 'Every quick link needs a label.' : '',
      popularCourses: footer.popularCourses.some((course) => !course.label.trim())
        ? 'Every popular course needs a name.'
        : '',
    }
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    const payload = {
      instituteName: footer.instituteName.trim(),
      tagline: footer.tagline.trim(),
      address: footer.address.trim(),
      phone: footer.phone.trim(),
      email: footer.email.trim(),
      facebook: footer.facebook.trim(),
      instagram: footer.instagram.trim(),
      youtube: footer.youtube.trim(),
      copyright: footer.copyright.trim(),
      quickLinks: footer.quickLinks.map((link) => ({
        id: link.id,
        label: link.label.trim(),
        href: link.href.trim(),
      })),
      popularCourses: footer.popularCourses.map((course) => ({
        id: course.id,
        label: course.label.trim(),
        href: course.href?.trim() || '',
      })),
    }

    const result = await dispatch(updateFooter(payload))
    if (updateFooter.fulfilled.match(result)) {
      setSaved(true)
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-logo">Coding Hubs Institute</p>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight text-heading">Content</h2>
      <p className="mt-1 max-w-2xl text-sm text-muted">
        Edit the footer shown on the client site. The preview below follows the institute footer layout.
      </p>
      <div className="mt-6">
        <ContentTabs active="Footer" />
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        {loading ? <Alert tone="info">Loading footer content.</Alert> : null}
        {failed ? <Alert>{failed}</Alert> : null}
        {saved ? <Alert tone="success">Footer content saved.</Alert> : null}

        <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Institute</h3>
          <div className="mt-4 grid gap-4">
            <TextField
              label="Name"
              name="instituteName"
              value={footer.instituteName}
              error={errors.instituteName}
              onChange={(event) => update('instituteName', event.target.value)}
            />
            <TextArea
              label="Tagline"
              name="tagline"
              rows={3}
              value={footer.tagline}
              error={errors.tagline}
              onChange={(event) => update('tagline', event.target.value)}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Quick links</h3>
            <Button
              type="button"
              variant="gold"
              onClick={() =>
                update('quickLinks', [...footer.quickLinks, { id: `ql-${Date.now()}`, label: '', href: '' }])
              }
            >
              Add link
            </Button>
          </div>
          {errors.quickLinks ? <p className="mt-3 text-xs text-red-600">{errors.quickLinks}</p> : null}
          <div className="mt-4 space-y-3">
            {footer.quickLinks.map((link) => (
              <div key={link.id} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <TextField
                  label="Label"
                  name={`link-label-${link.id}`}
                  value={link.label}
                  onChange={(event) => updateLink(link.id, 'label', event.target.value)}
                />
                <TextField
                  label="Link"
                  name={`link-href-${link.id}`}
                  value={link.href}
                  placeholder="/about"
                  onChange={(event) => updateLink(link.id, 'href', event.target.value)}
                />
                <div className="sm:pt-7">
                  <RowActions
                    label="Remove"
                    onRemove={() =>
                      update(
                        'quickLinks',
                        footer.quickLinks.filter((item) => item.id !== link.id),
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Popular courses</h3>
            <Button
              type="button"
              variant="gold"
              onClick={() =>
                update('popularCourses', [...footer.popularCourses, { id: `pc-${Date.now()}`, label: '' }])
              }
            >
              Add course
            </Button>
          </div>
          {errors.popularCourses ? <p className="mt-3 text-xs text-red-600">{errors.popularCourses}</p> : null}
          <div className="mt-4 space-y-3">
            {footer.popularCourses.map((course) => (
              <div key={course.id} className="flex items-end gap-2">
                <div className="min-w-0 flex-1">
                  <TextField
                    label="Course line"
                    name={`course-${course.id}`}
                    value={course.label}
                    onChange={(event) => updateCourse(course.id, event.target.value)}
                  />
                </div>
                <RowActions
                  label="Remove"
                  onRemove={() =>
                    update(
                      'popularCourses',
                      footer.popularCourses.filter((item) => item.id !== course.id),
                    )
                  }
                />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Contact</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <TextField
                label="Address"
                name="address"
                value={footer.address}
                error={errors.address}
                onChange={(event) => update('address', event.target.value)}
              />
            </div>
            <TextField
              label="Phone"
              name="phone"
              value={footer.phone}
              error={errors.phone}
              onChange={(event) => update('phone', event.target.value)}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={footer.email}
              error={errors.email}
              onChange={(event) => update('email', event.target.value)}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Social links</h3>
          <div className="mt-4 grid gap-4">
            <TextField
              label="Facebook"
              name="facebook"
              value={footer.facebook}
              onChange={(event) => update('facebook', event.target.value)}
            />
            <TextField
              label="Instagram"
              name="instagram"
              value={footer.instagram}
              onChange={(event) => update('instagram', event.target.value)}
            />
            <TextField
              label="YouTube"
              name="youtube"
              value={footer.youtube}
              onChange={(event) => update('youtube', event.target.value)}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Copyright</h3>
          <div className="mt-4">
            <TextField
              label="Copyright line"
              name="copyright"
              value={footer.copyright}
              error={errors.copyright}
              onChange={(event) => update('copyright', event.target.value)}
            />
          </div>
        </section>

        <div className="flex justify-end">
          <Button type="submit" loading={saving} disabled={loading}>
            Save footer
          </Button>
        </div>
      </form>

      <div className="mt-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted">Footer preview</p>
        <FooterPreview footer={footer} logo={logo} />
      </div>
    </div>
  )
}
