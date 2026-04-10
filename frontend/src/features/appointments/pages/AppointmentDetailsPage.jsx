import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { appointmentApi } from '../../../api'
import { Loader } from '../../../components/common'
import { ArrowLeft, Calendar, Clock, User, Stethoscope, CheckCircle, XCircle, Edit2 } from 'lucide-react'
import toast from 'react-hot-toast'

const STATUS_COLORS = {
  scheduled: 'bg-blue-100 text-blue-700', confirmed: 'bg-green-100 text-green-700',
  in_progress: 'bg-yellow-100 text-yellow-700', completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700', no_show: 'bg-orange-100 text-orange-700',
}

export default function AppointmentDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useSelector(s => s.auth)
  const [appt, setAppt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isRescheduling, setIsRescheduling] = useState(false)
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')

  useEffect(() => {
    fetchAppointment()
  }, [id])

  const fetchAppointment = async () => {
    try {
      setLoading(true)
      const r = await appointmentApi.getById(id)
      const data = r.data?.data || r.data
      setAppt(data)
      setNewDate(data.appointment_date)
      setNewTime(data.appointment_time)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (status) => {
    try {
      await appointmentApi.updateStatus(id, status)
      setAppt(prev => ({ ...prev, status }))
      toast.success(`Slot ${status === 'confirmed' ? 'Accepted' : 'Updated'}`)
    } catch { toast.error('Failed to update status') }
  }

  const handleReschedule = async () => {
    try {
      await appointmentApi.update(id, { 
        ...appt, 
        appointment_date: newDate, 
        appointment_time: newTime,
        status: 'confirmed' // Auto confirm on reschedule by doctor
      })
      toast.success('Appointment rescheduled and confirmed')
      setIsRescheduling(false)
      fetchAppointment()
    } catch {
      toast.error('Failed to reschedule')
    }
  }

  if (loading) return <Loader />
  if (!appt) return <div className="card text-center py-16 text-gray-400">Appointment not found</div>

  const isDoctor = user.role === 'doctor' || user.role === 'admin'

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/appointments')} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Appointment Info</h1>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[appt.status]}`}>
          {appt.status.replace('_', ' ')}
        </span>
      </div>

      <div className="card space-y-6">
        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><User size={20} /></div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Pet / Patient</p>
              <p className="text-lg font-bold text-gray-900">{appt.pet_name}</p>
              <p className="text-sm text-gray-500">{appt.owner_name} (Owner)</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600"><Stethoscope size={20} /></div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Assigned Doctor</p>
              <p className="text-lg font-bold text-gray-900">{appt.doctor_name || 'Unassigned'}</p>
            </div>
          </div>

          {!isRescheduling ? (
            <>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600"><Calendar size={20} /></div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Date</p>
                  <p className="text-lg font-bold text-gray-900">{appt.appointment_date}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600"><Clock size={20} /></div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Time Slot</p>
                  <p className="text-lg font-bold text-gray-900">{appt.appointment_time}</p>
                  <p className="text-xs text-gray-400">{appt.duration_minutes} Minutes duration</p>
                </div>
              </div>
            </>
          ) : (
            <div className="col-span-full bg-primary-50 p-4 rounded-2xl border border-primary-100 space-y-4">
              <h3 className="font-bold text-primary-900">Reschedule Appointment</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-primary-700 uppercase mb-1">New Date</label>
                  <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="w-full rounded-xl border-primary-200 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary-700 uppercase mb-1">New Time</label>
                  <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} className="w-full rounded-xl border-primary-200 focus:ring-primary-500" />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleReschedule} className="btn-primary py-2 px-6">Confirm Reschedule</button>
                <button onClick={() => setIsRescheduling(false)} className="btn-secondary py-2 px-6">Cancel</button>
              </div>
            </div>
          )}
        </div>

        {/* Notes & Medical Info */}
        <div className="border-t border-gray-100 pt-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
          {appt.reason && <div className="col-span-full"><p className="text-xs text-gray-400 uppercase font-bold mb-1">Visit Reason</p><p className="text-gray-900 bg-gray-50 p-3 rounded-xl border border-gray-100">{appt.reason}</p></div>}
          {appt.symptoms && <div><p className="text-xs text-gray-400 uppercase font-bold mb-1">Symptoms</p><p className="text-gray-700">{appt.symptoms}</p></div>}
          {appt.diagnosis && <div><p className="text-xs text-gray-400 uppercase font-bold mb-1">Diagnosis</p><p className="text-gray-700 font-medium">{appt.diagnosis}</p></div>}
          {appt.prescription && <div><p className="text-xs text-gray-400 uppercase font-bold mb-1">Prescription</p><p className="text-gray-700 italic">{appt.prescription}</p></div>}
          {appt.notes && <div className="col-span-full"><p className="text-xs text-gray-400 uppercase font-bold mb-1">Internal Notes</p><p className="text-gray-600 text-sm">{appt.notes}</p></div>}
        </div>

        {/* Actions for Staff */}
        {!['completed', 'cancelled'].includes(appt.status) && isDoctor && !isRescheduling && (
          <div className="border-t border-gray-100 pt-6 flex flex-wrap items-center gap-3">
            <span className="text-sm font-bold text-gray-900 w-full mb-1">Doctor Actions:</span>
            
            {appt.status === 'scheduled' && (
              <>
                <button onClick={() => updateStatus('confirmed')} className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2 rounded-xl hover:bg-emerald-700 transition shadow-sm font-bold text-sm">
                  <CheckCircle size={18} /> Accept & Confirm
                </button>
                <button onClick={() => setIsRescheduling(true)} className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2 rounded-xl hover:bg-gray-50 transition shadow-sm font-bold text-sm">
                  <Edit2 size={18} /> Reschedule / Set Slot
                </button>
              </>
            )}

            {appt.status === 'confirmed' && (
              <button onClick={() => updateStatus('in_progress')} className="flex items-center gap-2 bg-primary-600 text-white px-5 py-2 rounded-xl hover:bg-primary-700 transition shadow-sm font-bold text-sm">
                🔄 Start Examination
              </button>
            )}
            
            {appt.status === 'in_progress' && (
              <button onClick={() => updateStatus('completed')} className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2 rounded-xl hover:bg-emerald-700 transition shadow-sm font-bold text-sm">
                ✓ Mark Completed
              </button>
            )}

            <button onClick={() => updateStatus('cancelled')} className="flex items-center gap-2 bg-white border border-rose-100 text-rose-600 px-5 py-2 rounded-xl hover:bg-rose-50 transition font-bold text-sm ml-auto">
              <XCircle size={18} /> Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
