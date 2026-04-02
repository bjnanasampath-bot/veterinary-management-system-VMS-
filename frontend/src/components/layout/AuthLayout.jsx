import { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function AuthLayout() {
  const { isAuthenticated } = useSelector(s => s.auth)
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <Outlet />
    </div>
  )
}
