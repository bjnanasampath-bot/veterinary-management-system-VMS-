import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import FormPage, { FormField } from '../../../components/common/FormPage'
import { doctorApi } from '../../../api'
import toast from 'react-hot-toast'

export default function AddDoctorPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await doctorApi.create(data)
      toast.success('Doctor added!')
      navigate('/doctors')
    } catch { toast.error('Failed to add doctor') }
    finally { setLoading(false) }
  }

  return (
    <FormPage title="Add Doctor" subtitle="Register a new veterinary doctor" backPath="/doctors" onSubmit={handleSubmit(onSubmit)} loading={loading}>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="First Name" required>
          <input {...register('first_name', { required: true })} className="input-field" placeholder="Ravi" />
        </FormField>
        <FormField label="Last Name" required>
          <input {...register('last_name', { required: true })} className="input-field" placeholder="Kumar" />
        </FormField>
        <FormField label="Email" required>
          <input {...register('email', { required: true })} type="email" className="input-field" placeholder="doctor@vetcare.com" />
        </FormField>
        <FormField label="Phone" required>
          <input {...register('phone', { required: true })} className="input-field" placeholder="+91 9999999999" />
        </FormField>
        <FormField label="Specialization">
          <select {...register('specialization')} className="input-field">
            <option value="general">General Practice</option>
            <option value="surgery">Surgery</option>
            <option value="dermatology">Dermatology</option>
            <option value="dentistry">Dentistry</option>
            <option value="cardiology">Cardiology</option>
            <option value="orthopedics">Orthopedics</option>
            <option value="neurology">Neurology</option>
            <option value="oncology">Oncology</option>
            <option value="other">Other</option>
          </select>
        </FormField>
        <FormField label="License Number" required>
          <input {...register('license_number', { required: true })} className="input-field" placeholder="VET-12345" />
        </FormField>
        <FormField label="Experience (years)">
          <input {...register('experience_years')} type="number" className="input-field" placeholder="5" />
        </FormField>
        <FormField label="Consultation Fee (₹)">
          <input {...register('consultation_fee')} type="number" className="input-field" placeholder="500" />
        </FormField>
      </div>
      <FormField label="Qualification">
        <input {...register('qualification')} className="input-field" placeholder="BVSc & AH, MVSc" />
      </FormField>
      <FormField label="Bio">
        <textarea {...register('bio')} className="input-field" rows={3} placeholder="Brief bio..." />
      </FormField>
    </FormPage>
  )
}
