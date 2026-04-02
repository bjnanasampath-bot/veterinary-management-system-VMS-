import GenericListPage from '../../../components/common/GenericListPage'
import { billingApi } from '../../../api'

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
      fetchFn={billingApi.getAll}
      deleteFn={(id) => billingApi.update(id, { status: 'cancelled' })}
      searchPlaceholder="Search by bill number, pet, owner..."
      columns={[
        { key: 'bill_number', label: 'Bill #', render: r => <span className="font-mono font-medium text-primary-600">{r.bill_number}</span> },
        { key: 'pet_name', label: 'Pet' },
        { key: 'owner_name', label: 'Owner' },
        { key: 'total_amount', label: 'Total', render: r => `₹${r.total_amount}` },
        { key: 'paid_amount', label: 'Paid', render: r => <span className="text-green-600">₹{r.paid_amount}</span> },
        { key: 'due_amount', label: 'Due', render: r => <span className={r.due_amount > 0 ? 'text-red-500' : 'text-gray-400'}>₹{r.due_amount}</span> },
        { key: 'status', label: 'Status', render: r => (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[r.status] || 'bg-gray-100'}`}>{r.status}</span>
        )},
      ]}
    />
  )
}
