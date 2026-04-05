import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { PawPrint, Lock, Eye, EyeOff, ShieldCheck, ArrowLeft } from 'lucide-react'
import { authApi } from '../../../api'
import toast from 'react-hot-toast'

export default function ResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()
  const prefillEmail = location.state?.email || ''

  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { email: prefillEmail }
  })

  const onSubmit = async (data) => {
    try {
      await authApi.verifyOTP(data)
      toast.success('Password reset successfully! Please sign in.')
      navigate('/login')
    } catch (err) {
      if (!err.response) toast.error('Network error. Please check your connection.')
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center mb-3">
            <ShieldCheck size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-gray-500 text-sm mt-1 text-center">
            Enter the 6-digit code and your new password
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              {...register('email', { required: 'Email is required' })}
              type="email"
              placeholder="john@vetcare.com"
              className="input-field"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              6-Digit Security Code
            </label>
            <input
              {...register('otp', {
                required: 'Security code is required',
                pattern: { value: /^\d{6}$/, message: 'Must be a 6-digit number' }
              })}
              type="text"
              placeholder="••••••"
              className="input-field text-center text-2xl tracking-[0.5em] font-mono"
              maxLength={6}
              inputMode="numeric"
              autoComplete="one-time-code"
            />
            {errors.otp && <p className="text-red-500 text-xs mt-1">{errors.otp.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                {...register('new_password', { required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })}
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
            {errors.new_password && <p className="text-red-500 text-xs mt-1">{errors.new_password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                {...register('confirm_password', {
                  required: 'Please confirm your password',
                  validate: v => v === watch('new_password') || 'Passwords do not match'
                })}
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

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-2.5">
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <Link to="/forgot-password" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 transition-colors">
            <ArrowLeft size={14} />
            Back to Forgot Password
          </Link>
        </div>
      </div>
    </div>
  )
}
