import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { appointmentApi, pharmacyApi } from '../../../api'
import { Loader } from '../../../components/common'
import { ArrowLeft, Calendar, Clock, User, Stethoscope, CheckCircle, XCircle, Edit2, Pill, CreditCard, DollarSign } from 'lucide-react'
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
  const [pharmacyItems, setPharmacyItems] = useState([])
  const [medicalRecord, setMedicalRecord] = useState({ 
    symptoms: '', diagnosis: '', prescription: '', notes: '',
    doctor_fee: 500, payment_mode: 'pending', selected_medicines: []
  })

  useEffect(() => {
    fetchAppointment()
    fetchPharmacyOptions()
  }, [id])

  const fetchPharmacyOptions = async () => {
    try {
      const res = await pharmacyApi.getAll()
      setPharmacyItems(res.data?.results || res.data?.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  const fetchAppointment = async () => {
    try {
      setLoading(true)
      const r = await appointmentApi.getById(id)
      const data = r.data?.data || r.data
      setAppt(data)
      setNewDate(data.appointment_date)
      setNewTime(data.appointment_time)
      setMedicalRecord({
        symptoms: data.symptoms || '',
        diagnosis: data.diagnosis || '',
        prescription: data.prescription || '',
        notes: data.notes || ''
      })
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
      await appointmentApi.patch(id, { 
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

  const handleMarkCompleted = async () => {
    try {
      await appointmentApi.patch(id, { 
        ...medicalRecord,
        status: 'completed'
      })
      toast.success('Examination completed! Bill generated automatically.')
      fetchAppointment()
    } catch {
      toast.error('Failed to complete examination')
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
              <div className="w-full bg-primary-50 p-6 rounded-2xl border border-primary-100 space-y-5 my-2 shadow-sm">
                <div className="flex items-center gap-2 border-b border-primary-100 pb-3">
                  <Stethoscope className="text-primary-600" size={24} />
                  <h3 className="font-bold text-lg text-primary-900">Medical Examination Form</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-full">
                    <label className="block text-xs font-bold text-primary-700 uppercase mb-1">Symptoms Identified</label>
                    <textarea value={medicalRecord.symptoms} onChange={e => setMedicalRecord({...medicalRecord, symptoms: e.target.value})} className="w-full rounded-xl border-primary-200 focus:ring-primary-500 min-h-[60px]" placeholder="What symptoms were observed?"></textarea>
                  </div>
                  <div className="col-span-full">
                    <label className="block text-xs font-bold text-primary-700 uppercase mb-1">Diagnosis</label>
                    <textarea value={medicalRecord.diagnosis} onChange={e => setMedicalRecord({...medicalRecord, diagnosis: e.target.value})} className="w-full rounded-xl border-primary-200 focus:ring-primary-500 min-h-[60px]" placeholder="What is the final diagnosis?"></textarea>
                  </div>
                  
                  {/* Pharmacy Selection */}
                  <div className="col-span-full bg-white p-4 rounded-xl border border-primary-100">
                    <label className="flex items-center gap-2 text-xs font-bold text-primary-700 uppercase mb-2">
                       <Pill size={16}/> Select Pharmacy Medicines
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {pharmacyItems.map(item => (
                        <label key={item.id} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer p-2 hover:bg-primary-50 rounded-lg">
                          <input type="checkbox" 
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            checked={medicalRecord.selected_medicines.includes(item.id)}
                            onChange={(e) => {
                              const selected = e.target.checked 
                                ? [...medicalRecord.selected_medicines, item.id]
                                : medicalRecord.selected_medicines.filter(id => id !== item.id);
                              setMedicalRecord({...medicalRecord, selected_medicines: selected});
                            }}
                          />
                          {item.name} <span className="text-gray-400 text-xs">(${item.unit_price})</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label className="block text-xs font-bold text-primary-700 uppercase mb-1">Additional Prescription Notes</label>
                    <textarea value={medicalRecord.prescription} onChange={e => setMedicalRecord({...medicalRecord, prescription: e.target.value})} className="w-full rounded-xl border-primary-200 focus:ring-primary-500 min-h-[60px]" placeholder="Additional manual treatments..."></textarea>
                  </div>
                  <div className="col-span-full">
                    <label className="block text-xs font-bold text-primary-700 uppercase mb-1">Internal Notes</label>
                    <textarea value={medicalRecord.notes} onChange={e => setMedicalRecord({...medicalRecord, notes: e.target.value})} className="w-full rounded-xl border-primary-200 focus:ring-primary-500 min-h-[60px]" placeholder="Any other internal notes..."></textarea>
                  </div>

                  {/* Billing configuration */}
                  <div className="col-span-1 bg-white p-4 rounded-xl border border-primary-100">
                    <label className="flex items-center gap-2 text-xs font-bold text-primary-700 uppercase mb-2">
                       <DollarSign size={16}/> Doctor Consultation Fee
                    </label>
                    <input type="number" min="0" value={medicalRecord.doctor_fee} onChange={e => setMedicalRecord({...medicalRecord, doctor_fee: e.target.value})} className="w-full rounded-xl border-primary-200 focus:ring-primary-500 py-2" />
                  </div>
                  
                  <div className="col-span-1 bg-white p-4 rounded-xl border border-primary-100">
                    <label className="flex items-center gap-2 text-xs font-bold text-primary-700 uppercase mb-2">
                       <CreditCard size={16}/> Payment Mode
                    </label>
                    <select value={medicalRecord.payment_mode} onChange={e => setMedicalRecord({...medicalRecord, payment_mode: e.target.value})} className="w-full rounded-xl border-primary-200 focus:ring-primary-500 py-2">
                      <option value="pending">Client will Pay Later (Pending)</option>
                      <option value="online">Paid Online (Instant)</option>
                      <option value="offline">Paid Cash / Offline (Instant)</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-primary-200 mt-4">
                  <button onClick={handleMarkCompleted} className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-xl hover:bg-emerald-700 transition shadow-md font-bold text-base w-full justify-center">
                    ✓ Save Exam & Complete (Generate Bill)
                  </button>
                </div>
              </div>
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
