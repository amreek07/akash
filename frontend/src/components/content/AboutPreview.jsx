function Target() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2" />
    </svg>
  )
}

function Heart() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9Z" />
    </svg>
  )
}

export default function AboutPreview({ about }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white">
      <section className="bg-logo px-6 py-10 text-white sm:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">{about.heroEyebrow || 'About us'}</p>
        <h3 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
          {about.heroTitle || 'Heading'}
        </h3>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-white/80">{about.heroDescription || 'Description'}</p>
      </section>

      <section className="grid items-center gap-8 px-6 py-8 lg:grid-cols-2 sm:px-10">
        <div className="overflow-hidden rounded-2xl bg-surface">
          {about.storyImage ? (
            <img src={about.storyImage} alt="" className="aspect-[4/3] w-full object-cover" />
          ) : (
            <div className="grid aspect-[4/3] place-items-center text-sm text-muted">Story image</div>
          )}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-logo">{about.storyEyebrow || 'Our story'}</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-heading">{about.storyTitle || 'Story heading'}</h3>
          <p className="mt-3 text-sm leading-6 text-muted">{about.storyBody || 'Story'}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <article className="rounded-xl border border-line p-4">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-logo/10 text-logo">
                <Target />
              </span>
              <h4 className="mt-3 text-sm font-semibold text-heading">{about.missionTitle || 'Our Mission'}</h4>
              <p className="mt-1 text-sm leading-5 text-muted">{about.missionText}</p>
            </article>
            <article className="rounded-xl border border-line p-4">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-logo/10 text-logo">
                <Heart />
              </span>
              <h4 className="mt-3 text-sm font-semibold text-heading">{about.valuesTitle || 'Our Values'}</h4>
              <p className="mt-1 text-sm leading-5 text-muted">{about.valuesText}</p>
            </article>
          </div>
        </div>
      </section>
    </div>
  )
}
