import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import FormPage, { FormField } from '../../../components/common/FormPage'
import { appointmentApi, petApi, doctorApi } from '../../../api'
import toast from 'react-hot-toast'

export default function CreateAppointmentPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [pets, setPets] = useState([])
  const [doctors, setDoctors] = useState([])
  const { register, handleSubmit, formState: { errors } } = useForm()

  useEffect(() => {
    petApi.getAll({ page_size: 200 }).then(r => setPets(r.data?.results || r.data?.data || []))
    doctorApi.getAll({ page_size: 100 }).then(r => setDoctors(r.data?.results || r.data?.data || []))
  }, [])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await appointmentApi.create(data)
      toast.success('Appointment created!')
      navigate('/appointments')
    } catch { toast.error('Failed to create appointment') }
    finally { setLoading(false) }
  }

  return (
    <FormPage title="Create Appointment" subtitle="Schedule a new appointment" backPath="/appointments" onSubmit={handleSubmit(onSubmit)} loading={loading}>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Pet" required error={errors.pet?.message}>
          <select {...register('pet', { required: 'Pet is required' })} className="input-field">
            <option value="">Select Pet</option>
            {pets.map(p => <option key={p.id} value={p.id}>{p.name} ({p.species}) - {p.owner_name}</option>)}
          </select>
        </FormField>
        <FormField label="Doctor" required error={errors.doctor?.message}>
          <select {...register('doctor', { required: 'Doctor is required' })} className="input-field">
            <option value="">Select Doctor</option>
            {doctors.map(d => <option key={d.id} value={d.id}>{d.full_name} - {d.specialization}</option>)}
          </select>
        </FormField>
        <FormField label="Date" required error={errors.appointment_date?.message}>
          <input {...register('appointment_date', { required: true })} type="date" className="input-field" />
        </FormField>
        <FormField label="Time" required error={errors.appointment_time?.message}>
          <input {...register('appointment_time', { required: true })} type="time" className="input-field" />
        </FormField>
        <FormField label="Type">
          <select {...register('appointment_type')} className="input-field">
            <option value="checkup">Regular Checkup</option>
            <option value="vaccination">Vaccination</option>
            <option value="surgery">Surgery</option>
            <option value="grooming">Grooming</option>
            <option value="emergency">Emergency</option>
            <option value="followup">Follow Up</option>
            <option value="dental">Dental</option>
            <option value="other">Other</option>
          </select>
        </FormField>
        <FormField label="Duration (minutes)">
          <input {...register('duration_minutes')} type="number" className="input-field" defaultValue={30} />
        </FormField>
      </div>
      <FormField label="Reason" required error={errors.reason?.message}>
        <textarea {...register('reason', { required: true })} className="input-field" rows={2} placeholder="Reason for visit..." />
      </FormField>
      <FormField label="Symptoms">
        <textarea {...register('symptoms')} className="input-field" rows={2} placeholder="Describe symptoms..." />
      </FormField>
      <FormField label="Notes">
        <textarea {...register('notes')} className="input-field" rows={2} placeholder="Additional notes..." />
      </FormField>
    </FormPage>
  )
}
