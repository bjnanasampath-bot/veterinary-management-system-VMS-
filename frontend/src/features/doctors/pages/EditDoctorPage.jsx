import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import FormPage, { FormField } from '../../../components/common/FormPage'
import { doctorApi } from '../../../api'
import { Loader } from '../../../components/common'
import toast from 'react-hot-toast'

export default function EditDoctorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    doctorApi.getById(id).then(r => reset(r.data?.data || r.data)).finally(() => setFetching(false))
  }, [id])

  // Fields that come from the API but must NOT be sent back
  const SKIP_FIELDS = new Set(['id', 'user', 'user_id', 'analytics', 'full_name', 'is_active', 'created_at', 'updated_at'])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const hasPhoto = data.photo?.[0]

      if (hasPhoto) {
        // Only use FormData when uploading a photo
        const formData = new FormData()
        formData.append('photo', data.photo[0])
        Object.keys(data).forEach(key => {
          if (key === 'photo' || SKIP_FIELDS.has(key)) return
          const val = data[key]
          if (val === undefined || val === null || val === '') return
          // JSON-stringify arrays and objects so JSONFields stay valid
          formData.append(key, Array.isArray(val) || typeof val === 'object' ? JSON.stringify(val) : val)
        })
        await doctorApi.patch(id, formData)
      } else {
        // Send plain JSON — no serialization issues
        const payload = {}
        Object.keys(data).forEach(key => {
          if (key === 'photo' || SKIP_FIELDS.has(key)) return
          const val = data[key]
          if (val === undefined || val === null || val === '') return
          payload[key] = val
        })
        await doctorApi.patch(id, payload)
      }

      toast.success('Doctor updated!')
      navigate('/doctors')
    } catch (err) {
      const detail = err.response?.data
      toast.error(detail?.message || 'Update failed')
    }
    finally { setLoading(false) }
  }

  if (fetching) return <Loader />

  return (
    <FormPage title="Edit Doctor" backPath="/doctors" onSubmit={handleSubmit(onSubmit)} loading={loading}>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Doctor Photo">
          <input {...register('photo')} type="file" accept="image/*" className="input-field" />
        </FormField>
        <FormField label="First Name"><input {...register('first_name', { required: true })} className="input-field" /></FormField>
        <FormField label="Last Name"><input {...register('last_name', { required: true })} className="input-field" /></FormField>
        <FormField label="Email"><input {...register('email', { required: true })} type="email" className="input-field" /></FormField>
        <FormField label="Phone"><input {...register('phone', { required: true })} className="input-field" /></FormField>
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
        <FormField label="License Number"><input {...register('license_number')} className="input-field" /></FormField>
        <FormField label="Experience (years)"><input {...register('experience_years')} type="number" className="input-field" /></FormField>
        <FormField label="Consultation Fee (₹)"><input {...register('consultation_fee')} type="number" className="input-field" /></FormField>
      </div>
      <FormField label="Qualification"><input {...register('qualification')} className="input-field" /></FormField>
      <FormField label="Bio"><textarea {...register('bio')} className="input-field" rows={3} /></FormField>
    </FormPage>
  )
}
