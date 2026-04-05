import GenericListPage from '../../../components/common/GenericListPage'
import { ownerApi } from '../../../api'

export default function OwnerListPage() {
  return (
    <GenericListPage
      title="Owners" subtitle="Manage pet owners"
      addPath="/owners/add"
      fetchFn={async (p) => {
        const res = await ownerApi.getAll(p)
        const dataList = res.data?.results || res.data?.data || []
        dataList.forEach(r => {
          r._viewPath = `/owners/${r.id}`
          r._editPath = `/owners/${r.id}/edit`
          r._deleteName = r.full_name
        })
        return res
      }}
      deleteFn={ownerApi.delete}
      searchPlaceholder="Search owners by name, email, phone..."
      columns={[
        { 
          key: 'photo', 
          label: 'Photo', 
          render: r => (
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
              {r.photo ? (
                <img src={r.photo} alt={r.full_name} className="w-full h-full object-cover" />
              ) : (
                <User size={18} className="text-gray-400" />
              )}
            </div>
          ) 
        },
        { key: 'full_name', label: 'Name', render: r => <span className="font-medium text-gray-900">{r.full_name}</span> },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'city', label: 'City' },
        { key: 'pet_count', label: 'Pets', render: r => <span className="font-semibold text-primary-600">{r.pet_count}</span> },
      ]}
    />
  )
}
