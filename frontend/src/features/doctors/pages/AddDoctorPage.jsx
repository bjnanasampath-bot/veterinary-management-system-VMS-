import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import FormPage, { FormField } from '../../../components/common/FormPage'
import { doctorApi } from '../../../api'
import toast from 'react-hot-toast'

export default function AddDoctorPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    // Validate passwords match before sending
    if (data.password !== data.confirm_password) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      Object.keys(data).forEach(key => {
        if (key === 'photo') {
          if (data[key]?.[0]) formData.append('photo', data[key][0])
        } else if (key === 'available_days') {
          // skip; handled separately if needed
        } else if (data[key] !== undefined && data[key] !== '' && data[key] !== null) {
          formData.append(key, data[key])
        }
      })

      const res = await doctorApi.create(formData)
      const credentials = res.data?.data?.credentials

      if (credentials) {
        toast.success(
          `✅ Doctor added!\nEmail: ${credentials.email}\nPassword: ${credentials.password || '(existing password)'}`,
          { duration: 6000 }
        )
      } else {
        toast.success('Doctor added successfully!')
      }

      navigate('/doctors')
    } catch (err) {
      const errData = err.response?.data
      if (errData?.errors) {
        // Show each field error
        Object.entries(errData.errors).forEach(([field, msgs]) => {
          const msg = Array.isArray(msgs) ? msgs[0] : msgs
          toast.error(`${field}: ${msg}`, { duration: 5000 })
        })
      } else {
        toast.error(errData?.message || 'Failed to add doctor. Please check all fields.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <FormPage
      title="Add Doctor"
      subtitle="Register a new veterinary doctor and create their login account"
      backPath="/doctors"
      onSubmit={handleSubmit(onSubmit)}
      loading={loading}
    >
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Doctor Photo">
          <input {...register('photo')} type="file" accept="image/*" className="input-field" />
        </FormField>

        <FormField label="First Name" required>
          <input
            {...register('first_name', { required: 'First name is required' })}
            className="input-field" placeholder="Ravi"
          />
          {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>}
        </FormField>

        <FormField label="Last Name" required>
          <input
            {...register('last_name', { required: 'Last name is required' })}
            className="input-field" placeholder="Kumar"
          />
          {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>}
        </FormField>

        <FormField label="Email" required>
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' }
            })}
            type="email" className="input-field" placeholder="doctor@vetcare.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </FormField>

        <FormField label="Phone" required>
          <input
            {...register('phone', { required: 'Phone is required' })}
            className="input-field" placeholder="+91 9999999999"
          />
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
          <input
            {...register('license_number', { required: 'License number is required' })}
            className="input-field" placeholder="VET-12345"
          />
          {errors.license_number && <p className="text-red-500 text-xs mt-1">{errors.license_number.message}</p>}
        </FormField>

        <FormField label="Experience (years)">
          <input {...register('experience_years')} type="number" min="0" className="input-field" placeholder="5" />
        </FormField>

        <FormField label="Consultation Fee (₹)">
          <input {...register('consultation_fee')} type="number" min="0" className="input-field" placeholder="500" />
        </FormField>

        <FormField label="Qualification">
          <input {...register('qualification')} className="input-field" placeholder="BVSc & AH, MVSc" />
        </FormField>

        <FormField label="Login Password" required>
          <input
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Minimum 8 characters' }
            })}
            type="password" className="input-field" placeholder="Min 8 characters"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          <p className="text-[10px] text-gray-400 mt-1 italic">Doctor uses this to login to their portal</p>
        </FormField>

        <FormField label="Confirm Password" required>
          <input
            {...register('confirm_password', {
              required: 'Please confirm the password',
              validate: val => val === watch('password') || 'Passwords do not match'
            })}
            type="password" className="input-field" placeholder="Repeat password"
          />
          {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password.message}</p>}
        </FormField>
      </div>

      <FormField label="Bio">
        <textarea {...register('bio')} className="input-field" rows={3} placeholder="Brief bio about the doctor..." />
      </FormField>
    </FormPage>
  )
}
