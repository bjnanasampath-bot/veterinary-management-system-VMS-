import FormPage, { FormField } from '../../../components/common/FormPage'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { pharmacyApi } from '../../../api'
import toast from 'react-hot-toast'

export default function AddPharmacyItem() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  
  const onSubmit = async (data) => {
    try {
      await pharmacyApi.create(data);
      toast.success('Added item successfully');
      navigate('/pharmacy');
    } catch { toast.error('Error adding item') }
  }

  return (
    <FormPage title="Add Pharmacy Item" onSubmit={handleSubmit(onSubmit)} backPath="/pharmacy">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Item Name" required><input {...register('name', {required: true})} placeholder="e.g. Paracetamol" className="input-field" /></FormField>
        <FormField label="Category">
          <select {...register('category')} className="input-field">
            <option value="medication">Medication</option>
            <option value="supply">Supply</option>
            <option value="vaccine">Vaccine</option>
            <option value="other">Other</option>
          </select>
        </FormField>
        <FormField label="Stock Quantity"><input type="number" {...register('stock_quantity')} defaultValue={0} className="input-field" /></FormField>
        <FormField label="Unit Price (₹)"><input type="number" step="0.01" {...register('unit_price')} defaultValue={0.00} className="input-field" /></FormField>
        <FormField label="Expiry Date"><input type="date" {...register('expiry_date')} className="input-field" /></FormField>
        <FormField label="Description" fullWidth><textarea {...register('description')} placeholder="Special instructions or storage details..." className="input-field h-20" /></FormField>
      </div>
    </FormPage>
  )
}
