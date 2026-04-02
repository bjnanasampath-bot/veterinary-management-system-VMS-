import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, PawPrint, Users, UserCog, CalendarDays,
  Syringe, Receipt, BarChart2, X, Stethoscope
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/appointments', icon: CalendarDays, label: 'Appointments' },
  { to: '/pets', icon: PawPrint, label: 'Pets' },
  { to: '/owners', icon: Users, label: 'Owners' },
  { to: '/doctors', icon: Stethoscope, label: 'Doctors' },
  { to: '/vaccinations', icon: Syringe, label: 'Vaccinations' },
  { to: '/billing', icon: Receipt, label: 'Billing' },
  { to: '/reports', icon: BarChart2, label: 'Reports' },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Overlay mobile */}
      {open && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={onClose} />}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200
        transform transition-transform duration-200 ease-in-out flex flex-col
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <PawPrint size={18} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">VetCare</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400 text-center">
          VetCare v1.0 • MCA Project
        </div>
      </aside>
    </>
  )
}
