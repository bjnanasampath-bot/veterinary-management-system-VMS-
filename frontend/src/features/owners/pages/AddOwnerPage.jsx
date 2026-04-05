// AddOwnerPage
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import FormPage, { FormField } from '../../../components/common/FormPage'
import { ownerApi } from '../../../api'
import toast from 'react-hot-toast'
import { useState } from 'react'

export default function AddOwnerPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const formData = new FormData()
      Object.keys(data).forEach(key => {
        if (key === 'photo' && data[key]?.[0]) {
          formData.append('photo', data[key][0])
        } else if (data[key] !== undefined && data[key] !== '') {
          formData.append(key, data[key])
        }
      })
      await ownerApi.create(formData)
      toast.success('Owner added!')
      navigate('/owners')
    } catch { toast.error('Failed to add owner') }
    finally { setLoading(false) }
  }

  return (
    <FormPage title="Add Owner" subtitle="Register a new pet owner" backPath="/owners" onSubmit={handleSubmit(onSubmit)} loading={loading}>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Owner Photo">
          <input {...register('photo')} type="file" accept="image/*" className="input-field" />
        </FormField>
        <FormField label="First Name" required error={errors.first_name?.message}>
          <input {...register('first_name', { required: true })} className="input-field" placeholder="John" />
        </FormField>
        <FormField label="Last Name" required>
          <input {...register('last_name', { required: true })} className="input-field" placeholder="Doe" />
        </FormField>
        <FormField label="Email" required>
          <input {...register('email', { required: true })} type="email" className="input-field" placeholder="john@example.com" />
        </FormField>
        <FormField label="Phone" required>
          <input {...register('phone', { required: true })} className="input-field" placeholder="+91 9999999999" />
        </FormField>
        <FormField label="Alternate Phone">
          <input {...register('alternate_phone')} className="input-field" placeholder="Optional" />
        </FormField>
        <FormField label="City">
          <input {...register('city')} className="input-field" placeholder="Hyderabad" />
        </FormField>
        <FormField label="State">
          <input {...register('state')} className="input-field" placeholder="Telangana" />
        </FormField>
        <FormField label="Pincode">
          <input {...register('pincode')} className="input-field" placeholder="500001" />
        </FormField>
      </div>
      <FormField label="Address">
        <textarea {...register('address')} className="input-field" rows={2} placeholder="Full address..." />
      </FormField>
      <FormField label="Notes">
        <textarea {...register('notes')} className="input-field" rows={2} placeholder="Additional notes..." />
      </FormField>
    </FormPage>
  )
}
