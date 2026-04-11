import { useSelector } from 'react-redux'
import GenericListPage from '../../../components/common/GenericListPage'
import { appointmentApi } from '../../../api'

const statusColors = {
  scheduled: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
  no_show: 'bg-orange-100 text-orange-700',
}

export default function AppointmentListPage() {
  const { user } = useSelector(s => s.auth)
  const role = user?.role

  return (
    <GenericListPage
      title="Appointments" subtitle="Manage all appointments"
      addPath="/appointments/create"
      showAdd={role !== 'admin'}
      fetchFn={async (p) => {
        const res = await appointmentApi.getAll(p)
        const dataList = res.data?.results || res.data?.data || []
        dataList.forEach(r => {
          r._viewPath = `/appointments/${r.id}`
        })
        return res
      }}
      deleteFn={(id) => appointmentApi.updateStatus(id, 'cancelled')}
      searchPlaceholder="Search by pet name, doctor..."
      columns={[
        { key: 'pet_name', label: 'Pet', render: r => <span className="font-medium">{r.pet_name}</span> },
        { key: 'owner_name', label: 'Owner' },
        { key: 'doctor_name', label: 'Doctor' },
        { key: 'appointment_date', label: 'Date' },
        { key: 'appointment_time', label: 'Time' },
        { key: 'appointment_type', label: 'Type', render: r => <span className="capitalize">{r.appointment_type}</span> },
        { key: 'status', label: 'Status', render: r => (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[r.status] || 'bg-gray-100'}`}>
            {r.status}
          </span>
        )},
      ]}
    />
  )
}
