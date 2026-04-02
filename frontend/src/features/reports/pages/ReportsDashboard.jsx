import { useEffect, useState } from 'react'
import { reportApi } from '../../../api'
import { Loader, StatCard } from '../../../components/common'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts'

const COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function ReportsDashboard() {
  const [stats, setStats] = useState(null)
  const [revenue, setRevenue] = useState([])
  const [apptData, setApptData] = useState({})
  const [species, setSpecies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      reportApi.getDashboardStats(),
      reportApi.getRevenueReport({ months: 12 }),
      reportApi.getAppointmentReport({ days: 30 }),
      reportApi.getPetSpeciesReport(),
    ]).then(([s, r, a, sp]) => {
      setStats(s.data?.data)
      setRevenue(r.data?.data || [])
      setApptData(a.data?.data || {})
      setSpecies(sp.data?.data || [])
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader text="Loading reports..." />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of clinic performance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={`₹${(stats?.total_revenue || 0).toLocaleString()}`} icon="💰" color="green" />
        <StatCard title="This Month" value={`₹${(stats?.monthly_revenue || 0).toLocaleString()}`} icon="📅" color="blue" />
        <StatCard title="Total Pets" value={stats?.total_pets || 0} icon="🐾" color="purple" />
        <StatCard title="Total Owners" value={stats?.total_owners || 0} icon="👥" color="yellow" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue (12 Months)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [`₹${v}`, 'Revenue']} />
              <Bar dataKey="total" fill="#0ea5e9" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pet Species Distribution</h2>
          {species.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={species} dataKey="count" nameKey="species" cx="50%" cy="50%" outerRadius={90} label={({ species, count }) => `${species}: ${count}`}>
                  {species.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-sm text-center py-20">No data available</p>}
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Appointments by Status (Last 30 Days)</h2>
          {(apptData.by_status || []).length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={apptData.by_status} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={90} label>
                  {(apptData.by_status || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-sm text-center py-20">No appointment data</p>}
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Daily Appointments (Last 30 Days)</h2>
          {(apptData.daily || []).length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={apptData.daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#0ea5e9" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-sm text-center py-20">No data</p>}
        </div>
      </div>
    </div>
  )
}
