import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { doctorApi } from '../../../api'
import { Loader } from '../../../components/common'
import { ArrowLeft, Pencil, User, Mail, Phone, Award, Calendar, Activity, CheckCircle, Clock, XCircle } from 'lucide-react'

export default function DoctorDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user: authUser } = useSelector(s => s.auth)
  const isAdmin = authUser?.role === 'admin'

  useEffect(() => {
    doctorApi.getById(id).then(r => setDoctor(r.data?.data || r.data)).finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loader />
  if (!doctor) return <div className="card text-center py-16 text-gray-400">Doctor not found</div>

  const stats = doctor.analytics || {}
  const statusBreakdown = stats.status_breakdown || {}

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/doctors')} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Doctor Profile</h1>
          <p className="text-sm text-gray-500">Full information and work status</p>
        </div>
        {isAdmin && (
          <Link to={`/doctors/${id}/edit`} className="btn-secondary flex items-center gap-2 text-sm">
            <Pencil size={15} /> Edit Profile
          </Link>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Card */}
        <div className="space-y-6">
          <div className="card text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              {doctor.photo ? (
                <img src={doctor.photo} alt={doctor.full_name} className="w-full h-full object-cover rounded-2xl border-4 border-white shadow-sm" />
              ) : (
                <div className="w-full h-full bg-primary-50 rounded-2xl flex items-center justify-center">
                  <User size={48} className="text-primary-500" />
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{doctor.full_name}</h2>
            <p className="text-sm font-medium text-primary-600 capitalize mb-4">{doctor.specialization}</p>
            
            <div className="space-y-3 text-left border-t border-gray-50 pt-4 mt-2">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                < Award className="text-gray-400" size={16} />
                <span>{doctor.experience_years} Years Experience</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail className="text-gray-400" size={16} />
                <span>{doctor.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Phone className="text-gray-400" size={16} />
                <span>{doctor.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Award className="text-gray-400" size={16} />
                <span className="font-medium text-gray-900">License: {doctor.license_number}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Bio</h3>
            <p className="text-sm text-gray-600 leading-relaxed italic">
              {doctor.bio || "No biography provided."}
            </p>
          </div>
        </div>

        {/* Right Column: Workload & Status Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Daily Work', value: stats.daily, color: 'text-blue-600', bg: 'bg-blue-50', icon: Calendar },
              { label: 'Weekly Work', value: stats.weekly, color: 'text-purple-600', bg: 'bg-purple-50', icon: Activity },
              { label: 'Monthly Work', value: stats.monthly, color: 'text-green-600', bg: 'bg-green-50', icon: Calendar },
              { label: 'Yearly Work', value: stats.yearly, color: 'text-orange-600', bg: 'bg-orange-50', icon: Calendar },
            ].map(s => (
              <div key={s.label} className="card p-4 text-center">
                <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                  <s.icon size={20} className={s.color} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Work Status Breakdown */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-6">Work Status Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                {[
                  { label: 'Completed', value: statusBreakdown.completed, icon: CheckCircle, color: 'text-green-500', total: stats.yearly || 1 },
                  { label: 'In Progress', value: statusBreakdown.in_progress, icon: Clock, color: 'text-blue-500', total: stats.yearly || 1 },
                  { label: 'Scheduled', value: statusBreakdown.scheduled, icon: Calendar, color: 'text-primary-500', total: stats.yearly || 1 },
                  { label: 'Cancelled', value: statusBreakdown.cancelled, icon: XCircle, color: 'text-red-500', total: stats.yearly || 1 },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between items-center text-sm mb-1.5">
                      <div className="flex items-center gap-2">
                        <item.icon size={16} className={item.color} />
                        <span className="font-medium text-gray-700">{item.label}</span>
                      </div>
                      <span className="text-gray-900 font-bold">{item.value}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.color.replace('text-', 'bg-')} shadow-sm`} 
                        style={{ width: `${(item.value / (item.total || 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col justify-center items-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Total Lifetime Appointments</p>
                <p className="text-5xl font-black text-gray-900 tracking-tight">{stats.yearly || 0}</p>
                <div className="mt-4 flex items-center gap-2 text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                  <Activity size={12} />
                  <span>Active Work Mode</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
