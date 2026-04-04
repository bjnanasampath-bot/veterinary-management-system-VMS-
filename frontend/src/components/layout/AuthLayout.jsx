import { Outlet, Navigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Home } from 'lucide-react'

export default function AuthLayout() {
  const { isAuthenticated } = useSelector(s => s.auth)
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4 relative">
      <Link to="/" className="absolute top-6 left-6 md:top-8 md:left-8 bg-white text-gray-600 hover:text-primary-600 rounded-full shadow-sm hover:shadow transition-all flex items-center pr-4 pl-1 py-1 gap-2 border border-gray-100 group">
        <div className="bg-gray-100 group-hover:bg-primary-50 p-2 rounded-full transition-colors"><Home size={16} /></div>
        <span className="text-sm font-medium">Home</span>
      </Link>
      <Outlet />
    </div>
  )
}
