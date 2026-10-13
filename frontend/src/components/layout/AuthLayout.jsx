import AuthShowcase from '@/components/layout/AuthShowcase'
import Logo from '@/components/common/Logo'

export default function AuthLayout({ eyebrow, title, description, children, footer }) {
  return (
    <div className="min-h-svh bg-white lg:grid lg:grid-cols-[minmax(320px,0.92fr)_1.08fr]">
      <AuthShowcase />
      <main className="flex min-h-svh flex-col px-5 py-8 sm:px-10">
        <div className="h-1 w-16 rounded-full bg-gold lg:hidden" />
        <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-8">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-logo">{eyebrow}</p>
          <h1 className="mt-2 text-[32px] font-semibold leading-tight tracking-tight text-heading">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
          <div className="mt-8">{children}</div>
          {footer ? <div className="mt-6 text-sm text-muted">{footer}</div> : null}
        </div>
      </main>
    </div>
  )
}
