import GenericListPage from '../../../components/common/GenericListPage'
import { labTestApi } from '../../../api'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function LabTestListPage() {
  return (
    <GenericListPage
      title="Lab Tests" subtitle="Manage patient lab tests and results"
      addPath="/lab-tests/add"
      fetchFn={async (p) => {
        const res = await labTestApi.getAll(p)
        const dataList = res.data?.results || res.data?.data || []
        dataList.forEach(r => {
          r._editPath = `/lab-tests/${r.id}/edit`
          r._deleteName = r.test_name
        })
        return res
      }}
      deleteFn={labTestApi.delete}
      searchPlaceholder="Search lab tests..."
      columns={[
        { key: 'test_name', label: 'Test Name', render: r => <span className="font-medium">{r.test_name}</span> },
        { key: 'pet_name', label: 'Patient (Pet)' },
        { key: 'doctor_name', label: 'Requested By' },
        { key: 'test_date', label: 'Date' },
        { key: 'status', label: 'Status', render: r => (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[r.status] || 'bg-gray-100'}`}>
            {r.status}
          </span>
        )},
      ]}
    />
  )
}
