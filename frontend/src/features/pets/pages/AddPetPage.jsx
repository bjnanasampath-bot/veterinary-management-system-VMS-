import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import FormPage, { FormField } from '../../../components/common/FormPage'
import { petApi, ownerApi } from '../../../api'
import toast from 'react-hot-toast'

export default function AddPetPage() {
  const navigate = useNavigate()
  const [owners, setOwners] = useState([])
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  useEffect(() => {
    ownerApi.getAll({ page_size: 100 }).then(r => setOwners(r.data?.results || r.data?.data || []))
  }, [])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await petApi.create(data)
      toast.success('Pet added successfully!')
      navigate('/pets')
    } catch { toast.error('Failed to add pet') }
    finally { setLoading(false) }
  }

  return (
    <FormPage title="Add New Pet" subtitle="Register a new pet" backPath="/pets" onSubmit={handleSubmit(onSubmit)} loading={loading}>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Pet Name" required error={errors.name?.message}>
          <input {...register('name', { required: 'Name is required' })} className="input-field" placeholder="Buddy" />
        </FormField>
        <FormField label="Owner" required error={errors.owner?.message}>
          <select {...register('owner', { required: 'Owner is required' })} className="input-field">
            <option value="">Select Owner</option>
            {owners.map(o => <option key={o.id} value={o.id}>{o.full_name} - {o.phone}</option>)}
          </select>
        </FormField>
        <FormField label="Species" required>
          <select {...register('species', { required: true })} className="input-field">
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="bird">Bird</option>
            <option value="rabbit">Rabbit</option>
            <option value="hamster">Hamster</option>
            <option value="other">Other</option>
          </select>
        </FormField>
        <FormField label="Breed">
          <input {...register('breed')} className="input-field" placeholder="Golden Retriever" />
        </FormField>
        <FormField label="Gender">
          <select {...register('gender')} className="input-field">
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="unknown">Unknown</option>
          </select>
        </FormField>
        <FormField label="Date of Birth">
          <input {...register('date_of_birth')} type="date" className="input-field" />
        </FormField>
        <FormField label="Weight (kg)">
          <input {...register('weight')} type="number" step="0.1" className="input-field" placeholder="5.5" />
        </FormField>
        <FormField label="Color">
          <input {...register('color')} className="input-field" placeholder="Golden" />
        </FormField>
        <FormField label="Microchip ID">
          <input {...register('microchip_id')} className="input-field" placeholder="Optional" />
        </FormField>
        <FormField label="Blood Group">
          <select {...register('blood_group')} className="input-field">
            <option value="unknown">Unknown</option>
            <option value="DEA 1.1+">DEA 1.1+</option>
            <option value="DEA 1.1-">DEA 1.1-</option>
          </select>
        </FormField>
      </div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input {...register('is_neutered')} type="checkbox" className="w-4 h-4 text-primary-600" />
          <span className="text-sm text-gray-700">Neutered/Spayed</span>
        </label>
      </div>
      <FormField label="Allergies">
        <textarea {...register('allergies')} className="input-field" rows={2} placeholder="Any known allergies..." />
      </FormField>
      <FormField label="Notes">
        <textarea {...register('notes')} className="input-field" rows={2} placeholder="Additional notes..." />
      </FormField>
    </FormPage>
  )
}
