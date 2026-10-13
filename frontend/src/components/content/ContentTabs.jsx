import { Link } from 'react-router-dom'
import { paths } from '@/routes/paths'

const tabs = [
  { to: paths.contentGeneral, label: 'General' },
  { to: paths.contentAbout, label: 'About us' },
  { to: paths.contentGallery, label: 'Gallery' },
  { to: paths.contentFooter, label: 'Footer' },
]

export default function ContentTabs({ active }) {
  return (
    <div className="overflow-x-auto">
      <div className="flex w-max rounded-xl bg-white p-1 shadow-[inset_0_0_0_1px_#e4e8ef]">
        {tabs.map((tab) => {
          const selected = tab.label === active
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`inline-flex h-10 items-center rounded-lg px-4 text-sm font-semibold whitespace-nowrap ${
                selected ? 'bg-logo text-white' : 'text-muted hover:text-heading'
              }`}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
