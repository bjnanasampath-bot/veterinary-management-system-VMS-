// EditPetPage
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import FormPage, { FormField } from '../../../components/common/FormPage'
import { petApi, ownerApi } from '../../../api'
import { Loader } from '../../../components/common'
import toast from 'react-hot-toast'

export default function EditPetPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [owners, setOwners] = useState([])
  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    Promise.all([
      petApi.getById(id),
      ownerApi.getAll({ page_size: 100 })
    ]).then(([petRes, ownersRes]) => {
      const pet = petRes.data?.data || petRes.data
      reset(pet)
      setOwners(ownersRes.data?.results || ownersRes.data?.data || [])
    }).finally(() => setFetching(false))
  }, [id])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await petApi.update(id, data)
      toast.success('Pet updated!')
      navigate('/pets')
    } catch { toast.error('Failed to update') }
    finally { setLoading(false) }
  }

  if (fetching) return <Loader />

  return (
    <FormPage title="Edit Pet" backPath="/pets" onSubmit={handleSubmit(onSubmit)} loading={loading}>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Pet Name" required><input {...register('name', { required: true })} className="input-field" /></FormField>
        <FormField label="Owner" required>
          <select {...register('owner')} className="input-field">
            {owners.map(o => <option key={o.id} value={o.id}>{o.full_name}</option>)}
          </select>
        </FormField>
        <FormField label="Species"><select {...register('species')} className="input-field"><option value="dog">Dog</option><option value="cat">Cat</option><option value="bird">Bird</option><option value="rabbit">Rabbit</option><option value="other">Other</option></select></FormField>
        <FormField label="Breed"><input {...register('breed')} className="input-field" /></FormField>
        <FormField label="Gender"><select {...register('gender')} className="input-field"><option value="male">Male</option><option value="female">Female</option><option value="unknown">Unknown</option></select></FormField>
        <FormField label="Date of Birth"><input {...register('date_of_birth')} type="date" className="input-field" /></FormField>
        <FormField label="Weight (kg)"><input {...register('weight')} type="number" step="0.1" className="input-field" /></FormField>
        <FormField label="Color"><input {...register('color')} className="input-field" /></FormField>
      </div>
      <FormField label="Allergies"><textarea {...register('allergies')} className="input-field" rows={2} /></FormField>
      <FormField label="Notes"><textarea {...register('notes')} className="input-field" rows={2} /></FormField>
    </FormPage>
  )
}
