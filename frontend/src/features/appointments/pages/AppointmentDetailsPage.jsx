import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { appointmentApi } from '../../../api'
import { Loader } from '../../../components/common'
import { ArrowLeft, Calendar, Clock, User, Stethoscope, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const STATUS_COLORS = {
  scheduled: 'bg-blue-100 text-blue-700', confirmed: 'bg-green-100 text-green-700',
  in_progress: 'bg-yellow-100 text-yellow-700', completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700', no_show: 'bg-orange-100 text-orange-700',
}

export default function AppointmentDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [appt, setAppt] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    appointmentApi.getById(id).then(r => setAppt(r.data?.data || r.data)).finally(() => setLoading(false))
  }, [id])

  const updateStatus = async (status) => {
    try {
      await appointmentApi.updateStatus(id, status)
      setAppt(prev => ({ ...prev, status }))
      toast.success(`Status updated to ${status}`)
    } catch { toast.error('Failed to update status') }
  }

  if (loading) return <Loader />
  if (!appt) return <div className="card text-center py-16 text-gray-400">Appointment not found</div>

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/appointments')} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Appointment Details</h1>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[appt.status]}`}>{appt.status}</span>
      </div>

      <div className="card space-y-4">
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center"><User size={18} className="text-blue-600" /></div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Pet</p>
              <p className="font-semibold text-gray-900">{appt.pet_name}</p>
              <p className="text-sm text-gray-500">{appt.owner_name}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center"><Stethoscope size={18} className="text-green-600" /></div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Doctor</p>
              <p className="font-semibold text-gray-900">{appt.doctor_name}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-yellow-50 rounded-lg flex items-center justify-center"><Calendar size={18} className="text-yellow-600" /></div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Date</p>
              <p className="font-semibold text-gray-900">{appt.appointment_date}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center"><Clock size={18} className="text-purple-600" /></div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Time</p>
              <p className="font-semibold text-gray-900">{appt.appointment_time} ({appt.duration_minutes} min)</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4 space-y-3">
          {appt.reason && <div><p className="text-xs text-gray-400 uppercase mb-1">Reason</p><p className="text-gray-700">{appt.reason}</p></div>}
          {appt.symptoms && <div><p className="text-xs text-gray-400 uppercase mb-1">Symptoms</p><p className="text-gray-700">{appt.symptoms}</p></div>}
          {appt.diagnosis && <div><p className="text-xs text-gray-400 uppercase mb-1">Diagnosis</p><p className="text-gray-700">{appt.diagnosis}</p></div>}
          {appt.prescription && <div><p className="text-xs text-gray-400 uppercase mb-1">Prescription</p><p className="text-gray-700">{appt.prescription}</p></div>}
          {appt.notes && <div><p className="text-xs text-gray-400 uppercase mb-1">Notes</p><p className="text-gray-700">{appt.notes}</p></div>}
        </div>

        {/* Status Actions */}
        {!['completed', 'cancelled'].includes(appt.status) && (
          <div className="border-t border-gray-100 pt-4 flex flex-wrap gap-2">
            <p className="text-sm font-medium text-gray-600 w-full">Update Status:</p>
            {appt.status === 'scheduled' && <button onClick={() => updateStatus('confirmed')} className="btn-secondary text-xs px-3 py-1.5">✅ Confirm</button>}
            {appt.status === 'confirmed' && <button onClick={() => updateStatus('in_progress')} className="btn-secondary text-xs px-3 py-1.5">🔄 Start</button>}
            {appt.status === 'in_progress' && <button onClick={() => updateStatus('completed')} className="btn-primary text-xs px-3 py-1.5">✓ Complete</button>}
            <button onClick={() => updateStatus('cancelled')} className="btn-danger text-xs px-3 py-1.5">✕ Cancel</button>
          </div>
        )}
      </div>
    </div>
  )
}
