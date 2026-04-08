import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { PawPrint, Eye, EyeOff, Lock, Phone, RefreshCw } from 'lucide-react'
import { authApi } from '../../../api'
import toast from 'react-hot-toast'

import GoogleAuthButton from '../components/GoogleAuthButton'

export default function Register() {
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm()

  // --- CAPTCHA ---
  const generateCaptcha = useCallback(() => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  }, [])
  const [captchaText, setCaptchaText] = useState(() => generateCaptcha())
  const [captchaInput, setCaptchaInput] = useState('')
  const refreshCaptcha = () => { setCaptchaText(generateCaptcha()); setCaptchaInput('') }

  const handleGoogleSuccess = (data) => {
    if (data.is_new) {
      setValue('first_name', data.first_name)
      setValue('last_name', data.last_name)
      setValue('email', data.email)
      toast.info('Details filled from Google. Please choose a role and password.')
    }
  }

  const onSubmit = async (data) => {
    if (captchaInput.trim() !== captchaText) {
      toast.error('CAPTCHA does not match. Please try again.')
      refreshCaptcha()
      return
    }
    try {
      await authApi.register(data)
      toast.success('Account created! Please login.')
      navigate('/login')
    } catch (err) {
      if (!err.response) {
        toast.error('Network error. Please check your connection.')
      }
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center mb-3">
            <PawPrint size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 text-sm">VetCare Management System</p>
        </div>

        <div className="mb-6 pb-6 border-b border-gray-100">
          <GoogleAuthButton onSuccess={handleGoogleSuccess} text="signup_with" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input {...register('first_name', { required: true })} className="input-field" placeholder="John" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input {...register('last_name', { required: true })} className="input-field" placeholder="Doe" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input {...register('email', {
                required: 'Email is required',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address (e.g. name@gmail.com)' }
              })} type="email" className="input-field" placeholder="john@vetcare.com" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
            <input type="hidden" {...register('role')} value="client" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                {...register('phone', {
                  required: 'Mobile number is required',
                  pattern: { value: /^[0-9]{10}$/, message: 'Enter a valid 10-digit mobile number' }
                })}
                type="tel"
                className="input-field pl-9"
                placeholder="9876543210"
                maxLength={10}
              />
            </div>
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                {...register('password', { required: true, minLength: 8 })}
                type={showPass ? 'text' : 'password'}
                className="input-field pl-9 pr-10"
                placeholder="Min 8 characters"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                {...register('confirm_password', { required: true, validate: v => v === watch('password') || 'Passwords do not match' })}
                type={showConfirm ? 'text' : 'password'}
                className="input-field pl-9 pr-10"
                placeholder="Repeat password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password.message}</p>}
          </div>
          {/* CAPTCHA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Security CAPTCHA <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="flex-1 px-4 py-2 rounded-lg text-center font-mono text-lg font-bold tracking-[0.35em] select-none"
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
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-2.5">
            {isSubmitting ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account? <Link to="/login" className="text-primary-600 font-medium hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  )
}
