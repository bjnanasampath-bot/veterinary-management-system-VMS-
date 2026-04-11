import GenericListPage from '../../../components/common/GenericListPage'
import { surgeryApi } from '../../../api'

const statusColors = {
  scheduled: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function SurgeryListPage({ isEmbedded }) {
  return (
    <GenericListPage
      title="Surgeries" subtitle="Manage surgical operations"
      addPath="/surgeries/add"
      isEmbedded={isEmbedded}
      fetchFn={async (p) => {
        const res = await surgeryApi.getAll(p)
        const dataList = res.data?.results || res.data?.data || []
        dataList.forEach(r => {
          r._editPath = `/surgeries/${r.id}/edit`
          r._deleteName = r.surgery_name
        })
        return res
      }}
      deleteFn={surgeryApi.delete}
      searchPlaceholder="Search surgeries..."
      columns={[
        { key: 'surgery_name', label: 'Surgery Name', render: r => <span className="font-medium">{r.surgery_name}</span> },
        { key: 'pet_name', label: 'Patient (Pet)' },
        { key: 'doctor_name', label: 'Surgeon' },
        { key: 'surgery_date', label: 'Date' },
        { key: 'status', label: 'Status', render: r => (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[r.status] || 'bg-gray-100'}`}>
            {r.status}
          </span>
        )},
      ]}
    />
  )
}
