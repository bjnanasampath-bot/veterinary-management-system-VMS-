import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { settingsApi, authApi } from '../../../api'
import { User, Shield, Building, Percent, Globe, Save, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { user } = useSelector(s => s.auth)
  const [activeTab, setActiveTab] = useState('account')
  const [settings, setSettings] = useState([])
  const [profileData, setProfileData] = useState({ first_name: user?.first_name || '', last_name: user?.last_name || '', phone: user?.phone || '' })
  const [passData, setPassData] = useState({ old_password: '', new_password: '', confirm_password: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user?.role === 'admin') {
      settingsApi.getAll().then(r => setSettings(r.data?.results || r.data?.data || r.data || []))
    }
  }, [user])

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authApi.updateProfile(profileData)
      toast.success('Profile updated!')
    } catch { toast.error('Failed to update profile') }
    finally { setLoading(false) }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (passData.new_password !== passData.confirm_password) return toast.error('Passwords do not match')
    setLoading(true)
    try {
      await authApi.changePassword(passData)
      toast.success('Password changed successfully!')
      setPassData({ old_password: '', new_password: '', confirm_password: '' })
    } catch (err) { toast.error(err.response?.data?.message || 'Password change failed') }
    finally { setLoading(false) }
  }

  const handleUpdateSystemSetting = async (key, value) => {
    try {
      await settingsApi.update(key, { value })
      toast.success(`Setting '${key}' updated`)
      // Refresh settings
      const r = await settingsApi.getAll()
      setSettings(r.data?.results || r.data?.data || r.data || [])
    } catch { toast.error('Failed to update system setting') }
  }

  const tabs = [
    { id: 'account', label: 'My Account', icon: User },
    ...(user?.role === 'admin' ? [{ id: 'system', label: 'Clinic Settings', icon: Building }] : []),
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your account and clinic preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-64 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id 
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' 
                  : 'text-gray-600 hover:bg-white hover:shadow-sm'
              }`}
            >
              <tab.icon size={18} />
              <span className="font-medium text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {activeTab === 'account' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Profile Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="font-bold text-gray-900">Personal Information</h3>
                  <p className="text-xs text-gray-500 mt-1">Update your name and contact details</p>
                </div>
                <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase ml-1">First Name</label>
                      <input 
                        value={profileData.first_name} 
                        onChange={e => setProfileData({...profileData, first_name: e.target.value})}
                        className="input-field" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase ml-1">Last Name</label>
                      <input 
                        value={profileData.last_name} 
                        onChange={e => setProfileData({...profileData, last_name: e.target.value})}
                        className="input-field" 
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Phone Number</label>
                    <input 
                      value={profileData.phone} 
                      onChange={e => setProfileData({...profileData, phone: e.target.value})}
                      className="input-field" 
                    />
                  </div>
                  <button disabled={loading} className="btn-primary w-fit px-8 py-2.5 flex items-center gap-2">
                    {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    Save Changes
                  </button>
                </form>
              </div>

              {/* Password Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                  <Shield size={18} className="text-primary-600" />
                  <div>
                    <h3 className="font-bold text-gray-900">Security</h3>
                    <p className="text-xs text-gray-500">Change your account password</p>
                  </div>
                </div>
                <form onSubmit={handleChangePassword} className="p-6 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Current Password</label>
                    <input 
                      type="password" 
                      value={passData.old_password} 
                      onChange={e => setPassData({...passData, old_password: e.target.value})}
                      className="input-field" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase ml-1">New Password</label>
                      <input 
                        type="password" 
                        value={passData.new_password} 
                        onChange={e => setPassData({...passData, new_password: e.target.value})}
                        className="input-field" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase ml-1">Confirm New Password</label>
                      <input 
                        type="password" 
                        value={passData.confirm_password} 
                        onChange={e => setPassData({...passData, confirm_password: e.target.value})}
                        className="input-field" 
                      />
                    </div>
                  </div>
                  <button disabled={loading} className="btn-primary w-fit px-8 py-2.5">
                    {loading ? 'Processing...' : 'Change Password'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'system' && user?.role === 'admin' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="font-bold text-gray-900">System Preferences</h3>
                        <p className="text-xs text-gray-500">Configure global settings for the entire clinic</p>
                    </div>
                    <div className="p-6 divide-y divide-gray-100">
                        {settings.map(s => (
                            <div key={s.key} className="py-6 first:pt-0 last:pb-0">
                                <div className="flex items-start justify-between gap-10">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            {s.key === 'clinic_name' && <Building size={16} className="text-gray-400" />}
                                            {s.key === 'tax_percentage' && <Percent size={16} className="text-gray-400" />}
                                            {s.key === 'currency' && <Globe size={16} className="text-gray-400" />}
                                            <h4 className="font-bold text-gray-900 capitalize italic">{s.key.replace('_', ' ')}</h4>
                                        </div>
                                        <p className="text-sm text-gray-500">{s.description}</p>
                                    </div>
                                    <div className="w-64 flex gap-2">
                                        <input 
                                            defaultValue={s.value}
                                            onBlur={(e) => {
                                                if (e.target.value !== s.value) {
                                                    handleUpdateSystemSetting(s.key, e.target.value)
                                                }
                                            }}
                                            className="input-field text-sm" 
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
