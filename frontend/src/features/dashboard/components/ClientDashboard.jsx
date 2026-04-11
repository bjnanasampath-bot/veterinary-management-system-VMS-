import { StatCard } from '../../../components/common'
import { Link } from 'react-router-dom'
import { Plus, CalendarPlus, History, HeartPulse } from 'lucide-react'

export default function ClientDashboard({ stats, upcomingAppts = [], statusColor }) {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/appointments/create" className="card hover:border-primary-500 transition-colors flex items-center gap-4 p-5">
          <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600">
            <CalendarPlus size={28} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg text-left">Book a Visit</h3>
            <p className="text-sm text-gray-400 font-normal">Schedule some care for your pet</p>
          </div>
        </Link>
        <Link to="/pets" className="card hover:border-pink-500 transition-colors flex items-center gap-4 p-5">
          <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-600">
            <HeartPulse size={28} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg text-left">Health Records</h3>
            <p className="text-sm text-gray-400 font-normal">View medications and history</p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="My Pets" value={stats?.total_pets || 0} icon="🐾" color="blue" to="/pets" />
        <StatCard title="My Visits Today" value={stats?.today_appointments || 0} icon="📅" color="green" to="/appointments" />
        <StatCard title="All Upcoming" value={upcomingAppts.length} icon="⏳" color="yellow" to="/appointments" />
        <StatCard title="Pending Payments" value={stats?.pending_bills || 0} icon="🧾" color="red" to="/bills" />
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Your Upcoming Appointments</h2>
          <Link to="/appointments" className="text-sm text-primary-600 hover:underline">See full history</Link>
        </div>
        {upcomingAppts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm mb-4">You have no upcoming appointments</p>
            <Link to="/appointments/create" className="btn-primary inline-flex items-center gap-2">
              <Plus size={16} /> Book Now
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-gray-500 font-medium">Pet</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Date</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Time</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Status</th>
                  <th className="text-right py-2 text-gray-500 font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                {upcomingAppts.map(a => (
                  <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 font-medium">{a.pet_name}</td>
                    <td className="py-2.5 text-gray-600">{a.appointment_date}</td>
                    <td className="py-2.5 text-gray-600">{a.appointment_time}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(a.status)}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <Link to={`/appointments/${a.id}`} className="text-primary-600 hover:text-primary-800 font-medium">View</Link>
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
