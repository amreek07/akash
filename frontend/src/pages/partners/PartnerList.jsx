import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Alert from '@/components/common/Alert'
import Icon from '@/components/common/Icon'
import ConfirmDialog from '@/components/courses/ConfirmDialog'
import { paths } from '@/routes/paths'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearPartnerFeedback, deletePartner, fetchPartners } from '@/store/slices/partnersSlice'

const PAGE_SIZE = 50

export default function PartnerList() {
  const dispatch = useAppDispatch()
  const { items, pagination, counts, status, request, error } = useAppSelector((state) => state.partners)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const loading = status === 'loading' && request.startsWith('partners/fetchAll')
  const deleting = status === 'loading' && request.startsWith('partners/delete')

  useEffect(() => {
    dispatch(clearPartnerFeedback())
    const timer = window.setTimeout(
      () => {
        dispatch(fetchPartners({ page, limit: PAGE_SIZE, search: query.trim() }))
      },
      query.trim() ? 300 : 0,
    )
    return () => window.clearTimeout(timer)
  }, [dispatch, page, query])

  async function handleDelete() {
    if (!pendingDelete) return
    const result = await dispatch(deletePartner(pendingDelete.id))
    setPendingDelete(null)
    if (deletePartner.fulfilled.match(result)) {
      dispatch(fetchPartners({ page, limit: PAGE_SIZE, search: query.trim() }))
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-logo">Institute</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-heading">Partners</h2>
          <p className="mt-1 text-sm text-muted">
            {counts.all} partners · {counts.active} active
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

      <label className="block w-full sm:max-w-sm">
        <span className="sr-only">Search partners</span>
        <input
          value={query}
          placeholder="Search name, ID, email, or city"
          className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-heading outline-none transition placeholder:text-muted/70 focus:border-logo focus:ring-4 focus:ring-logo/15"
          onChange={(event) => {
            setQuery(event.target.value)
            setPage(1)
          }}
        />
      </label>

      {error ? <Alert>{error}</Alert> : null}

      <section className="overflow-hidden rounded-2xl border border-line bg-white">
        {loading && !items.length ? (
          <div className="px-6 py-16 text-center">
            <h3 className="text-lg font-semibold text-heading">Loading partners</h3>
            <p className="mt-1 text-sm text-muted">Fetching the latest list from the server.</p>
          </div>
        ) : items.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-surface text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                <tr>
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Partner ID</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Phone</th>
                  <th className="px-4 py-3 font-semibold">City</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((partner) => (
                  <tr key={partner.id} className="border-t border-line align-middle hover:bg-surface/70">
                    <td className="px-5 py-4 font-semibold text-heading">{partner.name}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-full bg-logo/10 px-2.5 py-1 text-xs font-semibold text-logo">
                        {partner.partnerId}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-muted">{partner.email}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-heading">{partner.phone}</td>
                    <td className="px-4 py-4 text-heading">{partner.city}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          partner.isActive ? 'bg-primary/10 text-primary' : 'bg-surface text-muted'
                        }`}
                      >
                        {partner.status === 'inactive' ? 'Inactive' : 'Active'}
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
            <h3 className="text-lg font-semibold text-heading">
              {query.trim() ? 'No partners match this search' : 'No partners yet'}
            </h3>
            <p className="mt-1 text-sm text-muted">
              {query.trim()
                ? 'Try another name, partner ID, email, or city.'
                : 'Add a person with contact details. A partner ID is assigned on save.'}
            </p>
          </div>
        )}
      </section>

      {pagination.totalPages > 1 ? (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={!pagination.hasPreviousPage || loading}
            className="inline-flex h-10 items-center rounded-lg border border-line bg-white px-4 text-sm font-semibold text-heading hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Previous
          </button>
          <p className="text-sm text-muted">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <button
            type="button"
            disabled={!pagination.hasNextPage || loading}
            className="inline-flex h-10 items-center rounded-lg border border-line bg-white px-4 text-sm font-semibold text-heading hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </button>
        </div>
      ) : null}

      {pendingDelete ? (
        <ConfirmDialog
          title="Delete this partner?"
          description={`${pendingDelete.name} will be removed from the partners list.`}
          loading={deleting}
          onClose={() => {
            if (!deleting) setPendingDelete(null)
          }}
          onConfirm={handleDelete}
        />
      ) : null}
    </div>
  )
}
