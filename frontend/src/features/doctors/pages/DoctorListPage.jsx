import GenericListPage from '../../../components/common/GenericListPage'
import { doctorApi } from '../../../api'

export default function DoctorListPage() {
  return (
    <GenericListPage
      title="Doctors" subtitle="Manage veterinary doctors"
      addPath="/doctors/add"
      fetchFn={doctorApi.getAll}
      deleteFn={doctorApi.delete}
      searchPlaceholder="Search doctors by name, specialization..."
      columns={[
        { key: 'full_name', label: 'Name', render: r => <span className="font-medium">{r.full_name}</span> },
        { key: 'specialization', label: 'Specialization', render: r => <span className="capitalize">{r.specialization}</span> },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'experience_years', label: 'Experience', render: r => `${r.experience_years} yrs` },
        { key: 'consultation_fee', label: 'Fee', render: r => `₹${r.consultation_fee}` },
      ]}
    />
  )
}
