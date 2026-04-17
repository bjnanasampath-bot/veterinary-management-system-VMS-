import GenericListPage from '../../../components/common/GenericListPage'
import { billingApi } from '../../../api'
import { Download } from 'lucide-react'
import { Link } from 'react-router-dom'

const statusColors = {
  paid: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  partial: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700',
  draft: 'bg-gray-100 text-gray-700',
}

export default function BillListPage() {
  return (
    <GenericListPage
      title="Billing" subtitle="Manage invoices and payments"
      addPath="/billing/create"
      fetchFn={async (p) => {
        const res = await billingApi.getAll(p)
        const isArray = Array.isArray(res.data)
        const dList = isArray ? res.data : (res.data?.results || res.data?.data || [])
        
        const mappedList = dList.map(r => ({
          ...r,
          _viewPath: `/billing/${r.id}`,
          _deleteName: `Bill #${r.bill_number}`
        }))
        
        if (isArray) return { ...res, data: mappedList }
        return { ...res, data: { ...res.data, results: mappedList } }
      }}
      deleteFn={(id) => billingApi.delete(id)}
      searchPlaceholder="Search by bill number, pet, owner..."
      columns={[
        { key: 'bill_number', label: 'Bill #', render: r => <span className="font-mono font-medium text-primary-600">{r.bill_number}</span> },
        { key: 'pet_name', label: 'Pet' },
        { key: 'owner_name', label: 'Owner' },
        { key: 'doctor_fee', label: 'Doctor Fee', render: r => <span className="text-gray-600">₹{r.doctor_fee || '0.00'}</span> },
        { key: 'medical_fee', label: 'Medical Fee', render: r => <span className="text-gray-600">₹{r.medical_fee || '0.00'}</span> },
        { key: 'total_amount', label: 'Total', render: r => <span className="font-bold">₹{r.total_amount}</span> },
        { key: 'paid_amount', label: 'Paid', render: r => <span className="text-green-600 font-medium">₹{r.paid_amount}</span> },
        { key: 'due_amount', label: 'Due', render: r => <span className={r.due_amount > 0 ? 'text-red-600 font-medium' : 'text-gray-400'}>₹{r.due_amount}</span> },
        { key: 'status', label: 'Status', render: r => (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[r.status] || 'bg-gray-100'}`}>{r.status}</span>
        )},
        { key: 'download', label: 'Invoice', render: r => (
          <Link to={`/billing/${r.id}?download=true`} className="p-1.5 inline-flex items-center justify-center text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded" title="Download PDF">
            <Download size={16} />
          </Link>
        )},
      ]}
    />
  )
}
