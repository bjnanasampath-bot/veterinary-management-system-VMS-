import FormPage, { FormField } from '../../../components/common/FormPage'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { labTestApi } from '../../../api'
import toast from 'react-hot-toast'

export default function AddLabTest() {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm();
  
  const onSubmit = async (data) => {
    try {
      await labTestApi.create(data);
      toast.success('Lab Test scheduled');
      navigate('/lab-tests');
    } catch { toast.error('Error creating Lab Test') }
  }

  return (
    <FormPage title="Schedule Lab Test" onSubmit={handleSubmit(onSubmit)} backPath="/lab-tests">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Test Name" required><input {...register('test_name', {required: true})} className="input-field" /></FormField>
        <FormField label="Pet ID (UUID)" required><input {...register('pet', {required: true})} placeholder="Existing Pet UUID" className="input-field" /></FormField>
        <FormField label="Doctor ID (UUID)"><input {...register('doctor')} placeholder="Existing Doctor UUID" className="input-field" /></FormField>
        <FormField label="Date" required><input type="date" {...register('test_date', {required: true})} className="input-field" /></FormField>
        <FormField label="Status">
          <select {...register('status')} className="input-field">
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </FormField>
        <FormField label="Cost (₹)"><input type="number" step="0.01" {...register('cost')} defaultValue={0} className="input-field" /></FormField>
        <div className="col-span-2">
          <FormField label="Results (Optional)"><textarea {...register('results')} className="input-field" rows={3}></textarea></FormField>
        </div>
      </div>
    </FormPage>
  )
}
