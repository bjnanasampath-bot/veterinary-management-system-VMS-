import { useSelector } from 'react-redux'
import GenericListPage from '../../../components/common/GenericListPage'
import { vaccinationApi } from '../../../api'

export default function VaccinationListPage({ isEmbedded }) {
  const role = useSelector(s => s.auth.user?.role)
  return (
    <GenericListPage
      title="Vaccinations" subtitle="Track all pet vaccinations"
      addPath="/vaccinations/add"
      showAdd={role === 'doctor'}
      isEmbedded={isEmbedded}
      fetchFn={vaccinationApi.getAll}
      deleteFn={vaccinationApi.delete}
      searchPlaceholder="Search by pet name, vaccine..."
      columns={[
        { key: 'pet_name', label: 'Pet', render: r => <span className="font-medium">{r.pet_name}</span> },
        { key: 'vaccine_name', label: 'Vaccine' },
        { key: 'vaccination_date', label: 'Date' },
        { key: 'next_due_date', label: 'Next Due', render: r => r.next_due_date || '—' },
        { key: 'status', label: 'Status', render: r => (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            r.status === 'completed' ? 'bg-green-100 text-green-700' :
            r.status === 'overdue' ? 'bg-red-100 text-red-700' :
            'bg-yellow-100 text-yellow-700'
          }`}>{r.status}</span>
        )},
        { key: 'cost', label: 'Cost', render: r => `₹${r.cost}` },
      ]}
    />
  )
}
