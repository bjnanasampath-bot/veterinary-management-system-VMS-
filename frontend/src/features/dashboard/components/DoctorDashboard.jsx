import { StatCard } from '../../../components/common'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { doctorApi } from '../../../api'
import toast from 'react-hot-toast'
import { Clock, CheckCircle2, AlertCircle, Calendar } from 'lucide-react'

export default function DoctorDashboard({ stats, todayAppts, statusColor }) {
  const [attendance, setAttendance] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTodayAttendance()
  }, [])

  const fetchTodayAttendance = async () => {
    try {
      setLoading(true)
      const today = new Date().toISOString().split('T')[0]
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
        <StatCard title="My Appointments Today" value={stats?.today_appointments || 0} icon="📅" color="blue" />
        <StatCard title="Total My Patients" value={stats?.total_pets || 0} icon="🐾" color="green" />
        <StatCard title="My Pending Reviews" value={stats?.pending_appointments || 0} icon="⏳" color="yellow" />
        <StatCard title="In Progress Treatments" value={stats?.pending_bills || 0} icon="🧾" color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Card */}
        <div className="card h-fit">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="text-primary-600" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">Today's Attendance</h2>
          </div>

          {!attendance ? (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-center">
              <Clock className="mx-auto text-blue-500 mb-2" size={32} />
              <p className="text-blue-900 font-medium mb-4">You haven't marked attendance today</p>
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
              attendance.status === 'present' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
              attendance.status === 'force_leave' ? 'bg-amber-50 border-amber-100 text-amber-800' :
              'bg-gray-50 border-gray-100 text-gray-700'
            }`}>
              <div className={`p-3 rounded-xl ${attendance.status === 'present' ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-sm opacity-80 uppercase font-bold tracking-wider">Current Status</p>
                <p className="text-xl font-bold capitalize">{attendance.status.replace('_', ' ')}</p>
                <p className="text-xs opacity-70 mt-1">Checked in at: {attendance.check_in_time}</p>
              </div>
            </div>
          )}

          <div className="mt-4 p-3 bg-gray-50 rounded-xl flex items-start gap-3">
            <AlertCircle className="text-gray-400 mt-0.5" size={16} />
            <p className="text-xs text-gray-500">
              Daily attendance helps clinic administrators plan scheduling and resource allocation effectively.
            </p>
          </div>
        </div>

        {/* Schedule Card */}
        <div className="lg:col-span-2 card">
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
    </div>
  )
}
