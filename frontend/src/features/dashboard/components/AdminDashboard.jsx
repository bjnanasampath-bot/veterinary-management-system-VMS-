import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { StatCard } from '../../../components/common'
import { Link } from 'react-router-dom'
import { UserCheck, UserMinus, UserX, Info } from 'lucide-react'

const COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6']

export default function AdminDashboard({ stats, todayAppts, revenue, apptByType, statusColor, attendance }) {
  const attStatusColor = (s) => ({
    present: 'bg-emerald-100 text-emerald-700',
    absent: 'bg-rose-100 text-rose-700',
    force_leave: 'bg-amber-100 text-amber-700'
  }[s] || 'bg-gray-100 text-gray-700')

  const attIcon = (s) => ({
    present: <UserCheck className="text-emerald-500" size={16} />,
    absent: <UserX className="text-rose-500" size={16} />,
    force_leave: <UserMinus className="text-amber-500" size={16} />
  }[s] || <Info className="text-gray-500" size={16} />)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Pets" value={stats?.total_pets || 0} icon="🐾" color="blue" to="/pets" />
        <StatCard title="Total Owners" value={stats?.total_owners || 0} icon="👥" color="green" to="/owners" />
        <StatCard title="Today's Appointments" value={stats?.today_appointments || 0} icon="📅" color="yellow" to="/appointments" />
        <StatCard title="Monthly Revenue" value={`₹${(stats?.monthly_revenue || 0).toLocaleString()}`} icon="💰" color="purple" to="/bills" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
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

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Attendance Tracker */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Doctor Attendance (Today)</h2>
            <Link to="/doctors" className="text-sm text-primary-600 hover:underline">Manage Doctors</Link>
          </div>
          {attendance?.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
              <p className="text-gray-400 text-sm italic">No attendance records found for today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {attendance.map(att => (
                <div key={att.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    {attIcon(att.status)}
                    <div>
                      <p className="text-sm font-bold text-gray-900">{att.doctor_name}</p>
                      <p className="text-xs text-gray-500">Check-in: {att.check_in_time || 'N/A'}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${attStatusColor(att.status)}`}>
                    {att.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Today's Appointments */}
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
                    <th className="text-left py-2 text-gray-500 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {todayAppts.map(a => (
                    <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2.5 font-medium">{a.pet_name}</td>
                      <td className="py-2.5 text-gray-600">{a.owner_name}</td>
                      <td className="py-2.5 text-gray-600">{a.doctor_name}</td>
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
    </div>
  )
}
