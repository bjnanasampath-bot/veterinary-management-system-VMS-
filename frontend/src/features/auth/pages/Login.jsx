import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { login } from '../authSlice'
import { PawPrint, Mail, Lock, Eye, EyeOff, RefreshCw, ShieldCheck, UserCog, Stethoscope } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Login() {
  const dispatch = useDispatch()
  const [activeRole, setActiveRole] = useState('admin') // 'admin' or 'doctor'
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
    reset() // Clear form fields
    refreshCaptcha()
  }

  const onSubmit = (data) => {
    if (captchaInput.trim() !== captchaText) {
      toast.error('CAPTCHA does not match. Please try again.')
      refreshCaptcha()
      return
    }
    // We pass the data to the same login endpoint; 
    // the backend will determine if the user has the correct role.
    dispatch(login(data))
  }

  const theme = {
    admin: {
      primary: 'bg-indigo-600',
      text: 'text-indigo-600',
      light: 'bg-indigo-50',
      border: 'border-indigo-100',
      gradient: 'from-indigo-600 to-violet-700',
      icon: <ShieldCheck size={40} className="text-indigo-600" />,
      label: 'Administrator Portal'
    },
    doctor: {
      primary: 'bg-emerald-600',
      text: 'text-emerald-600',
      light: 'bg-emerald-50',
      border: 'border-emerald-100',
      gradient: 'from-emerald-600 to-teal-700',
      icon: <Stethoscope size={40} className="text-emerald-600" />,
      label: 'Doctor Portfolio'
    }
  }

  const currentTheme = theme[activeRole]

  return (
    <div className="w-full max-w-5xl px-4 flex flex-col items-center">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-white rounded-2xl shadow-lg">
          <PawPrint size={32} className="text-primary-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">VetCare <span className="text-primary-600">Pro</span></h1>
          <p className="text-gray-500 text-sm font-medium">Next-Gen Veterinary Management</p>
        </div>
      </div>

      <div className="w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-gray-100">
        
        {/* Left Side: Role Background/Info (Desktop) */}
        <div className={`hidden md:flex md:w-5/12 p-12 flex-col justify-between relative overflow-hidden transition-all duration-700 bg-gradient-to-br ${currentTheme.gradient}`}>
          {/* Abstract Decorations */}
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute bottom-[-5%] left-[-5%] w-48 h-48 bg-black/10 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <h2 className="text-white text-4xl font-bold leading-tight mb-4">
              Welcome back to your {activeRole === 'admin' ? 'Admin' : 'Medical'} Dashboard
            </h2>
            <div className="w-16 h-1.5 bg-white/40 rounded-full mb-8" />
            <p className="text-white/80 text-lg">
              Manage appointments, patient history, and clinic operations with ease and precision.
            </p>
          </div>

          <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <p className="text-white/90 italic">
              "Providing the best care for our furry friends, one paw at a time."
            </p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-7/12 p-8 md:p-12 bg-white flex flex-col">
          
          {/* Role Switcher Tabs */}
          <div className="flex p-1.5 bg-gray-100 rounded-2xl mb-10 w-full max-w-sm self-center md:self-start">
            <button
              onClick={() => handleRoleSwitch('admin')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeRole === 'admin' 
                ? 'bg-white text-indigo-600 shadow-md' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <UserCog size={18} />
              Admin
            </button>
            <button
              onClick={() => handleRoleSwitch('doctor')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeRole === 'doctor' 
                ? 'bg-white text-emerald-600 shadow-md' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Stethoscope size={18} />
              Doctor
            </button>
          </div>

          <div className="mb-8 overflow-hidden">
            <div className="flex items-center gap-4 mb-2 animate-in fade-in slide-in-from-left duration-500">
              <div className={`p-3 rounded-2xl ${currentTheme.light}`}>
                {currentTheme.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{currentTheme.label}</h3>
                <p className="text-gray-500 text-sm">Please enter your credentials to continue</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex-1">
            <div className="space-y-4">
              {/* Email Field */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-primary-600 lowercase capitalize">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    {...register('email', { required: 'Email is required' })}
                    type="email"
                    placeholder={activeRole === 'admin' ? 'admin@vetcare.com' : 'doctor@vetcare.com'}
                    className={`w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 focus:bg-white focus:border-primary-500 focus:outline-none transition-all duration-300 ${errors.email ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1.5 ml-2">{errors.email.message}</p>}
              </div>

              {/* Password Field */}
              <div className="group">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700 transition-colors group-focus-within:text-primary-600 lowercase capitalize">
                    Password
                  </label>
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
              <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-100 group focus-within:border-primary-500 transition-all duration-300">
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

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl text-white font-bold text-lg transition-all duration-300 shadow-xl hover:scale-[1.02] flex items-center justify-center gap-3 ${currentTheme.gradient}`}
            >
              {loading ? (
                <>
                  <RefreshCw size={20} className="animate-spin" />
                  Authenticating...
                </>
              ) : (
                `Enter ${activeRole === 'admin' ? 'Dashboard' : 'Portal'}`
              )}
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-sm text-gray-500">
            <span>Powered by VetCare Technology</span>
            <div className="w-1 h-1 bg-gray-300 rounded-full" />
            <Link to="/register" className="text-primary-600 font-bold hover:underline">Support</Link>
          </div>
        </div>
      </div>
      
      {/* Decorative Blur Elements */}
      <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary-100 rounded-full blur-[120px] opacity-50 pointer-events-none" />
      <div className="fixed bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[120px] opacity-50 pointer-events-none" />
    </div>
  )
}
