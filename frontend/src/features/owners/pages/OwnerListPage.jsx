import GenericListPage from '../../../components/common/GenericListPage'
import { ownerApi } from '../../../api'

export default function OwnerListPage() {
  return (
    <GenericListPage
      title="Owners" subtitle="Manage pet owners"
      addPath="/owners/add"
      fetchFn={ownerApi.getAll}
      deleteFn={ownerApi.delete}
      searchPlaceholder="Search owners by name, email, phone..."
      columns={[
        { key: 'full_name', label: 'Name', render: r => <span className="font-medium">{r.full_name}</span> },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'city', label: 'City' },
        { key: 'pet_count', label: 'Pets', render: r => <span className="font-semibold text-primary-600">{r.pet_count}</span> },
      ]}
    />
  )
}
