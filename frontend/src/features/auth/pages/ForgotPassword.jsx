import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { PawPrint, Mail, ArrowLeft, Send } from 'lucide-react'
import { authApi } from '../../../api'
import toast from 'react-hot-toast'

export default function ForgotPassword() {
  const [emailSent, setEmailSent] = useState(false)
  const [sentEmail, setSentEmail] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    try {
      await authApi.forgotPassword(data.email)
      setSentEmail(data.email)
      setEmailSent(true)
      toast.success('Security code sent! Check your console (dev mode).')
    } catch (err) {
      if (!err.response) toast.error('Network error. Please check your connection.')
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center mb-3">
            <PawPrint size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Forgot Password</h1>
          <p className="text-gray-500 text-sm mt-1 text-center">
            Enter your registered email to receive a security code
          </p>
        </div>

        {!emailSent ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' }
                  })}
                  type="email"
                  placeholder="john@vetcare.com"
                  className="input-field pl-9"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-2.5 flex items-center justify-center gap-2">
              <Send size={16} />
              {isSubmitting ? 'Sending...' : 'Send Security Code'}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Send size={28} className="text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Code Sent!</p>
              <p className="text-sm text-gray-500 mt-1">
                A 6-digit security code was sent to<br />
                <span className="font-medium text-gray-700">{sentEmail}</span>
              </p>
              <p className="text-xs text-amber-600 mt-2 bg-amber-50 p-2 rounded-lg">
                📋 Development mode: Check the Django server console for the OTP code.
              </p>
            </div>
            <button
              onClick={() => navigate('/reset-password', { state: { email: sentEmail } })}
              className="btn-primary w-full py-2.5"
            >
              Enter Security Code
            </button>
            <button
              onClick={() => { setEmailSent(false); setSentEmail('') }}
              className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
            >
              Try a different email
            </button>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <Link to="/login" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 transition-colors">
            <ArrowLeft size={14} />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
