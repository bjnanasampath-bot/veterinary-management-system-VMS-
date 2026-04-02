import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import FormPage, { FormField } from '../../../components/common/FormPage'
import { ownerApi } from '../../../api'
import { Loader } from '../../../components/common'
import toast from 'react-hot-toast'

export default function EditOwnerPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    ownerApi.getById(id).then(r => reset(r.data?.data || r.data)).finally(() => setFetching(false))
  }, [id])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await ownerApi.update(id, data)
      toast.success('Owner updated!')
      navigate('/owners')
    } catch { toast.error('Update failed') }
    finally { setLoading(false) }
  }

  if (fetching) return <Loader />

  return (
    <FormPage title="Edit Owner" backPath="/owners" onSubmit={handleSubmit(onSubmit)} loading={loading}>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="First Name"><input {...register('first_name', { required: true })} className="input-field" /></FormField>
        <FormField label="Last Name"><input {...register('last_name', { required: true })} className="input-field" /></FormField>
        <FormField label="Email"><input {...register('email', { required: true })} type="email" className="input-field" /></FormField>
        <FormField label="Phone"><input {...register('phone', { required: true })} className="input-field" /></FormField>
        <FormField label="City"><input {...register('city')} className="input-field" /></FormField>
        <FormField label="State"><input {...register('state')} className="input-field" /></FormField>
        <FormField label="Pincode"><input {...register('pincode')} className="input-field" /></FormField>
        <FormField label="Alternate Phone"><input {...register('alternate_phone')} className="input-field" /></FormField>
      </div>
      <FormField label="Address"><textarea {...register('address')} className="input-field" rows={2} /></FormField>
      <FormField label="Notes"><textarea {...register('notes')} className="input-field" rows={2} /></FormField>
    </FormPage>
  )
}
