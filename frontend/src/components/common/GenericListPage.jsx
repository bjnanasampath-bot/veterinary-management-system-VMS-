import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Search, Plus, Pencil, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import { Loader, EmptyState, Badge } from './index'
import toast from 'react-hot-toast'

export default function GenericListPage({
  title, subtitle, addPath, fetchFn, deleteFn,
  columns, searchPlaceholder = 'Search...',
  filters = [], mapRowToActions = true, extraActions
}) {
  const { user } = useSelector(s => s.auth)
  const role = user?.role

  // Role-based action rules:
  // admin    → View + Delete only (no Edit)
  // doctor/receptionist → View + Edit only (no Delete)
  // client   → View only
  const canEdit   = role === 'doctor' || role === 'receptionist'
  const canDelete = role === 'admin'

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ count: 0, total_pages: 1 })

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetchFn({ search, page })
      const d = res.data
      if (d?.results) {
        setItems(d.results)
        setPagination({ count: d.count, total_pages: d.total_pages })
      } else if (d?.data) {
        setItems(Array.isArray(d.data) ? d.data : [])
      }
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [search, page])

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete ${name}?`)) return
    try {
      await deleteFn(id)
      toast.success(`${name} deleted`)
      load()
    } catch { toast.error('Failed to delete') }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="flex gap-2">
          {extraActions}
          {addPath && (
            <Link to={addPath} className="btn-primary flex items-center gap-2">
              <Plus size={16} /> Add New
            </Link>
          )}
        </div>
      </div>

      <div className="card">
        <div className="flex gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder={searchPlaceholder}
              className="input-field pl-9"
            />
          </div>
        </div>

        {loading ? <Loader /> : items.length === 0 ? (
          <EmptyState icon="📭" title="No records found" description="Try adjusting your search or add a new record." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {columns.map(c => (
                      <th key={c.key} className="text-left py-3 px-2 text-gray-500 font-medium text-xs uppercase tracking-wide">
                        {c.label}
                      </th>
                    ))}
                    {mapRowToActions && <th className="text-right py-3 px-2 text-gray-500 font-medium text-xs uppercase">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      {columns.map(c => (
                        <td key={c.key} className="py-3 px-2 text-gray-700">
                          {c.render ? c.render(item) : item[c.key] ?? '—'}
                        </td>
                      ))}
                      {mapRowToActions && (
                        <td className="py-3 px-2">
                          <div className="flex items-center justify-end gap-1">
                            {item._viewPath && (
                              <Link to={item._viewPath} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded">
                                <Eye size={15} />
                              </Link>
                            )}
                            {canEdit && item._editPath && (
                              <Link to={item._editPath} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                                <Pencil size={15} />
                              </Link>
                            )}
                            {canDelete && item._deleteName && (
                              <button onClick={() => handleDelete(item.id, item._deleteName)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
                        </td>
                      )}

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination.total_pages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">Total: {pagination.count} records</p>
                <div className="flex gap-2">
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary px-3 py-1 disabled:opacity-40">
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-sm text-gray-600 px-3 py-1.5">Page {page} / {pagination.total_pages}</span>
                  <button disabled={page === pagination.total_pages} onClick={() => setPage(p => p + 1)} className="btn-secondary px-3 py-1 disabled:opacity-40">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
