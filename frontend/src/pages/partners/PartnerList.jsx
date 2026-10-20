import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '@/components/common/Icon'
import ConfirmDialog from '@/components/courses/ConfirmDialog'
import { paths } from '@/routes/paths'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { deletePartner } from '@/store/slices/partnersSlice'

function formatPartnerSince(value) {
  if (!value) return '—'
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function PartnerList() {
  const dispatch = useAppDispatch()
  const partners = useAppSelector((state) => state.partners.items)
  const [pendingDelete, setPendingDelete] = useState(null)
  const activeCount = partners.filter((partner) => partner.isActive).length

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-logo">Institute</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-heading">Partners</h2>
          <p className="mt-1 text-sm text-muted">
            {partners.length} partners · {activeCount} active
          </p>
        </div>
        <Link
          to={paths.partnerNew}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          <Icon name="plus" className="h-4 w-4" />
          Add partner
        </Link>
      </div>

      <section className="overflow-hidden rounded-2xl border border-line bg-white">
        {partners.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead className="bg-surface text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                <tr>
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Partner since</th>
                  <th className="px-4 py-3 font-semibold">Phone</th>
                  <th className="px-4 py-3 font-semibold">Partner ID</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {partners.map((partner) => (
                  <tr key={partner.id} className="border-t border-line align-middle hover:bg-surface/70">
                    <td className="px-5 py-4 font-semibold text-heading">{partner.name}</td>
                    <td className="px-4 py-4 text-muted">{partner.email}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-heading">
                      {formatPartnerSince(partner.partnerSince)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-heading">{partner.phone}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-full bg-logo/10 px-2.5 py-1 text-xs font-semibold text-logo">
                        {partner.partnerId}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          partner.isActive ? 'bg-primary/10 text-primary' : 'bg-surface text-muted'
                        }`}
                      >
                        {partner.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={paths.partnerEdit(partner.id)}
                          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-line bg-white px-3 text-xs font-semibold text-heading hover:bg-surface"
                        >
                          <Icon name="pencil" className="h-3.5 w-3.5" />
                          Edit
                        </Link>
                        <button
                          type="button"
                          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-line bg-white px-3 text-xs font-semibold text-heading hover:bg-surface hover:text-red-600"
                          onClick={() => setPendingDelete(partner)}
                        >
                          <Icon name="trash" className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <h3 className="text-lg font-semibold text-heading">No partners yet</h3>
            <p className="mt-1 text-sm text-muted">Add a partner with contact details and status.</p>
          </div>
        )}
      </section>

      {pendingDelete ? (
        <ConfirmDialog
          title="Delete this partner?"
          description={`${pendingDelete.name} will be removed from the partners list on this screen.`}
          onClose={() => setPendingDelete(null)}
          onConfirm={() => {
            dispatch(deletePartner(pendingDelete.id))
            setPendingDelete(null)
          }}
        />
      ) : null}
    </div>
  )
}
