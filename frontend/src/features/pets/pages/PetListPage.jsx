// PetListPage
import GenericListPage from '../../../components/common/GenericListPage'
import { petApi } from '../../../api'

export default function PetListPage() {
  return (
    <GenericListPage
      title="Pets" subtitle="Manage all registered pets"
      addPath="/pets/add"
      fetchFn={petApi.getAll}
      deleteFn={petApi.delete}
      searchPlaceholder="Search pets by name, breed..."
      columns={[
        { key: 'name', label: 'Name', render: r => <span className="font-medium">{r.name}</span> },
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
