import { useState, useEffect, useRef } from 'react'
import { Bell, Check, Trash } from 'lucide-react'
import { notificationApi } from '../../api'
import { Link } from 'react-router-dom'

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const dropdownRef = useRef(null)

  const fetchNotifications = async () => {
    try {
      const [listRes, countRes] = await Promise.all([
        notificationApi.getAll({ page_size: 5 }),
        notificationApi.getUnreadCount()
      ])
      setNotifications(listRes.data?.results || [])
      setUnreadCount(countRes.data?.unread_count || 0)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 60000) // Poll every 1 minute
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMarkAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id)
      fetchNotifications()
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead()
      fetchNotifications()
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-slate-800 rounded-lg transition-all"
        title="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-gray-100 dark:border-slate-800 z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-50 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400 dark:text-slate-500">
                <p className="text-sm italic">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={`p-4 border-b border-gray-50 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors ${!n.is_read ? 'bg-primary-50/30 dark:bg-primary-900/10' : ''}`}
                >
                  <div className="flex gap-3">
                    <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!n.is_read ? 'bg-primary-500' : 'bg-transparent'}`} />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                         <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{n.title}</p>
                         <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{n.created_at_human}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{n.message}</p>
                      <div className="flex items-center justify-between">
                        {n.link ? (
                          <Link 
                            to={n.link} 
                            onClick={() => {
                              handleMarkAsRead(n.id)
                              setIsOpen(false)
                            }}
                            className="text-[10px] font-bold text-primary-600 dark:text-primary-400 hover:underline"
                          >
                            View Details
                          </Link>
                        ) : <div />}
                        {!n.is_read && (
                          <button 
                            onClick={() => handleMarkAsRead(n.id)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded text-gray-400 hover:text-green-500"
                            title="Mark as read"
                          >
                            <Check size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 bg-gray-50 dark:bg-slate-800/50 text-center border-t border-gray-100 dark:border-slate-800">
             <button className="text-xs text-gray-500 dark:text-slate-400 font-medium hover:text-gray-700 dark:hover:text-gray-200">
               View All Notifications
             </button>
          </div>
        </div>
      )}
    </div>
  )
}
