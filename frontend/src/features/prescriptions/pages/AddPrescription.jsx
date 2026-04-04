import FormPage, { FormField } from '../../../components/common/FormPage'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { prescriptionApi } from '../../../api'
import toast from 'react-hot-toast'

export default function AddPrescription() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  
  const onSubmit = async (data) => {
    try {
      await prescriptionApi.create(data);
      toast.success('Prescription issued');
      navigate('/prescriptions');
    } catch { toast.error('Error issuing prescription') }
  }

  return (
    <FormPage title="Issue Prescription" onSubmit={handleSubmit(onSubmit)} backPath="/prescriptions">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Medication Name" required><input {...register('medication_name', {required: true})} className="input-field" /></FormField>
        <FormField label="Pet ID (UUID)" required><input {...register('pet', {required: true})} placeholder="Existing Pet UUID" className="input-field" /></FormField>
        <FormField label="Doctor ID (UUID)"><input {...register('doctor')} placeholder="Prescribing Doctor UUID" className="input-field" /></FormField>
        <FormField label="Dosage" required><input {...register('dosage', {required: true})} placeholder="e.g. 1 Tablet" className="input-field" /></FormField>
        <FormField label="Frequency" required><input {...register('frequency', {required: true})} placeholder="e.g. Twice a day" className="input-field" /></FormField>
        <FormField label="Duration (Days)"><input type="number" {...register('duration_days')} defaultValue={1} className="input-field" /></FormField>
        <FormField label="Status">
          <select {...register('status')} className="input-field">
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </FormField>
      </div>
    </FormPage>
  )
}
