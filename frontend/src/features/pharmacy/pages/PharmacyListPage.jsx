import { useEffect, useState } from 'react'
import { Package, AlertTriangle, XOctagon, Clock, ShoppingCart } from 'lucide-react'
import GenericListPage from '../../../components/common/GenericListPage'
import { pharmacyApi } from '../../../api'

export default function PharmacyListPage() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    pharmacyApi.getAnalytics().then(res => setStats(res.data?.data || res.data))
  }, [])

  const topContent = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <div className="card p-4 flex items-center gap-4 border-l-4 border-blue-500">
        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
          <Package size={20} />
        </div>
        <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Items</p>
          <p className="text-xl font-black text-gray-900">{stats?.total_items || 0}</p>
        </div>
      </div>
      
      <div className="card p-4 flex items-center gap-4 border-l-4 border-amber-500">
        <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
          <AlertTriangle size={20} />
        </div>
        <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Low Stock</p>
          <p className="text-xl font-black text-gray-900">{stats?.low_stock || 0}</p>
        </div>
      </div>

      <div className="card p-4 flex items-center gap-4 border-l-4 border-red-500">
        <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
          <XOctagon size={20} />
        </div>
        <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Out of Stock</p>
          <p className="text-xl font-black text-gray-900">{stats?.out_of_stock || 0}</p>
        </div>
      </div>

      <div className="card p-4 flex items-center gap-4 border-l-4 border-rose-500">
        <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
          <Clock size={20} />
        </div>
        <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Expiring Soon</p>
          <p className="text-xl font-black text-gray-900">{stats?.expired_soon || 0}</p>
        </div>
      </div>

      <div className="card p-4 flex items-center gap-4 border-l-4 border-emerald-500">
        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
          <ShoppingCart size={20} />
        </div>
        <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Sold Today</p>
          <p className="text-xl font-black text-gray-900">{stats?.prescriptions_today || 0}</p>
        </div>
      </div>
    </div>
  )

  return (
    <GenericListPage
      title="Pharmacy Inventory" 
      subtitle="Manage medicines and medical supplies"
      addPath="/pharmacy/add"
      topContent={topContent}
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
      searchPlaceholder="Search inventory..."
      columns={[
        { key: 'name', label: 'Item Name', render: r => (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded shadow-sm bg-white overflow-hidden flex-shrink-0 flex items-center justify-center border border-gray-100">
              {r.image ? (
                <img src={r.image.startsWith('http') ? r.image : `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:8000'}${r.image}`} alt={r.name} className="w-full h-full object-cover" />
              ) : (
                <Package size={20} className="text-gray-300" />
              )}
            </div>
            <div>
              <p className="font-bold text-gray-900">{r.name}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-tighter">{r.category}</p>
            </div>
          </div>
        )},
        { key: 'stock_quantity', label: 'Stock', render: r => (
          <div className="flex flex-col">
            <span className={`font-black text-lg ${
              r.stock_quantity === 0 ? 'text-red-600' : 
              r.stock_quantity < 10 ? 'text-amber-600' : 'text-emerald-600'
            }`}>
              {r.stock_quantity}
            </span>
            <span className="text-[10px] text-gray-400">Units left</span>
          </div>
        )},
        { key: 'unit_price', label: 'Price', render: r => (
          <span className="font-semibold text-gray-700 text-base">₹{parseFloat(r.unit_price).toLocaleString()}</span>
        )},
        { key: 'expiry_date', label: 'Expiry', render: r => (
          <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
            new Date(r.expiry_date) < new Date() ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600'
          }`}>
            {r.expiry_date || 'N/A'}
          </span>
        )},
        { key: 'actions', label: 'Quick Restock', render: r => (
          <button 
            onClick={async (e) => {
              e.stopPropagation();
              if (window.confirm(`Restock ${r.name} by 50 units?`)) {
                try {
                  const newQty = parseInt(r.stock_quantity || 0) + 50;
                  await pharmacyApi.patch(r.id, { stock_quantity: newQty });
                  toast.success(`Restocked ${r.name}`);
                  window.location.reload();
                } catch (err) {
                  const msg = err.response?.data?.message || err.response?.data?.detail || "Failed to restock";
                  toast.error(msg);
                }
              }
            }}
            className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded hover:bg-blue-100 font-medium whitespace-nowrap"
          >
             + Refill 50
          </button>
        )}
      ]}
    />

  )
}
