import { User } from 'lucide-react'
import GenericListPage from '../../../components/common/GenericListPage'
import { doctorApi } from '../../../api'

export default function DoctorListPage() {
  return (
    <GenericListPage
      title="Doctors" subtitle="Manage veterinary doctors"
      addPath="/doctors/add"
      fetchFn={async (p) => {
        const res = await doctorApi.getAll(p)
        const dataList = res.data?.results || res.data?.data || []
        dataList.forEach(r => {
          r._viewPath = `/doctors/${r.id}`
          r._editPath = `/doctors/${r.id}/edit`
          r._deleteName = r.full_name
        })
        return res
      }}
      deleteFn={doctorApi.delete}
      searchPlaceholder="Search doctors by name, specialization..."
      columns={[
        { 
          key: 'photo', 
          label: 'Photo', 
          render: r => (
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
              {r.photo ? (
                <img src={r.photo} alt={r.full_name} className="w-full h-full object-cover" />
              ) : (
                <User size={18} className="text-gray-400" />
              )}
            </div>
          ) 
        },
        { key: 'full_name', label: 'Name', render: r => <span className="font-medium text-gray-900">{r.full_name}</span> },
        { key: 'specialization', label: 'Specialization', render: r => <span className="capitalize">{r.specialization}</span> },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'experience_years', label: 'Experience', render: r => `${r.experience_years} yrs` },
        { key: 'consultation_fee', label: 'Fee', render: r => `₹${r.consultation_fee}` },
      ]}
    />
  )
}
