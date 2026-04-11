import GenericListPage from '../../../components/common/GenericListPage'
import { treatmentApi } from '../../../api'

const statusColors = {
  active: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function PrescriptionListPage() {
  return (
    <GenericListPage
      title="Prescriptions" 
      subtitle="View all medical prescriptions from treatments"
      showAdd={false}
      fetchFn={async (p) => {
        const res = await treatmentApi.getAll(p)
        const dataList = res.data?.results || res.data?.data || []
        
        // Flatten medications from treatments into a list of prescription-like rows
        const prescriptions = []
        dataList.forEach(t => {
          if (t.medications && Array.isArray(t.medications)) {
            t.medications.forEach((m, idx) => {
              prescriptions.push({
                idx: `${t.id}-${idx}`,
                pet_name: t.pet_name,
                medication_name: m.name || 'Unknown',
                dosage: m.dosage || 'N/A',
                frequency: m.frequency || 'N/A',
                duration: m.duration || 'N/A',
                date: t.treatment_date,
                status: 'active'
              })
            })
          } else if (t.prescription) {
            prescriptions.push({
              idx: t.id,
              pet_name: t.pet_name,
              medication_name: 'Prescription Detail',
              dosage: t.prescription,
              frequency: 'As prescribed',
              duration: '-',
              date: t.treatment_date,
              status: 'active'
            })
          }
        })
        
        return { ...res, data: { ...res.data, results: prescriptions } }
      }}
      searchPlaceholder="Search prescriptions..."
      columns={[
        { key: 'medication_name', label: 'Medication', render: r => <span className="font-medium text-primary-700">{r.medication_name}</span> },
        { key: 'pet_name', label: 'Patient (Pet)' },
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
