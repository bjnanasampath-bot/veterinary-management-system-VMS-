import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ownerApi } from '../../../api'
import { Loader } from '../../../components/common'
import { ArrowLeft, Pencil, Phone, Mail, MapPin } from 'lucide-react'

export default function OwnerDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [owner, setOwner] = useState(null)
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useSelector(s => s.auth)
  const canEdit = user?.role === 'doctor' || user?.role === 'receptionist'

  useEffect(() => {
    Promise.all([ownerApi.getById(id), ownerApi.getPets(id)])
      .then(([oRes, pRes]) => {
        setOwner(oRes.data?.data || oRes.data)
        setPets(pRes.data?.data || [])
      }).finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loader />
  if (!owner) return <div className="card text-center py-16 text-gray-400">Owner not found</div>

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/owners')} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"><ArrowLeft size={18} /></button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{owner.full_name}</h1>
          <p className="text-sm text-gray-500">{owner.city}, {owner.state}</p>
        </div>
        {canEdit && (
          <Link to={`/owners/${id}/edit`} className="btn-secondary flex items-center gap-2 text-sm"><Pencil size={15} /> Edit</Link>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card h-fit">
          <div className="relative w-full aspect-square mb-4 bg-primary-50 rounded-2xl overflow-hidden shadow-sm">
            {owner.photo ? (
              <img src={owner.photo} alt={owner.full_name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User size={64} className="text-primary-500" />
              </div>
            )}
          </div>
          <h2 className="font-semibold text-gray-800 mb-4">Contact Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-gray-700"><Phone size={15} className="text-gray-400" />{owner.phone}</div>
            {owner.alternate_phone && <div className="flex items-center gap-2 text-gray-700"><Phone size={15} className="text-gray-400" />{owner.alternate_phone}</div>}
            <div className="flex items-center gap-2 text-gray-700"><Mail size={15} className="text-gray-400" />{owner.email}</div>
            <div className="flex items-start gap-2 text-gray-700"><MapPin size={15} className="text-gray-400 mt-0.5" /><span>{owner.address}, {owner.city} - {owner.pincode}</span></div>
          </div>
          {owner.notes && <div className="mt-3 pt-3 border-t border-gray-100"><p className="text-xs text-gray-400 mb-1">Notes</p><p className="text-sm text-gray-600 italic">{owner.notes}</p></div>}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">Pets ({pets.length})</h2>
              <Link to="/pets/add" className="text-sm text-primary-600 hover:underline font-medium">+ Add Pet</Link>
            </div>
            {pets.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No pets registered</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pets.map(p => (
                  <Link key={p.id} to={`/pets/${p.id}`} className="flex items-center gap-3 border border-gray-100 rounded-xl p-3 hover:bg-gray-50 transition-all hover:border-primary-100">
                    <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100">
                      {p.photo ? <img src={p.photo} className="w-full h-full object-cover" /> : <div className="text-gray-300">🐾</div>}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{p.name}</p>
                      <p className="text-xs text-gray-400 capitalize">{p.species} • {p.breed || 'Mixed'} • {p.age}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

