import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import FormPage, { FormField } from '../../../components/common/FormPage'
import { surgeryApi, petApi, doctorApi } from '../../../api'
import toast from 'react-hot-toast'

export default function AddSurgery() {
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth)
  const [loading, setLoading] = useState(false)
  const [pets, setPets] = useState([])
  const [doctors, setDoctors] = useState([])
  const { register, handleSubmit, setValue } = useForm();

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
      await surgeryApi.create(data);
      toast.success('Surgery scheduled');
      navigate('/medical-services');
    } catch { toast.error('Error scheduling surgery') }
    finally { setLoading(false) }
  }

  return (
    <FormPage title="Schedule Surgery" onSubmit={handleSubmit(onSubmit)} backPath="/medical-services" loading={loading}>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Surgery Name" required>
          <input {...register('surgery_name', {required: true})} placeholder="e.g. Spaying, Dental Surgery" className="input-field" />
        </FormField>
        
        <FormField label="Patient (Pet)" required>
          <select {...register('pet', { required: true })} className="input-field">
            <option value="">Select Pet</option>
            {pets.map(p => <option key={p.id} value={p.id}>{p.name} - {p.owner_name}</option>)}
          </select>
        </FormField>

        <FormField label="Surgeon (Doctor)">
          <select {...register('doctor')} className="input-field">
            <option value="">Select Doctor</option>
            {doctors.map(d => <option key={d.id} value={d.id}>{d.full_name}</option>)}
          </select>
        </FormField>

        <FormField label="Surgery Date" required>
          <input type="date" {...register('surgery_date', {required: true})} className="input-field" />
        </FormField>

        <FormField label="Status">
          <select {...register('status')} className="input-field">
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </FormField>

        <FormField label="Cost (₹)">
          <input type="number" step="0.01" {...register('cost')} defaultValue={0} className="input-field" />
        </FormField>

        <div className="col-span-2">
            <FormField label="Pre-Op Notes">
                <textarea {...register('pre_op_notes')} className="input-field" rows={2} placeholder="Preparation instructions..."></textarea>
            </FormField>
        </div>

        <div className="col-span-2">
            <FormField label="Post-Op Notes">
                <textarea {...register('post_op_notes')} className="input-field" rows={2} placeholder="Recovery instructions..."></textarea>
            </FormField>
        </div>
      </div>
    </FormPage>
  )
}
