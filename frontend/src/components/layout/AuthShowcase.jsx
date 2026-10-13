import Logo from '@/components/common/Logo'

const steps = [
  { title: 'Credentials', copy: 'Sign in with the administrator email and password.' },
  { title: 'One-time code', copy: 'Confirm the 6-digit code sent to that inbox.' },
  { title: 'Console', copy: 'Open the panel, or set a new password if you are locked out.' },
]

export default function AuthShowcase() {
  return (
    <aside className="relative hidden overflow-hidden bg-shade text-white lg:flex lg:flex-col lg:justify-between">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="pointer-events-none absolute -left-16 -top-20 h-72 w-72 rounded-full bg-logo/50" />
      <div className="pointer-events-none absolute bottom-16 right-[-48px] h-56 w-56 rounded-full border border-white/20" />

      <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14">
        <Logo tone="light" />

        <div className="max-w-md">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Administrator only</p>
          <h2 className="mt-3 text-4xl font-semibold leading-tight tracking-tight">
            One console for the people who run it.
          </h2>
          <p className="mt-4 text-sm leading-6 text-white/75">
            This panel is reserved for administrator accounts. Everyone else stops at the sign-in screen.
          </p>

          <ol className="mt-10 space-y-5">
            {steps.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold text-sm font-semibold text-heading">
                  {index + 1}
                </span>
                <span>
                  <span className="block text-sm font-semibold">{step.title}</span>
                  <span className="mt-1 block text-sm leading-5 text-white/70">{step.copy}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <p className="text-xs text-white/60">Authorized personnel only</p>
      </div>
    </aside>
  )
}
