import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { login } from '../authSlice'
import { PawPrint, Mail, Lock, Eye, EyeOff, RefreshCw } from 'lucide-react'
import GoogleAuthButton from '../components/GoogleAuthButton'
import toast from 'react-hot-toast'

export default function Login() {
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState(false)
  const { loading } = useSelector(s => s.auth)
  const { register, handleSubmit, formState: { errors } } = useForm()

  // --- CAPTCHA ---
  const generateCaptcha = useCallback(() => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  }, [])
  const [captchaText, setCaptchaText] = useState(() => generateCaptcha())
  const [captchaInput, setCaptchaInput] = useState('')
  const refreshCaptcha = () => { setCaptchaText(generateCaptcha()); setCaptchaInput('') }

  const onSubmit = (data) => {
    if (captchaInput.trim() !== captchaText) {
      toast.error('CAPTCHA does not match. Please try again.')
      refreshCaptcha()
      return
    }
    dispatch(login(data))
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mb-4">
            <PawPrint size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">VetCare</h1>
          <p className="text-gray-500 text-sm mt-1">Veterinary Management System</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                {...register('email', { required: 'Email is required' })}
                type="email"
                placeholder="admin@vetcare.com"
                className="input-field pl-9"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <Link
                to="/forgot-password"
                className="text-xs text-primary-600 font-medium hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                {...register('password', { required: 'Password is required' })}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="input-field pl-9 pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {/* CAPTCHA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Security CAPTCHA <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="flex-1 px-4 py-2 rounded-lg text-center font-mono text-lg font-bold select-none"
                style={{
                  background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fdf4 100%)',
                  letterSpacing: '0.3em',
                  color: '#1e293b',
                  border: '1.5px dashed #94a3b8',
                  textDecoration: 'line-through underline',
                  textDecorationColor: '#94a3b8',
                }}
              >
                {captchaText}
              </div>
              <button
                type="button"
                onClick={refreshCaptcha}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 transition-colors"
                title="Refresh CAPTCHA"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
            <input
              type="text"
              value={captchaInput}
              onChange={e => setCaptchaInput(e.target.value)}
              className="input-field"
              placeholder="Enter the code above"
              maxLength={6}
              autoComplete="off"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 mt-2">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <GoogleAuthButton />
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 font-medium hover:underline">Register</Link>
        </p>
      </div>
    </div>
  )
}
