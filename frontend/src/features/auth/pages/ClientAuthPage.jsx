import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login } from '../authSlice'
import { authApi } from '../../../api'
import {
  PawPrint, Mail, Lock, Eye, EyeOff, RefreshCw,
  Phone, User, LogIn, UserPlus, ArrowRight
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
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-sky-600 transition-colors">
          <RefreshCw size={12} /> Refresh
        </button>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 h-10 flex items-center justify-center rounded-lg font-mono text-base font-bold select-none tracking-widest"
          style={{
            background: 'linear-gradient(135deg,#e0f2fe,#f0fdf4)',
            border: '1.5px dashed #94a3b8',
            color: '#1e293b',
          }}>
          {text}
        </div>
        <input
          type="text" value={input} onChange={e => setInput(e.target.value)}
          className="h-10 w-28 bg-white border border-gray-200 rounded-lg px-3 text-center font-bold text-sm focus:border-sky-500 focus:outline-none transition-all"
          placeholder="Enter code" maxLength={6} autoComplete="off"
        />
      </div>
    </div>
  )
}

// ─── LOGIN PANEL ───────────────────────────────────────────────────────────
function LoginPanel() {
  const dispatch = useDispatch()
  const { loading } = useSelector(s => s.auth)
  const [showPass, setShowPass] = useState(false)
  const captcha = useCaptcha()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = (data) => {
    if (captcha.input.trim() !== captcha.text) {
      toast.error('CAPTCHA does not match. Try again.')
      captcha.refresh()
      return
    }
    dispatch(login(data))
  }

  return (
    <div className="flex flex-col h-full">
      {/* Heading */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
          <LogIn size={20} className="text-sky-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-xs text-gray-500">Login to your client account</p>
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
              type="email" placeholder="yourname@email.com"
              className={`w-full border rounded-xl py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              {...register('password', { required: 'Password is required' })}
              type={showPass ? 'text' : 'password'} placeholder="••••••••"
              className={`w-full border rounded-xl py-2.5 pl-9 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
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

        {/* Submit */}
        <button type="submit" disabled={loading}
          className="mt-auto w-full py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:from-sky-600 hover:to-blue-700 transition-all shadow-lg disabled:opacity-60">
          {loading ? <><RefreshCw size={16} className="animate-spin" /> Logging in...</> : <><LogIn size={16} /> Login to Account</>}
        </button>
      </form>
    </div>
  )
}

// ─── REGISTER PANEL ────────────────────────────────────────────────────────
function RegisterPanel() {
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const captcha = useCaptcha()
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async (data) => {
    if (captcha.input.trim() !== captcha.text) {
      toast.error('CAPTCHA does not match. Try again.')
      captcha.refresh()
      return
    }
    try {
      await authApi.register(data)
      toast.success('Account created! Please login.')
      navigate('/client-portal')
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.'
      toast.error(msg)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Heading */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
          <UserPlus size={20} className="text-emerald-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Create Account</h2>
          <p className="text-xs text-gray-500">New here? Join as a VetCare client</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 flex-1">
        {/* Name Row */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">First Name</label>
            <input {...register('first_name', { required: true })}
              className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
              placeholder="John" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Last Name</label>
            <input {...register('last_name', { required: true })}
              className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
              placeholder="Doe" />
          </div>
        </div>

        {/* Hidden role */}
        <input type="hidden" {...register('role')} value="client" />

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input {...register('email', {
              required: 'Email is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' }
            })} type="email"
              className={`w-full border rounded-xl py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
              placeholder="john@email.com" />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-0.5">{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Mobile Number</label>
          <div className="relative">
            <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input {...register('phone', {
              required: 'Mobile required',
              pattern: { value: /^[0-9]{10}$/, message: 'Enter 10-digit number' }
            })} type="tel" maxLength={10}
              className={`w-full border rounded-xl py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all ${errors.phone ? 'border-red-400' : 'border-gray-200'}`}
              placeholder="9876543210" />
          </div>
          {errors.phone && <p className="text-red-500 text-xs mt-0.5">{errors.phone.message}</p>}
        </div>

        {/* Password Row */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input {...register('password', { required: true, minLength: 8 })}
                type={showPass ? 'text' : 'password'}
                className="w-full border border-gray-200 rounded-xl py-2.5 pl-9 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                placeholder="Min 8 chars" />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Confirm</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input {...register('confirm_password', {
                required: true,
                validate: v => v === watch('password') || 'No match'
              })}
                type={showConfirm ? 'text' : 'password'}
                className={`w-full border rounded-xl py-2.5 pl-9 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all ${errors.confirm_password ? 'border-red-400' : 'border-gray-200'}`}
                placeholder="Repeat" />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {errors.confirm_password && <p className="text-red-500 text-xs mt-0.5">{errors.confirm_password.message}</p>}
          </div>
        </div>

        {/* CAPTCHA */}
        <CaptchaBlock {...captcha} />

        {/* Submit */}
        <button type="submit" disabled={isSubmitting}
          className="mt-auto w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg disabled:opacity-60">
          {isSubmitting ? <><RefreshCw size={16} className="animate-spin" /> Creating...</> : <><UserPlus size={16} /> Create Account</>}
        </button>
      </form>
    </div>
  )
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────
export default function ClientAuthPage() {
  return (
    <div className="w-full max-w-4xl px-4 flex flex-col items-center">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-white rounded-2xl shadow-lg">
          <PawPrint size={30} className="text-sky-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">VetCare <span className="text-sky-500">Client Portal</span></h1>
          <p className="text-gray-500 text-sm">Your pet care companion — login or create your account below</p>
        </div>
      </div>

      {/* Two Cards Side by Side */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ── LOGIN CARD ── */}
        <div className="bg-white rounded-2xl shadow-xl border border-sky-100 p-7 flex flex-col">
          <div className="h-1.5 w-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full mb-6" />
          <LoginPanel />
        </div>

        {/* ── DIVIDER (mobile: horizontal, desktop: vertical) ── */}
        <div className="hidden md:flex flex-col items-center justify-center absolute left-1/2 -translate-x-1/2 h-full pointer-events-none">
          <div className="h-full w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent" />
          <span className="absolute bg-gray-100 text-gray-400 text-xs font-bold px-2 py-1 rounded-full">OR</span>
        </div>
        <div className="flex md:hidden items-center gap-3 my-1">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-xs font-bold">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* ── REGISTER CARD ── */}
        <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-7 flex flex-col">
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full mb-6" />
          <RegisterPanel />
        </div>
      </div>

      {/* Staff Login Link */}
      <p className="mt-8 text-sm text-gray-400">
        Staff member?{' '}
        <a href="/login" className="text-sky-600 font-semibold hover:underline inline-flex items-center gap-1">
          Staff Login <ArrowRight size={13} />
        </a>
      </p>

      {/* Decorative blurs */}
      <div className="fixed top-0 right-0 -z-10 w-[400px] h-[400px] bg-sky-100 rounded-full blur-[100px] opacity-60 pointer-events-none" />
      <div className="fixed bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-emerald-50 rounded-full blur-[100px] opacity-60 pointer-events-none" />
    </div>
  )
}
