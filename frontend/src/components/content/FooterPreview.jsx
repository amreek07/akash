function Mark() {
  return (
    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-logo text-white">
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 3 3 8.2v1.2h18V8.2L12 3Zm-6.2 8.2V18H7.2v-6.8H5.8Zm4.2 0V18h1.4v-6.8H10Zm4.6 0V18h1.4v-6.8h-1.4Zm4.6 0V18H20v-6.8h-1.4ZM4 19.2h16V21H4v-1.8Z"
        />
      </svg>
    </span>
  )
}

function Pin() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-gold" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" />
      <circle cx="12" cy="11" r="2" />
    </svg>
  )
}

function Phone() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-gold" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M7 3h4l1 4-2 1a12 12 0 0 0 6 6l1-2 4 1v4a2 2 0 0 1-2 2A16 16 0 0 1 5 5a2 2 0 0 1 2-2Z" />
    </svg>
  )
}

function Mail() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-gold" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  )
}

function Social({ children, href }) {
  const className = 'grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white'
  if (!href) return <span className={className}>{children}</span>
  return (
    <a href={href} className={className} target="_blank" rel="noreferrer">
      {children}
    </a>
  )
}

export default function FooterPreview({ footer }) {
  return (
    <footer className="overflow-hidden rounded-2xl bg-ink text-white">
      <div className="grid gap-10 px-6 py-8 sm:px-8 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <Mark />
            <p className="text-base font-semibold">{footer.instituteName || 'Institute name'}</p>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-6 text-white/55">{footer.tagline || 'Tagline'}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Quick Links</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            {footer.quickLinks.filter((link) => link.label.trim()).map((link) => (
              <li key={link.id}>{link.label}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Popular Courses</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            {footer.popularCourses.filter((course) => course.label.trim()).map((course) => (
              <li key={course.id}>{course.label}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/75">
            <li className="flex items-start gap-2">
              <Pin />
              <span>{footer.address || 'Address'}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone />
              <span>{footer.phone || 'Phone'}</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail />
              <span>{footer.email || 'Email'}</span>
            </li>
          </ul>
          <div className="mt-5 flex gap-2">
            <Social href={footer.facebook}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-label="Facebook">
                <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13v-2c0-.6.4-1 1-1Z" />
              </svg>
            </Social>
            <Social href={footer.instagram}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-label="Instagram">
                <rect x="4" y="4" width="16" height="16" rx="4" />
                <circle cx="12" cy="12" r="3.5" />
                <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" />
              </svg>
            </Social>
            <Social href={footer.youtube}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-label="YouTube">
                <path d="M21 8.2a3 3 0 0 0-2.1-2.1C17.2 5.6 12 5.6 12 5.6s-5.2 0-6.9.5A3 3 0 0 0 3 8.2 31 31 0 0 0 2.5 12 31 31 0 0 0 3 15.8a3 3 0 0 0 2.1 2.1c1.7.5 6.9.5 6.9.5s5.2 0 6.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-3.8 31 31 0 0 0-.5-3.8ZM10.5 15.2V8.8L15.5 12l-5 3.2Z" />
              </svg>
            </Social>
          </div>
        </div>
      </div>
    </footer>
  )
}
