import { useDispatch, useSelector } from 'react-redux'
import { Menu, Bell, LogOut, User, Home, ArrowLeft } from 'lucide-react'
import { logout } from '../../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'

export default function Navbar({ onMenuClick }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(s => s.auth)

  const handleLogout = async () => {
    await dispatch(logout())
    navigate('/login')
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <button onClick={onMenuClick} className="lg:hidden text-gray-500 hover:text-gray-700">
        <Menu size={22} />
      </button>

      <div className="hidden lg:flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-100 shadow-sm" title="Go Back">
          <ArrowLeft size={18} />
        </button>
        <div>
          <p className="text-sm text-gray-500">Welcome back,</p>
          <p className="font-semibold text-gray-900">{user?.first_name} {user?.last_name}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <button onClick={() => navigate('/')} className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg" title="Home">
          <Home size={20} />
        </button>
        <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <User size={16} className="text-primary-600" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{user?.first_name}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="ml-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}
