import { StatCard } from '../../../components/common'
import { Link } from 'react-router-dom'

export default function DoctorDashboard({ stats, todayAppts, statusColor }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="My Appointments Today" value={stats?.today_appointments || 0} icon="📅" color="blue" />
        <StatCard title="Total My Patients" value={stats?.total_pets || 0} icon="🐾" color="green" />
        <StatCard title="My Pending Reviews" value={stats?.pending_appointments || 0} icon="⏳" color="yellow" />
        <StatCard title="In Progress Treatments" value={stats?.pending_bills || 0} icon="🧾" color="purple" />
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">My Schedule (Today)</h2>
          <Link to="/appointments" className="text-sm text-primary-600 hover:underline">View all</Link>
        </div>
        {todayAppts.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No appointments assigned to you today</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-gray-500 font-medium">Pet</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Owner</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Time</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Status</th>
                  <th className="text-right py-2 text-gray-500 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {todayAppts.map(a => (
                  <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 font-medium">{a.pet_name}</td>
                    <td className="py-2.5 text-gray-600">{a.owner_name}</td>
                    <td className="py-2.5 text-gray-600">{a.appointment_time}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(a.status)}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <Link to={`/appointments/${a.id}`} className="text-primary-600 hover:text-primary-800 font-medium">Examine</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
