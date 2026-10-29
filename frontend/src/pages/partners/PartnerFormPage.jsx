import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PartnerForm from '@/components/partners/PartnerForm'
import { paths } from '@/routes/paths'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearPartnerFeedback, createPartner, fetchPartnerById, updatePartner } from '@/store/slices/partnersSlice'

export default function PartnerFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { items, current, status, request, error } = useAppSelector((state) => state.partners)
  const isEdit = Boolean(id)
  const partner = items.find((item) => item.id === id) || (current?.id === id ? current : null)
  const loadingPartner = isEdit && !partner && status !== 'failed'
  const saving = status === 'loading' && (request.startsWith('partners/create') || request.startsWith('partners/update'))
  const saveError =
    status === 'failed' && (request.startsWith('partners/create') || request.startsWith('partners/update'))
      ? error
      : null

  useEffect(() => {
    dispatch(clearPartnerFeedback())
    if (isEdit) dispatch(fetchPartnerById(id))
  }, [dispatch, id, isEdit])

  if (isEdit && !partner && !loadingPartner) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-white p-8 text-center">
        <h2 className="text-xl font-semibold text-heading">This partner is not in the list</h2>
        {error ? <p className="mt-2 text-sm text-muted">{error}</p> : null}
        <Link to={paths.partners} className="mt-4 inline-flex text-sm font-semibold text-logo hover:underline">
          Back to partners
        </Link>
      </div>
    )
  }

  if (loadingPartner) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-white p-8 text-center">
        <h2 className="text-xl font-semibold text-heading">Loading partner</h2>
        <p className="mt-2 text-sm text-muted">Fetching the latest details from the server.</p>
      </div>
    )
  }

  async function handleSubmit(values) {
    const result = isEdit
      ? await dispatch(updatePartner({ id: partner.id, ...values }))
      : await dispatch(createPartner(values))
    const succeeded = isEdit ? updatePartner.fulfilled.match(result) : createPartner.fulfilled.match(result)
    if (succeeded) navigate(paths.partners)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-sm text-muted">
        <Link to={paths.partners} className="font-semibold text-logo hover:underline">
          Partners
        </Link>
        <span className="px-2">/</span>
        {isEdit ? 'Edit' : 'Add'}
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-heading">
        {isEdit ? 'Edit partner' : 'Add partner'}
      </h2>
      <p className="mt-1 mb-6 text-sm text-muted">
        A partner is a person. Name, contact details, address, and status are saved here. The partner ID is generated
        as CHI-P-year-count.
      </p>
      <PartnerForm
        key={partner?.id || 'new'}
        initialValues={partner}
        submitLabel={isEdit ? 'Save changes' : 'Add partner'}
        loading={saving}
        error={saveError}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
