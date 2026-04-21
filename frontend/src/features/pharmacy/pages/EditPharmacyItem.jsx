import { useEffect, useState } from 'react'
import FormPage, { FormField } from '../../../components/common/FormPage'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { pharmacyApi } from '../../../api'
import toast from 'react-hot-toast'

export default function EditPharmacyItem() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { register, handleSubmit, reset } = useForm()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    pharmacyApi.getById(id).then(res => {
      // res.data is from generic response {success, message, data}
      // or directly the object if not wrapped.
      const itemData = res.data?.data || res.data;
      
      reset({
        name: itemData.name,
        category: itemData.category,
        stock_quantity: itemData.stock_quantity,
        unit_price: itemData.unit_price,
        expiry_date: itemData.expiry_date ? itemData.expiry_date.split('T')[0] : '',
        description: itemData.description
      })
      setLoading(false)
    }).catch(() => {
      toast.error('Failed to load item')
      navigate('/pharmacy')
    })
  }, [id, reset, navigate])

  const onSubmit = async (data) => {
    try {
      const formData = new FormData()
      Object.keys(data).forEach(key => {
        if (key === 'image') {
          if (data.image && data.image.length > 0 && data.image[0] instanceof File) {
             formData.append('image', data.image[0])
          }
        } else {
           if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
             formData.append(key, data[key])
           }
        }
      })
      await pharmacyApi.patch(id, formData)
      toast.success('Updated item successfully')
      navigate('/pharmacy')
    } catch { toast.error('Error updating item') }
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>

  return (
    <FormPage title="Edit Pharmacy Item" onSubmit={handleSubmit(onSubmit)} backPath="/pharmacy">
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
        <FormField label="Stock Quantity"><input type="number" {...register('stock_quantity')} className="input-field" /></FormField>
        <FormField label="Unit Price (₹)"><input type="number" step="0.01" {...register('unit_price')} className="input-field" /></FormField>
        <FormField label="Expiry Date"><input type="date" {...register('expiry_date')} className="input-field" /></FormField>
        <FormField label="Item Image (Leave empty to keep current)" fullWidth>
          <input type="file" {...register('image')} accept="image/*" className="input-field p-2" />
        </FormField>
        <FormField label="Description" fullWidth><textarea {...register('description')} placeholder="Special instructions or storage details..." className="input-field h-20" /></FormField>
      </div>
    </FormPage>
  )
}
