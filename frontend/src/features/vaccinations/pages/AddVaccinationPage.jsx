import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import FormPage, { FormField } from '../../../components/common/FormPage'
import { vaccinationApi, petApi, doctorApi } from '../../../api'
import toast from 'react-hot-toast'

export default function AddVaccinationPage() {
  const navigate = useNavigate()
  const { user } = useSelector(s => s.auth)
  const [loading, setLoading] = useState(false)
  const [pets, setPets] = useState([])
  const [doctors, setDoctors] = useState([])
  const { register, handleSubmit, setValue } = useForm()

  useEffect(() => {
    petApi.getAll({ page_size: 200 }).then(r => setPets(r.data?.results || r.data?.data || []))
    doctorApi.getAll({ page_size: 100 }).then(r => {
      const list = r.data?.results || r.data?.data || []
      setDoctors(list)
      
      // Auto-select current doctor
      if (user?.role === 'doctor') {
        const currentDoctor = list.find(d => d.email === user.email)
        if (currentDoctor) {
          setValue('doctor', currentDoctor.id)
        }
      }
    })
  }, [user, setValue])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await vaccinationApi.create(data)
      toast.success('Vaccination recorded!')
      navigate('/medical-services')
    } catch { toast.error('Failed to record vaccination') }
    finally { setLoading(false) }
  }

  return (
    <FormPage title="Add Vaccination" subtitle="Record a vaccination" backPath="/vaccinations" onSubmit={handleSubmit(onSubmit)} loading={loading}>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Pet" required>
          <select {...register('pet', { required: true })} className="input-field">
            <option value="">Select Pet</option>
            {pets.map(p => <option key={p.id} value={p.id}>{p.name} - {p.owner_name}</option>)}
          </select>
        </FormField>
        <FormField label="Doctor">
          <select {...register('doctor')} className="input-field">
            <option value="">Select Doctor (Optional)</option>
            {doctors.map(d => <option key={d.id} value={d.id}>{d.full_name}</option>)}
          </select>
        </FormField>
        <FormField label="Vaccine Name" required>
          <input {...register('vaccine_name', { required: true })} className="input-field" placeholder="Rabies, Distemper..." />
        </FormField>
        <FormField label="Vaccine Brand">
          <input {...register('vaccine_brand')} className="input-field" placeholder="Brand name" />
        </FormField>
        <FormField label="Batch Number">
          <input {...register('batch_number')} className="input-field" placeholder="Batch/Lot number" />
        </FormField>
        <FormField label="Dose Number">
          <input {...register('dose_number')} type="number" className="input-field" defaultValue={1} />
        </FormField>
        <FormField label="Vaccination Date" required>
          <input {...register('vaccination_date', { required: true })} type="date" className="input-field" />
        </FormField>
        <FormField label="Next Due Date">
          <input {...register('next_due_date')} type="date" className="input-field" />
        </FormField>
        <FormField label="Status">
          <select {...register('status')} className="input-field">
            <option value="completed">Completed</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </FormField>
        <FormField label="Cost (₹)">
          <input {...register('cost')} type="number" className="input-field" placeholder="0" />
        </FormField>
      </div>
      <FormField label="Notes">
        <textarea {...register('notes')} className="input-field" rows={2} placeholder="Additional notes..." />
      </FormField>
    </FormPage>
  )
}
