import GenericListPage from '../../../components/common/GenericListPage'
import { prescriptionApi } from '../../../api'

const statusColors = {
  active: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function PrescriptionListPage() {
  return (
    <GenericListPage
      title="Prescriptions" subtitle="Manage patient medications"
      addPath="/prescriptions/add"
      fetchFn={async (p) => {
        const res = await prescriptionApi.getAll(p)
        const dataList = res.data?.results || res.data?.data || []
        dataList.forEach(r => {
          r._editPath = `/prescriptions/${r.id}/edit`
          r._deleteName = r.medication_name
        })
        return res
      }}
      deleteFn={prescriptionApi.delete}
      searchPlaceholder="Search prescriptions..."
      columns={[
        { key: 'medication_name', label: 'Medication', render: r => <span className="font-medium">{r.medication_name}</span> },
        { key: 'pet_name', label: 'Patient (Pet)' },
        { key: 'dosage', label: 'Dosage', render: r => `${r.dosage} - ${r.frequency}` },
        { key: 'duration_days', label: 'Duration', render: r => `${r.duration_days} days` },
        { key: 'status', label: 'Status', render: r => (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[r.status] || 'bg-gray-100'}`}>
            {r.status}
          </span>
        )},
      ]}
    />
  )
}
