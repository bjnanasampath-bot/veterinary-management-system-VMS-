import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { petApi } from '../../../api'
import { Loader } from '../../../components/common'
import { ArrowLeft, Pencil, PawPrint } from 'lucide-react'

export default function PetDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

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
        <Link to={`/pets/${id}/edit`} className="btn-secondary flex items-center gap-2 text-sm"><Pencil size={15} /> Edit</Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="card">
          <div className="flex items-center justify-center w-20 h-20 bg-primary-50 rounded-2xl mx-auto mb-4">
            <PawPrint size={36} className="text-primary-500" />
          </div>
          <div className="space-y-2 text-sm">
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
              <div className="space-y-2">
                {data.treatments?.slice(0, 4).map(t => (
                  <div key={t.id} className="py-1.5 border-b border-gray-50 last:border-0">
                    <div className="flex justify-between"><p className="text-sm font-medium">{t.treatment_name}</p><span className="text-xs text-gray-400">{t.treatment_date}</span></div>
                    <p className="text-xs text-gray-500 mt-0.5">{t.diagnosis}</p>
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
