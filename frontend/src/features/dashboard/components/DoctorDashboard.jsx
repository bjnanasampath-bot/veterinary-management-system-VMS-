import { StatCard } from '../../../components/common'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { doctorApi } from '../../../api'
import toast from 'react-hot-toast'
import { Clock, CheckCircle2, AlertCircle, Calendar } from 'lucide-react'

export default function DoctorDashboard({ stats, todayAppts, pendingAppts = [], statusColor }) {
  const [attendance, setAttendance] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTodayAttendance()
  }, [])

  const fetchTodayAttendance = async () => {
    try {
      setLoading(true)
      const today = new Date().toLocaleDateString('en-CA')
      const res = await doctorApi.getAttendance({ date: today })
      // Since it returns a list, find the one for today if it exists
      setAttendance(res.data?.results?.[0] || null)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAttendance = async (status) => {
    try {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      await doctorApi.markAttendance({ status, check_in_time: now })
      toast.success(`Attendance marked as ${status}`)
      fetchTodayAttendance()
    } catch (err) {
      toast.error('Could not mark attendance. You might have already marked it for today.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="My Appointments Today" value={stats?.today_appointments || 0} icon="📅" color="blue" to="/appointments" />
        <StatCard title="Total My Patients" value={stats?.total_pets || 0} icon="🐾" color="green" to="/pets" />
        <StatCard title="New Requests" value={pendingAppts.length} icon="⏳" color="yellow" to="/appointments" />
        <StatCard title="Active Treatments" value={stats?.pending_bills || 0} icon="🧾" color="purple" to="/bills" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Card */}
        <div className="card h-fit">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="text-primary-600 dark:text-primary-400" size={20} />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Attendance</h2>
          </div>

          {!attendance ? (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-2xl p-5 text-center">
              <Clock className="mx-auto text-blue-500 dark:text-blue-400 mb-2" size={32} />
              <p className="text-blue-900 dark:text-blue-300 font-medium mb-4">You haven't marked attendance today</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleMarkAttendance('present')}
                  className="btn-primary flex-1 py-2 text-sm"
                >
                  Mark Present
                </button>
              </div>
            </div>
          ) : (
            <div className={`rounded-2xl p-5 flex items-center gap-4 border ${
              attendance.status === 'present' ? 'bg-emerald-50 border-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400' :
              attendance.status === 'force_leave' ? 'bg-amber-50 border-amber-100 text-amber-800 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-400' :
              'bg-gray-100 border-gray-100 text-gray-700 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-300'
            }`}>
              <div className={`p-3 rounded-xl ${attendance.status === 'present' ? 'bg-emerald-100 dark:bg-emerald-900/50' : 'bg-amber-100 dark:bg-amber-900/50'}`}>
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-sm opacity-80 uppercase font-bold tracking-wider">Current Status</p>
                <p className="text-xl font-bold capitalize">{attendance.status.replace('_', ' ')}</p>
                <p className="text-xs opacity-70 mt-1">Checked in at: {attendance.check_in_time}</p>
              </div>
            </div>
          )}

          <div className="mt-4 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl flex items-start gap-3">
            <AlertCircle className="text-gray-400 dark:text-slate-500 mt-0.5" size={16} />
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Daily attendance helps clinic administrators plan scheduling and resource allocation effectively.
            </p>
          </div>
        </div>

        {/* Schedule & Requests */}
        <div className="lg:col-span-2 space-y-6">
          {/* New Pending Requests */}
          {pendingAppts.length > 0 && (
            <div className="card border-yellow-100 dark:border-yellow-900/50 bg-yellow-50/30 dark:bg-yellow-900/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                  New Appointment Requests
                </h2>
                <Link to="/appointments" className="text-sm text-yellow-700 dark:text-yellow-500 hover:underline">Review all</Link>
              </div>
              <div className="space-y-3">
                {pendingAppts.slice(0, 3).map(a => (
                  <div key={a.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-yellow-100 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{a.pet_name} - {a.appointment_type}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{a.appointment_date} at {a.appointment_time}</p>
                    </div>
                    <Link to={`/appointments/${a.id}`} className="btn-secondary px-4 py-1.5 text-xs bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50">
                      Handle Request
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Schedule Today */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Active Schedule</h2>
              <Link to="/appointments" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">View all</Link>
            </div>
            {todayAppts.length === 0 ? (
              <p className="text-gray-400 dark:text-slate-500 text-sm text-center py-8">No active appointments for you today</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-slate-800">
                      <th className="text-left py-2 text-gray-500 dark:text-slate-400 font-medium">Pet</th>
                      <th className="text-left py-2 text-gray-500 dark:text-slate-400 font-medium">Time</th>
                      <th className="text-left py-2 text-gray-500 dark:text-slate-400 font-medium">Status</th>
                      <th className="text-right py-2 text-gray-500 dark:text-slate-400 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayAppts.map(a => (
                      <tr key={a.id} className="border-b border-gray-50 dark:border-slate-800/50 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                        <td className="py-2.5 font-medium dark:text-white">{a.pet_name}</td>
                        <td className="py-2.5 text-gray-600 dark:text-gray-300">{a.appointment_time}</td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(a.status)}`}>
                            {a.status}
                          </span>
                        </td>
                        <td className="py-2.5 text-right">
                          <Link to={`/appointments/${a.id}`} className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium">Manage</Link>
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
    </div>
  )
}
