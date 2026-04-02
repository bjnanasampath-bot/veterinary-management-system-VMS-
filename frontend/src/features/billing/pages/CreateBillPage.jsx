import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { billingApi, petApi } from '../../../api'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { FormField } from '../../../components/common/FormPage'
import toast from 'react-hot-toast'

export default function CreateBillPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [pets, setPets] = useState([])
  const { register, handleSubmit, control, watch } = useForm({
    defaultValues: { items: [{ description: '', item_type: 'consultation', quantity: 1, unit_price: 0 }], discount_percent: 0, tax_percent: 18 }
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'items' })
  const items = watch('items')

  useEffect(() => {
    petApi.getAll({ page_size: 200 }).then(r => setPets(r.data?.results || r.data?.data || []))
  }, [])

  const subtotal = items.reduce((s, i) => s + (Number(i.quantity) * Number(i.unit_price) || 0), 0)
  const discountAmt = subtotal * (Number(watch('discount_percent')) / 100 || 0)
  const taxAmt = (subtotal - discountAmt) * (Number(watch('tax_percent')) / 100 || 0)
  const total = subtotal - discountAmt + taxAmt

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await billingApi.create({ ...data, subtotal, discount_amount: discountAmt, tax_amount: taxAmt, total_amount: total })
      toast.success('Bill created!')
      navigate('/billing')
    } catch { toast.error('Failed to create bill') }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/billing')} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"><ArrowLeft size={18} /></button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Bill</h1>
          <p className="text-sm text-gray-500">Generate a new invoice</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="card">
          <h2 className="font-semibold text-gray-800 mb-4">Patient Info</h2>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Pet" required>
              <select {...register('pet', { required: true })} className="input-field">
                <option value="">Select Pet</option>
                {pets.map(p => <option key={p.id} value={p.id}>{p.name} - {p.owner_name}</option>)}
              </select>
            </FormField>
            <FormField label="Payment Method">
              <select {...register('payment_method')} className="input-field">
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
                <option value="netbanking">Net Banking</option>
              </select>
            </FormField>
            <FormField label="Status">
              <select {...register('status')} className="input-field">
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="draft">Draft</option>
              </select>
            </FormField>
            <FormField label="Due Date">
              <input {...register('due_date')} type="date" className="input-field" />
            </FormField>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Bill Items</h2>
            <button type="button" onClick={() => append({ description: '', item_type: 'consultation', quantity: 1, unit_price: 0 })} className="btn-secondary flex items-center gap-1 text-xs px-3 py-1.5">
              <Plus size={14} /> Add Item
            </button>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-2 text-xs text-gray-500 font-medium uppercase px-1">
              <div className="col-span-4">Description</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-2">Qty</div>
              <div className="col-span-2">Price (₹)</div>
              <div className="col-span-2 text-right">Total</div>
            </div>
            {fields.map((field, i) => (
              <div key={field.id} className="grid grid-cols-12 gap-2 items-center">
                <input {...register(`items.${i}.description`)} className="input-field col-span-4 py-1.5" placeholder="Service description" />
                <select {...register(`items.${i}.item_type`)} className="input-field col-span-2 py-1.5 text-xs">
                  <option value="consultation">Consultation</option>
                  <option value="treatment">Treatment</option>
                  <option value="vaccination">Vaccination</option>
                  <option value="medication">Medication</option>
                  <option value="lab">Lab Test</option>
                  <option value="grooming">Grooming</option>
                  <option value="other">Other</option>
                </select>
                <input {...register(`items.${i}.quantity`)} type="number" min="1" className="input-field col-span-2 py-1.5" defaultValue={1} />
                <input {...register(`items.${i}.unit_price`)} type="number" className="input-field col-span-2 py-1.5" placeholder="0" />
                <div className="col-span-1 text-right text-sm font-medium text-gray-700">
                  ₹{((Number(items[i]?.quantity) || 0) * (Number(items[i]?.unit_price) || 0)).toFixed(2)}
                </div>
                <button type="button" onClick={() => remove(i)} className="col-span-1 flex justify-center text-gray-300 hover:text-red-500">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
            <div className="w-64 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 flex-1">Discount %</span>
                <input {...register('discount_percent')} type="number" min="0" max="100" className="input-field w-16 py-1 text-xs text-right" defaultValue={0} />
                <span className="text-gray-500 w-20 text-right">-₹{discountAmt.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 flex-1">Tax %</span>
                <input {...register('tax_percent')} type="number" min="0" className="input-field w-16 py-1 text-xs text-right" defaultValue={18} />
                <span className="text-gray-500 w-20 text-right">+₹{taxAmt.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-200">
                <span>Total</span><span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <FormField label="Notes">
          <textarea {...register('notes')} className="input-field" rows={2} placeholder="Additional notes..." />
        </FormField>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary px-6 py-2.5">{loading ? 'Creating...' : 'Create Bill'}</button>
          <button type="button" onClick={() => navigate('/billing')} className="btn-secondary px-6 py-2.5">Cancel</button>
        </div>
      </form>
    </div>
  )
}
