import { Link, useNavigate, useParams } from 'react-router-dom'
import PartnerForm from '@/components/partners/PartnerForm'
import { paths } from '@/routes/paths'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addPartner, updatePartner } from '@/store/slices/partnersSlice'

export default function PartnerFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const partner = useAppSelector((state) => state.partners.items.find((item) => item.id === id))
  const isEdit = Boolean(id)

  if (isEdit && !partner) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-white p-8 text-center">
        <h2 className="text-xl font-semibold text-heading">This partner is not in the list</h2>
        <Link to={paths.partners} className="mt-4 inline-flex text-sm font-semibold text-logo hover:underline">
          Back to partners
        </Link>
      </div>
    )
  }

  function handleSubmit(values) {
    if (isEdit) {
      dispatch(updatePartner({ ...values, id: partner.id }))
    } else {
      dispatch(addPartner({ ...values, id: `p-${Date.now()}` }))
    }
    navigate(paths.partners)
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
        Capture name, contact details, partner ID, and status.
      </p>
      <PartnerForm
        key={partner?.id || 'new'}
        initialValues={partner}
        submitLabel={isEdit ? 'Save changes' : 'Add partner'}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
