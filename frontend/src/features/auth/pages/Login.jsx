import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { login } from '../authSlice'
import {
  PawPrint, Mail, Lock, Eye, EyeOff, RefreshCw,
  ShieldCheck, UserCog, Stethoscope, User
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function Login() {
  const dispatch = useDispatch()
  const [activeRole, setActiveRole] = useState('admin') // 'admin' | 'doctor' | 'client'
  const [showPassword, setShowPassword] = useState(false)
  const { loading } = useSelector(s => s.auth)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  // --- CAPTCHA Logic ---
  const generateCaptcha = useCallback(() => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  }, [])
  const [captchaText, setCaptchaText] = useState(() => generateCaptcha())
  const [captchaInput, setCaptchaInput] = useState('')
  const refreshCaptcha = () => { setCaptchaText(generateCaptcha()); setCaptchaInput('') }

  const handleRoleSwitch = (role) => {
    setActiveRole(role)
    reset()
    refreshCaptcha()
    setShowPassword(false)
  }

  const onSubmit = (data) => {
    if (captchaInput.trim() !== captchaText) {
      toast.error('CAPTCHA does not match. Please try again.')
      refreshCaptcha()
      return
    }
    dispatch(login(data))
  }

  const theme = {
    admin: {
      gradient: 'from-indigo-600 to-violet-700',
      activeBg: 'bg-white text-indigo-600',
      icon: <ShieldCheck size={40} className="text-indigo-600" />,
      iconBg: 'bg-indigo-50',
      label: 'Administrator Portal',
      subtitle: 'Full system access — manage doctors, clients, billing & reports.',
      placeholder: 'admin@vetcare.com',
      btnLabel: 'Enter Dashboard',
    },
    doctor: {
      gradient: 'from-emerald-600 to-teal-700',
      activeBg: 'bg-white text-emerald-600',
      icon: <Stethoscope size={40} className="text-emerald-600" />,
      iconBg: 'bg-emerald-50',
      label: 'Doctor Portal',
      subtitle: 'View your schedule, manage treatments and patient records.',
      placeholder: 'doctor@vetcare.com',
      btnLabel: 'Enter Portal',
    },
    client: {
      gradient: 'from-sky-500 to-blue-600',
      activeBg: 'bg-white text-sky-600',
      icon: <User size={40} className="text-sky-600" />,
      iconBg: 'bg-sky-50',
      label: 'Client Login',
      subtitle: 'View your pets, appointments, vaccinations and billing details.',
      placeholder: 'yourname@email.com',
      btnLabel: 'Login to My Account',
    },
  }

  const t = theme[activeRole]

  return (
    <div className="w-full max-w-5xl px-4 flex flex-col items-center">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-white rounded-2xl shadow-lg">
          <PawPrint size={32} className="text-primary-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            VetCare <span className="text-primary-600">Pro</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium">Next-Gen Veterinary Management</p>
        </div>
      </div>

      <div className="w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-gray-100">

        {/* Left Side: Gradient Info Panel */}
        <div className={`hidden md:flex md:w-5/12 p-12 flex-col justify-between relative overflow-hidden transition-all duration-700 bg-gradient-to-br ${t.gradient}`}>
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute bottom-[-5%] left-[-5%] w-48 h-48 bg-black/10 rounded-full blur-2xl" />

          <div className="relative z-10">
            <h2 className="text-white text-4xl font-bold leading-tight mb-4">
              {activeRole === 'admin' && 'Welcome back, Administrator'}
              {activeRole === 'doctor' && 'Welcome back, Doctor'}
              {activeRole === 'client' && 'Welcome, Pet Parent!'}
            </h2>
            <div className="w-16 h-1.5 bg-white/40 rounded-full mb-8" />
            <p className="text-white/80 text-lg leading-relaxed">{t.subtitle}</p>
          </div>

          <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <p className="text-white/90 italic">
              "Providing the best care for our furry friends, one paw at a time."
            </p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-7/12 p-8 md:p-12 bg-white flex flex-col">

          {/* Role Switcher — 3 tabs */}
          <div className="flex p-1.5 bg-gray-100 rounded-2xl mb-10 w-full">
            {[
              { role: 'admin', icon: <UserCog size={16} />, label: 'Admin' },
              { role: 'doctor', icon: <Stethoscope size={16} />, label: 'Doctor' },
              { role: 'client', icon: <User size={16} />, label: 'Client' },
            ].map(({ role, icon, label }) => (
              <button
                key={role}
                onClick={() => handleRoleSwitch(role)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeRole === role
                    ? `${theme[role].activeBg} shadow-md`
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>

          {/* Role heading */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-2">
              <div className={`p-3 rounded-2xl ${t.iconBg}`}>{t.icon}</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{t.label}</h3>
                <p className="text-gray-500 text-sm">Please enter your credentials to continue</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex-1">
            <div className="space-y-4">
              {/* Email */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    {...register('email', { required: 'Email is required' })}
                    type="email"
                    placeholder={t.placeholder}
                    className={`w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 focus:bg-white focus:border-primary-500 focus:outline-none transition-all duration-300 ${errors.email ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1.5 ml-2">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="group">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">Password</label>
                  <Link to="/forgot-password" className="text-xs text-primary-600 font-bold hover:text-primary-700 transition-colors">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    {...register('password', { required: 'Password is required' })}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-3.5 pl-12 pr-12 focus:bg-white focus:border-primary-500 focus:outline-none transition-all duration-300 ${errors.password ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1.5 ml-2">{errors.password.message}</p>}
              </div>

              {/* CAPTCHA */}
              <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-100 focus-within:border-primary-500 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-gray-700">Security Verification</label>
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-primary-600 transition-colors"
                  >
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    Refresh
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className="h-12 flex items-center justify-center rounded-xl font-mono text-xl font-bold select-none tracking-[0.4em] shadow-inner"
                    style={{
                      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                      color: '#475569',
                      border: '2px solid #e2e8f0',
                      textDecoration: 'line-through double #cbd5e1',
                    }}
                  >
                    {captchaText}
                  </div>
                  <input
                    type="text"
                    value={captchaInput}
                    onChange={e => setCaptchaInput(e.target.value)}
                    className="h-12 w-full bg-white border-2 border-gray-200 rounded-xl px-4 focus:border-primary-500 focus:outline-none transition-all text-center font-bold text-lg"
                    placeholder="Code"
                    maxLength={6}
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl text-white font-bold text-lg transition-all duration-300 shadow-xl hover:scale-[1.02] flex items-center justify-center gap-3 bg-gradient-to-r ${t.gradient}`}
            >
              {loading ? (
                <>
                  <RefreshCw size={20} className="animate-spin" />
                  Authenticating...
                </>
              ) : t.btnLabel}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
            {activeRole === 'client' ? (
              <span>
                New to VetCare?{' '}
                <Link to="/register" className="text-primary-600 font-bold hover:underline">
                  Create an Account
                </Link>
              </span>
            ) : (
              <span>Powered by VetCare Technology &nbsp;•&nbsp; Staff Access Only</span>
            )}
          </div>
        </div>
      </div>

      {/* Decorative Blur Elements */}
      <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary-100 rounded-full blur-[120px] opacity-50 pointer-events-none" />
      <div className="fixed bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[120px] opacity-50 pointer-events-none" />
    </div>
  )
}
