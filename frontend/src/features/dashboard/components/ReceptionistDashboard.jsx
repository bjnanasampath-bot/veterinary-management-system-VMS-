import { StatCard } from '../../../components/common'
import { Link } from 'react-router-dom'
import { Plus, UserPlus, CalendarPlus, Search } from 'lucide-react'

export default function ReceptionistDashboard({ stats, todayAppts, statusColor }) {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to="/owners/add" className="card hover:border-primary-500 transition-colors flex items-center gap-4 p-4">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
            <UserPlus size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-base">New Owner</h3>
            <p className="text-xs text-gray-400 font-normal">Register a new client</p>
          </div>
        </Link>
        <Link to="/appointments/create" className="card hover:border-blue-500 transition-colors flex items-center gap-4 p-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
            <CalendarPlus size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-base">Book Appointment</h3>
            <p className="text-xs text-gray-400 font-normal">Schedule a visit</p>
          </div>
        </Link>
        <Link to="/pets" className="card hover:border-green-500 transition-colors flex items-center gap-4 p-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
            <Search size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-base">Quick Search</h3>
            <p className="text-xs text-gray-400 font-normal">Search pets & owners</p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Today's Bookings" value={stats?.today_appointments || 0} icon="📅" color="blue" />
        <StatCard title="Total Owners" value={stats?.total_owners || 0} icon="👥" color="green" />
        <StatCard title="Pending Review" value={stats?.pending_appointments || 0} icon="⏳" color="yellow" />
        <StatCard title="Unpaid Bills" value={stats?.pending_bills || 0} icon="🧾" color="red" />
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Today's Check-ins</h2>
          <Link to="/appointments" className="text-sm text-primary-600 hover:underline">View all</Link>
        </div>
        {todayAppts.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No appointments for today</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-gray-500 font-medium">Pet & Owner</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Doctor</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Time</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Status</th>
                  <th className="text-right py-2 text-gray-500 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {todayAppts.map(a => (
                  <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5">
                      <div className="font-medium text-gray-900">{a.pet_name}</div>
                      <div className="text-xs text-gray-400 font-normal">{a.owner_name}</div>
                    </td>
                    <td className="py-2.5 text-gray-600">{a.doctor_name}</td>
                    <td className="py-2.5 text-gray-600">{a.appointment_time}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(a.status)}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      {a.status === 'scheduled' && (
                        <button className="text-blue-600 hover:text-blue-800 font-medium mr-3">Check-in</button>
                      )}
                      <Link to={`/billing/create?appointment=${a.id}`} className="text-primary-600 hover:text-primary-800 font-medium">Create Bill</Link>
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
