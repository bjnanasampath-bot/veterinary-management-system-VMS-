import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function FormPage({ title, subtitle, backPath, onSubmit, loading, children }) {
  const navigate = useNavigate()
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(backPath)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
      <div className="card">
        <form onSubmit={onSubmit} className="space-y-5">
          {children}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button type="submit" disabled={loading} className="btn-primary px-6 py-2.5">
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={() => navigate(backPath)} className="btn-secondary px-6 py-2.5">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function FormField({ label, error, required, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}
