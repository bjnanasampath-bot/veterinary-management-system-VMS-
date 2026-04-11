import { useSelector } from 'react-redux'
import { PawPrint } from 'lucide-react'
import GenericListPage from '../../../components/common/GenericListPage'
import { petApi } from '../../../api'

export default function PetListPage() {
  const { user } = useSelector(s => s.auth)
  const role = user?.role

  return (
    <GenericListPage
      title="Pets" subtitle="Manage all registered pets"
      addPath="/pets/add"
      showAdd={role !== 'admin'}
      fetchFn={async (p) => {
        const res = await petApi.getAll(p)
        const dataList = res.data?.results || res.data?.data || []
        dataList.forEach(r => {
          r._viewPath = `/pets/${r.id}`
          r._editPath = `/pets/${r.id}/edit`
          r._deleteName = r.name
        })
        return res
      }}
      deleteFn={petApi.delete}
      searchPlaceholder="Search pets by name, breed..."
      columns={[
        { 
          key: 'photo', 
          label: 'Photo', 
          render: r => (
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
              {r.photo ? (
                <img src={r.photo} alt={r.name} className="w-full h-full object-cover" />
              ) : (
                <PawPrint size={18} className="text-gray-400" />
              )}
            </div>
          ) 
        },
        { key: 'name', label: 'Name', render: r => <span className="font-medium text-gray-900">{r.name}</span> },
        { key: 'species', label: 'Species', render: r => <span className="capitalize">{r.species}</span> },
        { key: 'breed', label: 'Breed', render: r => r.breed || '—' },
        { key: 'gender', label: 'Gender', render: r => <span className="capitalize">{r.gender}</span> },
        { key: 'age', label: 'Age' },
        { key: 'owner_name', label: 'Owner' },
      ]}
      mapRowToActions={true}
    />
  )
}
