import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { reportApi, appointmentApi, doctorApi } from '../../../api'
import { Loader } from '../../../components/common'
import AdminDashboard from '../components/AdminDashboard'
import DoctorDashboard from '../components/DoctorDashboard'
import ClientDashboard from '../components/ClientDashboard'

export default function Dashboard() {
  const { user } = useSelector(s => s.auth)
  const [stats, setStats] = useState(null)
  const [revenue, setRevenue] = useState([])
  const [apptByType, setApptByType] = useState([])
  const [todayAppts, setTodayAppts] = useState([])
  const [attendance, setAttendance] = useState([])
  const [pendingAppts, setPendingAppts] = useState([])
  const [upcomingAppts, setUpcomingAppts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch cross-role base stats
        const statsRes = await reportApi.getDashboardStats();
        setStats(statsRes.data?.data || statsRes.data);

        // 2. Fetch role-specific data
        if (user.role === 'admin') {
          const today = new Date().toLocaleDateString('en-CA');
          const [revRes, apptRes, todayRes, attendanceRes] = await Promise.all([
            reportApi.getRevenueReport({ months: 6 }).catch(() => ({ data: [] })),
            reportApi.getAppointmentReport({ days: 30 }).catch(() => ({ data: {} })),
            appointmentApi.getToday().catch(() => ({ data: [] })),
            doctorApi.getAttendance({ date: today }).catch(() => ({ data: [] }))
          ]);

          setRevenue(revRes.data?.data || revRes.data || []);
          setApptByType(apptRes.data?.data?.by_type || apptRes.data?.by_type || []);
          setTodayAppts(todayRes.data?.data || todayRes.data || []);
          setAttendance(attendanceRes.data?.results || attendanceRes.data || []);

        } else if (user.role === 'doctor') {
          const [todayRes, pendingRes] = await Promise.all([
            appointmentApi.getToday().catch(() => ({ data: [] })),
            appointmentApi.getAll({ status: 'scheduled', ordering: 'appointment_date' }).catch(() => ({ data: [] }))
          ]);

          setTodayAppts(todayRes.data?.data || todayRes.data || []);
          setPendingAppts(pendingRes.data?.results || pendingRes.data?.data || []);

        } else if (user.role === 'client') {
          const [upcomingRes] = await Promise.all([
            appointmentApi.getAll({ 
              status: 'scheduled,confirmed', 
              ordering: 'appointment_date' 
            }).catch(() => ({ data: [] }))
          ]);

          setUpcomingAppts(upcomingRes.data?.results || upcomingRes.data?.data || []);
        }
      } catch (err) {
        console.error("Dashboard primary data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user.role) {
      fetchData();
    }
  }, [user.role]);

  if (loading) return <Loader text="Loading dashboard..." />

  const statusColor = (s) => ({ 
    scheduled:'bg-blue-100 text-blue-700', 
    confirmed:'bg-green-100 text-green-700', 
    completed:'bg-emerald-100 text-emerald-700', 
    in_progress:'bg-amber-100 text-amber-700', 
    cancelled:'bg-rose-100 text-rose-700' 
  }[s] || 'bg-slate-100 text-slate-600')

  const renderDashboard = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard stats={stats} todayAppts={todayAppts} revenue={revenue} apptByType={apptByType} statusColor={statusColor} attendance={attendance} />
      case 'doctor':
        return <DoctorDashboard stats={stats} todayAppts={todayAppts} pendingAppts={pendingAppts} statusColor={statusColor} />
      case 'client':
        return <ClientDashboard stats={stats} upcomingAppts={upcomingAppts} statusColor={statusColor} />
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
