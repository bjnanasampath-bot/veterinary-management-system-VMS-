import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { StatCard } from '../../../components/common'
import { Link } from 'react-router-dom'

const COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6']

export default function AdminDashboard({ stats, todayAppts, revenue, apptByType, statusColor }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Pets" value={stats?.total_pets || 0} icon="🐾" color="blue" />
        <StatCard title="Total Owners" value={stats?.total_owners || 0} icon="👥" color="green" />
        <StatCard title="Today's Appointments" value={stats?.today_appointments || 0} icon="📅" color="yellow" />
        <StatCard title="Monthly Revenue" value={`₹${(stats?.monthly_revenue || 0).toLocaleString()}`} icon="💰" color="purple" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue (Last 6 Months)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => [`₹${v}`, 'Revenue']} />
              <Bar dataKey="total" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Appointments by Type</h2>
          {apptByType.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={apptByType} dataKey="count" nameKey="appointment_type" cx="50%" cy="50%" outerRadius={80} label>
                  {apptByType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-sm text-center py-16">No appointment data</p>}
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Today's Appointments</h2>
          <Link to="/appointments" className="text-sm text-primary-600 hover:underline">View all</Link>
        </div>
        {todayAppts.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No appointments scheduled for today</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-gray-500 font-medium">Pet</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Owner</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Doctor</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Time</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {todayAppts.map(a => (
                  <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 font-medium">{a.pet_name}</td>
                    <td className="py-2.5 text-gray-600">{a.owner_name}</td>
                    <td className="py-2.5 text-gray-600">{a.doctor_name}</td>
                    <td className="py-2.5 text-gray-600">{a.appointment_time}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(a.status)}`}>
                        {a.status}
                      </span>
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
