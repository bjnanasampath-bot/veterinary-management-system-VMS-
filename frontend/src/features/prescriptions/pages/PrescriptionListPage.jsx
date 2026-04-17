import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import GenericListPage from '../../../components/common/GenericListPage'
import { prescriptionApi } from '../../../api'

const statusColors = {
  active: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function PrescriptionListPage() {
  const role = useSelector(s => s.auth.user?.role)
  return (
    <GenericListPage
      title="Prescriptions" 
      subtitle="View all medical prescriptions assigned to patients"
      addPath="/prescriptions/add"
      showAdd={role === 'doctor'}
      deleteFn={async (id) => await prescriptionApi.delete(id)}
      fetchFn={async (p) => {
        const res = await prescriptionApi.getAll(p)
        const dataList = res.data?.results || res.data?.data || []
        
        const mapped = dataList.map(r => ({
           id: r.id,
           idx: r.id,
           pet_name: r.pet_name || 'Unknown',
           medication_name: r.medication_name || 'Unknown',
           dosage: r.dosage,
           frequency: r.frequency,
           duration: `${r.duration_days} Days`,
           date: new Date(r.created_at).toLocaleDateString(),
           status: r.status,
           _viewPath: `/prescriptions/${r.id}`,
           _deleteName: `Prescription for ${r.pet_name || 'Unknown'}`
        }))
        
        return { ...res, data: { ...res.data, results: mapped } }
      }}
      searchPlaceholder="Search prescriptions..."
      columns={[
        { key: 'medication_name', label: 'Medication', render: r => <span className="font-medium text-primary-700">{r.medication_name}</span> },
        { key: 'pet_name', label: 'Patient (Pet)', render: r => (
          <Link to={`/prescriptions/${r.id}`} className="text-primary-600 hover:text-primary-800 hover:underline font-medium">
            {r.pet_name}
          </Link>
        )},
        { key: 'dosage', label: 'Instructions', render: r => (
          <div className="flex flex-col">
            <span className="text-gray-900 font-medium">{r.dosage}</span>
            <span className="text-[10px] text-gray-500">{r.frequency}</span>
          </div>
        )},
        { key: 'duration', label: 'Duration' },
        { key: 'date', label: 'Prescribed On' },
      ]}
    />
  )
}
