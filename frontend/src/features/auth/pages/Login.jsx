import { useState, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { login } from '../authSlice'
import { settingsApi } from '../../../api'
import {
  PawPrint, Mail, Lock, Eye, EyeOff, RefreshCw,
  ShieldCheck, Stethoscope, ArrowRight
} from 'lucide-react'
import toast from 'react-hot-toast'

// ─── Shared CAPTCHA hook ───────────────────────────────────────────────────
function useCaptcha() {
  const generate = useCallback(() => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  }, [])
  const [text, setText] = useState(() => generate())
  const [input, setInput] = useState('')
  const refresh = () => { setText(generate()); setInput('') }
  return { text, input, setInput, refresh }
}

// ─── CAPTCHA UI ────────────────────────────────────────────────────────────
function CaptchaBlock({ text, input, setInput, refresh }) {
  return (
    <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-600">Security Code</span>
        <button type="button" onClick={refresh}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-primary-600 transition-colors">
          <RefreshCw size={12} /> Refresh
        </button>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 h-10 flex items-center justify-center rounded-lg font-mono text-base font-bold select-none tracking-widest"
          style={{
            background: 'linear-gradient(135deg,#f0f0ff,#f0fdf4)',
            border: '1.5px dashed #94a3b8',
            color: '#1e293b',
          }}>
          {text}
        </div>
        <input
          type="text" value={input} onChange={e => setInput(e.target.value)}
          className="h-10 w-28 bg-white border border-gray-200 rounded-lg px-3 text-center font-bold text-sm text-gray-900 focus:border-primary-500 focus:outline-none transition-all"
          placeholder="Enter code" maxLength={6} autoComplete="off"
        />
      </div>
    </div>
  )
}

// ─── LOGIN PANEL (reusable for Admin / Doctor) ────────────────────────────
function LoginPanel({ role }) {
  const dispatch = useDispatch()
  const { loading, error: authError } = useSelector(s => s.auth)
  const [showPass, setShowPass] = useState(false)
  const captcha = useCaptcha()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const isAdmin = role === 'admin'
  const accent = isAdmin
    ? { border: 'border-indigo-100', bar: 'from-indigo-500 to-violet-600', ring: 'focus:ring-indigo-400', btn: 'from-indigo-600 to-violet-700', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' }
    : { border: 'border-emerald-100', bar: 'from-emerald-500 to-teal-600', ring: 'focus:ring-emerald-400', btn: 'from-emerald-600 to-teal-700', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' }

  const onSubmit = (data) => {
    if (captcha.input.trim() !== captcha.text) {
      toast.error('CAPTCHA does not match. Try again.')
      captcha.refresh()
      return
    }
    dispatch(login(data))
  }

  return (
    <div className={`bg-white rounded-2xl shadow-xl border ${accent.border} p-7 flex flex-col`}>
      {/* Colour bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${accent.bar} rounded-full mb-6`} />

      {/* Heading */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 ${accent.iconBg} rounded-xl flex items-center justify-center`}>
          {isAdmin
            ? <ShieldCheck size={20} className={accent.iconColor} />
            : <Stethoscope size={20} className={accent.iconColor} />}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {isAdmin ? 'Administrator Login' : 'Doctor Login'}
          </h2>
          <p className="text-xs text-gray-500">
            {isAdmin ? 'Full system access portal' : 'Doctor schedule & patient portal'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 flex-1">
        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              {...register('email', { required: 'Email is required' })}
              type="email"
              placeholder={isAdmin ? 'admin@vetcare.com' : 'doctor@vetcare.com'}
              className={`w-full border rounded-xl py-2.5 pl-9 pr-3 text-sm text-gray-900 focus:outline-none focus:ring-2 ${accent.ring} focus:border-transparent transition-all ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-gray-600">Password</label>
            <Link to="/forgot-password" className="text-xs text-primary-600 hover:underline font-semibold">
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              {...register('password', { required: 'Password is required' })}
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              className={`w-full border rounded-xl py-2.5 pl-9 pr-9 text-sm text-gray-900 focus:outline-none focus:ring-2 ${accent.ring} focus:border-transparent transition-all ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
            />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        {/* CAPTCHA */}
        <CaptchaBlock {...captcha} />

        {authError && (
          <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-xl text-sm font-semibold text-center">
            {authError}
          </div>
        )}

        {/* Submit */}
        <button type="submit" disabled={loading}
          className={`mt-auto w-full py-3 bg-gradient-to-r ${accent.btn} text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg disabled:opacity-60`}>
          {loading
            ? <><RefreshCw size={16} className="animate-spin" /> Authenticating...</>
            : <>{isAdmin ? 'Enter Dashboard' : 'Enter Portal'} <ArrowRight size={15} /></>}
        </button>
      </form>
    </div>
  )
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────
export default function Login() {
  const [logoName, setLogoName] = useState('VetCare')

  useEffect(() => {
    settingsApi.getAll().then(res => {
      const data = res.data?.results || res.data?.data || res.data || []
      const logo = data.find(s => s.key === 'app_logo_name')?.value
      if (logo) setLogoName(logo)
    }).catch(() => {})
  }, [])

  return (
    <div className="w-full max-w-4xl px-4 flex flex-col items-center">

      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-white rounded-2xl shadow-lg">
          <PawPrint size={30} className="text-primary-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {logoName} <span className="text-primary-600">Pro</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium">Staff Login Portal — Next-Gen Veterinary Management</p>
        </div>
      </div>

      {/* Two Login Cards Side by Side */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        <LoginPanel role="admin" />

        {/* OR divider */}
        <div className="flex md:hidden items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-xs font-bold">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <LoginPanel role="doctor" />
      </div>

      {/* Footer */}
      <p className="mt-8 text-sm text-gray-400">
        Not a staff member?{' '}
        <Link to="/client-portal" className="text-primary-600 font-semibold hover:underline inline-flex items-center gap-1">
          Client Login / Register <ArrowRight size={13} />
        </Link>
      </p>

      {/* Decorative blurs */}
      <div className="fixed top-0 right-0 -z-10 w-[400px] h-[400px] bg-indigo-100 rounded-full blur-[100px] opacity-50 pointer-events-none" />
      <div className="fixed bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-emerald-50 rounded-full blur-[100px] opacity-50 pointer-events-none" />
    </div>
  )
}
