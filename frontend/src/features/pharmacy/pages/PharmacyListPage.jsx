import GenericListPage from '../../../components/common/GenericListPage'
import { pharmacyApi } from '../../../api'

export default function PharmacyListPage() {
  return (
    <GenericListPage
      title="Pharmacy Inventory" subtitle="Manage medicines and supplies"
      addPath="/pharmacy/add"
      fetchFn={async (p) => {
        const res = await pharmacyApi.getAll(p)
        const dataList = res.data?.results || res.data?.data || []
        dataList.forEach(r => {
          r._editPath = `/pharmacy/${r.id}/edit`
          r._deleteName = r.name
        })
        return res
      }}
      deleteFn={pharmacyApi.delete}
      searchPlaceholder="Search items..."
      columns={[
        { key: 'name', label: 'Item Name', render: r => <span className="font-medium">{r.name}</span> },
        { key: 'category', label: 'Category', render: r => <span className="capitalize">{r.category}</span> },
        { key: 'stock_quantity', label: 'Stock', render: r => (
          <span className={`font-semibold ${r.stock_quantity > 10 ? 'text-green-600' : 'text-red-600'}`}>
            {r.stock_quantity}
          </span>
        )},
        { key: 'unit_price', label: 'Price', render: r => `₹${r.unit_price}` },
        { key: 'expiry_date', label: 'Expiry Date', render: r => r.expiry_date || '—' },
      ]}
    />
  )
}
