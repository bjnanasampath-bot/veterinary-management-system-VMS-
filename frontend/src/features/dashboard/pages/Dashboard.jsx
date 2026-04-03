import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { reportApi, appointmentApi } from '../../../api'
import { Loader } from '../../../components/common'
import AdminDashboard from '../components/AdminDashboard'
import DoctorDashboard from '../components/DoctorDashboard'
import ReceptionistDashboard from '../components/ReceptionistDashboard'
import ClientDashboard from '../components/ClientDashboard'

export default function Dashboard() {
  const { user } = useSelector(s => s.auth)
  const [stats, setStats] = useState(null)
  const [revenue, setRevenue] = useState([])
  const [apptByType, setApptByType] = useState([])
  const [todayAppts, setTodayAppts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      reportApi.getDashboardStats(),
      reportApi.getRevenueReport({ months: 6 }),
      reportApi.getAppointmentReport({ days: 30 }),
      appointmentApi.getToday(),
    ]).then(([statsRes, revRes, apptRes, todayRes]) => {
      setStats(statsRes.data?.data)
      setRevenue(revRes.data?.data || [])
      setApptByType(apptRes.data?.data?.by_type || [])
      setTodayAppts(todayRes.data?.data || [])
    }).finally(() => setLoading(false))
  }, [user.role])

  if (loading) return <Loader text="Loading dashboard..." />

  const statusColor = (s) => ({ scheduled:'bg-blue-100 text-blue-700', confirmed:'bg-green-100 text-green-700', completed:'bg-emerald-100 text-emerald-700', in_progress:'bg-amber-100 text-amber-700', cancelled:'bg-rose-100 text-rose-700' }[s] || 'bg-slate-100 text-slate-600')

  const renderDashboard = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard stats={stats} todayAppts={todayAppts} revenue={revenue} apptByType={apptByType} statusColor={statusColor} />
      case 'doctor':
        return <DoctorDashboard stats={stats} todayAppts={todayAppts} statusColor={statusColor} />
      case 'receptionist':
        return <ReceptionistDashboard stats={stats} todayAppts={todayAppts} statusColor={statusColor} />
      case 'client':
        return <ClientDashboard stats={stats} todayAppts={todayAppts} statusColor={statusColor} />
      default:
        return <div className="card text-center p-12 text-gray-400">Unauthorized role</div>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 capitalize">{user.role} Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back, <span className="font-semibold text-primary-700">{user.full_name || 'User'}</span>
        </p>
      </div>

      {renderDashboard()}
    </div>
  )
}
