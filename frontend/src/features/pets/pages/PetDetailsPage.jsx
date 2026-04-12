import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { petApi } from '../../../api'
import { Loader } from '../../../components/common'
import { ArrowLeft, Pencil, PawPrint } from 'lucide-react'

export default function PetDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useSelector(s => s.auth)
  const canEdit = user?.role === 'doctor'

  useEffect(() => {
    petApi.getMedicalHistory(id).then(r => setData(r.data?.data || r.data)).finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loader />
  if (!data) return <div className="card text-center py-16 text-gray-400">Pet not found</div>

  const pet = data.pet

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/pets')} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"><ArrowLeft size={18} /></button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{pet?.name}</h1>
          <p className="text-sm text-gray-500 capitalize">{pet?.species} • {pet?.breed || 'Unknown breed'} • {pet?.age}</p>
        </div>
        {canEdit && (
          <Link to={`/pets/${id}/edit`} className="btn-secondary flex items-center gap-2 text-sm"><Pencil size={15} /> Edit</Link>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="card">
          <div className="relative w-full aspect-square mb-4 bg-primary-50 rounded-2xl overflow-hidden shadow-sm">
            {pet.photo ? (
              <img src={pet.photo} alt={pet.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <PawPrint size={48} className="text-primary-500" />
              </div>
            )}
          </div>
          <div className="space-y-3 text-sm">
            {[['Owner', pet?.owner?.full_name], ['Gender', pet?.gender], ['DOB', pet?.date_of_birth], ['Weight', pet?.weight ? `${pet.weight} kg` : '—'], ['Color', pet?.color || '—'], ['Blood Group', pet?.blood_group], ['Microchip', pet?.microchip_id || '—'], ['Neutered', pet?.is_neutered ? 'Yes' : 'No']].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-gray-400">{k}</span>
                <span className="font-medium text-gray-800 capitalize">{v || '—'}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-5">
          {/* Vaccinations */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900">Vaccinations</h2>
              <Link to="/vaccinations/add" className="text-xs text-primary-600 hover:underline">+ Add</Link>
            </div>
            {data.vaccinations?.length === 0 ? <p className="text-gray-400 text-sm text-center py-4">No vaccinations recorded</p> : (
              <div className="space-y-2">
                {data.vaccinations?.slice(0, 5).map(v => (
                  <div key={v.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                    <div><p className="text-sm font-medium">{v.vaccine_name}</p><p className="text-xs text-gray-400">{v.vaccination_date}</p></div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${v.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{v.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Appointments */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900">Recent Appointments</h2>
              <Link to="/appointments/create" className="text-xs text-primary-600 hover:underline">+ Book</Link>
            </div>
            {data.appointments?.length === 0 ? <p className="text-gray-400 text-sm text-center py-4">No appointments</p> : (
              <div className="space-y-2">
                {data.appointments?.slice(0, 4).map(a => (
                  <div key={a.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                    <div><p className="text-sm font-medium capitalize">{a.appointment_type}</p><p className="text-xs text-gray-400">{a.appointment_date} at {a.appointment_time}</p></div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${a.status === 'completed' ? 'bg-gray-100 text-gray-600' : a.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>{a.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Treatments */}
          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-3">Treatments</h2>
            {data.treatments?.length === 0 ? <p className="text-gray-400 text-sm text-center py-4">No treatments recorded</p> : (
              <div className="space-y-3">
                {data.treatments?.slice(0, 4).map(t => (
                  <div key={t.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{t.treatment_name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">By {t.doctor_name || 'Doctor'}</p>
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 rounded-md bg-white border border-gray-200 text-gray-600">{t.treatment_date}</span>
                    </div>
                    {t.diagnosis && (
                      <p className="text-xs text-gray-700 bg-white p-2 rounded border border-gray-100 mb-1.5"><span className="font-semibold text-gray-600">Diagnosis:</span> {t.diagnosis}</p>
                    )}
                    {t.notes && (
                      <p className="text-xs text-gray-700 bg-white p-2 rounded border border-gray-100 mb-1.5"><span className="font-semibold text-gray-600">Notes:</span> {t.notes}</p>
                    )}
                    {t.medications && t.medications.length > 0 && (
                      <div className="text-xs text-gray-700 bg-white p-2 rounded border border-gray-100 flex gap-1 flex-wrap items-center">
                        <span className="font-semibold text-gray-600 border-r border-gray-200 pr-2 mr-1">Meds:</span>
                        {t.medications.map((m, i) => (
                           <span key={i} className="bg-primary-50 text-primary-700 px-1.5 py-0.5 rounded text-[10px]">{m.name || m}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
