import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, PawPrint, Users, UserCog, CalendarDays,
  Syringe, Receipt, BarChart2, X, Stethoscope,
  Pill, Activity, Scissors, FileText, ClipboardList, Settings
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'doctor', 'client'] },
  { to: '/appointments', icon: CalendarDays, label: 'Appointments', roles: ['admin', 'doctor', 'client'] },
  { to: '/pets', icon: PawPrint, label: 'Pets', roles: ['admin', 'doctor', 'client'] },
  { to: '/owners', icon: Users, label: 'Owners', roles: ['admin'] },
  { to: '/doctors', icon: Stethoscope, label: 'Doctors', roles: ['admin'] },
  { to: '/medical-services', icon: ClipboardList, label: 'Medical Services', roles: ['admin', 'doctor'] },
  { to: '/prescriptions', icon: FileText, label: 'Prescriptions', roles: ['admin', 'doctor'] },
  { to: '/pharmacy', icon: Pill, label: 'Pharmacy', roles: ['admin', 'doctor'] },
  { to: '/billing', icon: Receipt, label: 'Billing', roles: ['admin'] },
  { to: '/reports', icon: BarChart2, label: 'Reports', roles: ['admin'] },
  { to: '/settings', icon: Settings, label: 'Settings', roles: ['admin', 'doctor', 'client'] },
]

export default function Sidebar({ open, onClose }) {
  const { user } = useSelector(s => s.auth)
  const siteSettings = useSelector(s => s.settings.data)
  const filteredNavItems = navItems.filter(item => item.roles.includes(user.role))

  return (
    <>
      {/* Overlay mobile */}
      {open && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={onClose} />}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800
        transform transition-transform duration-200 ease-in-out flex flex-col
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <PawPrint size={18} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-lg">{siteSettings.app_logo_name || 'VetCare'}</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {filteredNavItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400 text-center">
          {siteSettings.clinic_name || 'VetCare'} • MCA Project
        </div>
      </aside>
    </>
  )
}
