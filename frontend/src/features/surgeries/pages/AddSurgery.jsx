import FormPage, { FormField } from '../../../components/common/FormPage'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { surgeryApi } from '../../../api'
import toast from 'react-hot-toast'

export default function AddSurgery() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  
  const onSubmit = async (data) => {
    try {
      await surgeryApi.create(data);
      toast.success('Surgery scheduled');
      navigate('/surgeries');
    } catch { toast.error('Error scheduling surgery') }
  }

  return (
    <FormPage title="Schedule Surgery" onSubmit={handleSubmit(onSubmit)} backPath="/surgeries">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Surgery Name" required><input {...register('surgery_name', {required: true})} className="input-field" /></FormField>
        <FormField label="Pet ID (UUID)" required><input {...register('pet', {required: true})} placeholder="Existing Pet UUID" className="input-field" /></FormField>
        <FormField label="Doctor ID (UUID)"><input {...register('doctor')} placeholder="Surgeon UUID" className="input-field" /></FormField>
        <FormField label="Date" required><input type="date" {...register('surgery_date', {required: true})} className="input-field" /></FormField>
        <FormField label="Status">
          <select {...register('status')} className="input-field">
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </FormField>
        <FormField label="Cost (₹)"><input type="number" step="0.01" {...register('cost')} defaultValue={0} className="input-field" /></FormField>
        <FormField label="Pre-Op Notes"><textarea {...register('pre_op_notes')} className="input-field" rows={2}></textarea></FormField>
        <FormField label="Post-Op Notes"><textarea {...register('post_op_notes')} className="input-field" rows={2}></textarea></FormField>
      </div>
    </FormPage>
  )
}
