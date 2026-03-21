// front/src/components/main/Notifications.jsx
import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../utils/api'
import Modal, { useModal } from '.././Modal'
import { getImageUrl } from '../../utils/imageUrls'
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Clock,
  Heart,
  MessageCircle,
  UserPlus,
  UserCheck,
  AtSign,
  Gift,
  Settings,
  X
} from 'lucide-react'

const Notifications = ({ searchQuery, onSearchFocus, onSearchBlur }) => {
  const { user } = useAuth()
  const { modal, setModal, confirm } = useModal()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadNotifications()
    loadUnreadCount()
  }, [filter])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const response = await api.get(
        `/notifications?unread_only=${filter === 'unread'}`
      )
      if (response.data.success) {
        setNotifications(response.data.notifications)
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
      setModal({
        show: true,
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de charger les notifications'
      })
    } finally {
      setLoading(false)
    }
  }

  const loadUnreadCount = async () => {
    try {
      const response = await api.get('/notifications/unread-count')
      if (response.data.success) {
        setUnreadCount(response.data.count)
      }
    } catch (error) {
      console.error('Error loading unread count:', error)
    }
  }

  const markAsRead = async notificationId => {
    try {
      await api.post(`/notifications/${notificationId}/read`)
      setNotifications(
        notifications.map(n =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      )
      loadUnreadCount()
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const markAllAsRead = async () => {
    const confirmed = await confirm(
      'Marquer toutes les notifications comme lues ?',
      'Confirmer'
    )
    if (confirmed) {
      try {
        await api.post('/notifications/read-all')
        setNotifications(notifications.map(n => ({ ...n, is_read: true })))
        setUnreadCount(0)
        setModal({
          show: true,
          type: 'success',
          title: 'Succès',
          message: 'Toutes les notifications ont été marquées comme lues'
        })
      } catch (error) {
        console.error('Error marking all as read:', error)
      }
    }
  }

  const deleteNotification = async notificationId => {
    const confirmed = await confirm(
      'Supprimer cette notification ?',
      'Confirmer'
    )
    if (confirmed) {
      try {
        await api.delete(`/notifications/${notificationId}`)
        setNotifications(notifications.filter(n => n.id !== notificationId))
        loadUnreadCount()
      } catch (error) {
        console.error('Error deleting notification:', error)
      }
    }
  }

  const deleteAllNotifications = async () => {
    const confirmed = await confirm(
      'Supprimer toutes les notifications ? Cette action est irréversible.',
      'Confirmer la suppression'
    )
    if (confirmed) {
      try {
        await api.delete('/notifications/all')
        setNotifications([])
        setUnreadCount(0)
        setModal({
          show: true,
          type: 'success',
          title: 'Succès',
          message: 'Toutes les notifications ont été supprimées'
        })
      } catch (error) {
        console.error('Error deleting all notifications:', error)
      }
    }
  }

  const getNotificationIcon = type => {
    const icons = {
      like: <Heart className='text-red-500' size={20} />,
      comment: <MessageCircle className='text-blue-500' size={20} />,
      friend_request: <UserPlus className='text-purple-500' size={20} />,
      friend_accepted: <UserCheck className='text-green-500' size={20} />,
      mention: <AtSign className='text-yellow-500' size={20} />,
      welcome: <Gift className='text-pink-500' size={20} />,
      system: <Settings className='text-gray-500' size={20} />,
      profile_like: <Heart className='text-red-500' size={20} />,
      follow: <UserCheck className='text-purple-500' size={20} />
    }
    return icons[type] || <Bell className='text-gray-500' size={20} />
  }

  const getNotificationColor = type => {
    const colors = {
      like: 'bg-red-500/10 border-red-500/20',
      comment: 'bg-blue-500/10 border-blue-500/20',
      friend_request: 'bg-purple-500/10 border-purple-500/20',
      friend_accepted: 'bg-green-500/10 border-green-500/20',
      mention: 'bg-yellow-500/10 border-yellow-500/20',
      welcome: 'bg-pink-500/10 border-pink-500/20',
      system: 'bg-gray-500/10 border-gray-500/20',
      profile_like: 'bg-red-500/10 border-red-500/20',
      follow: 'bg-purple-500/10 border-purple-500/20'
    }
    return colors[type] || 'bg-gray-500/10 border-gray-500/20'
  }

  const getUserAvatar = userData => {
    const initials = `${userData?.prenom?.[0] || ''}${
      userData?.nom?.[0] || ''
    }`.toUpperCase()

    if (userData?.image) {
      return (
        <>
          <img
            src={getImageUrl(userData.image)}
            alt={userData.prenom}
            className='w-full h-full rounded-full object-cover'
            onError={e => {
              e.target.style.display = 'none'
              e.target.nextElementSibling.style.display = 'flex'
            }}
          />
          <div className='hidden w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm'>
            {initials || '?'}
          </div>
        </>
      )
    }
    return (
      <div className='w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm'>
        {initials || '?'}
      </div>
    )
  }

  return (
    <div className='section-content active'>
      <div className='notifications-container max-w-4xl mx-auto'>
        {/* Header */}
        <div className='section-header mb-6'>
          <div className='flex items-center gap-3'>
            <Bell size={28} className='text-white' />
            <h2>Notifications</h2>
            {unreadCount > 0 && (
              <span className='bg-red-500 text-white text-xs px-2 py-1 rounded-full'>
                {unreadCount}
              </span>
            )}
          </div>
          <div className='flex gap-2'>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className='btn-text flex items-center gap-2'
              >
                <CheckCheck size={16} />
                Tout lire
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={deleteAllNotifications}
                className='btn-text flex items-center gap-2 text-red-400 hover:text-red-300'
              >
                <Trash2 size={16} />
                Tout supprimer
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className='flex gap-2 mb-6'>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'all'
                ? 'bg-white text-black'
                : 'bg-[#141414] text-gray-400 hover:text-white border border-[#262626]'
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'unread'
                ? 'bg-white text-black'
                : 'bg-[#141414] text-gray-400 hover:text-white border border-[#262626]'
            }`}
          >
            Non lues
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'read'
                ? 'bg-white text-black'
                : 'bg-[#141414] text-gray-400 hover:text-white border border-[#262626]'
            }`}
          >
            Lues
          </button>
        </div>

        {/* Notifications List */}
        <div className='space-y-3'>
          {loading ? (
            <div className='text-center py-12 text-gray-400'>
              <Clock
                size={48}
                className='mx-auto mb-4 opacity-50 animate-pulse'
              />
              <p>Chargement des notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className='text-center py-12 bg-[#141414] border border-[#262626] rounded-xl'>
              <Bell
                size={48}
                className='mx-auto mb-4 text-gray-400 opacity-50'
              />
              <h3 className='text-lg font-semibold text-white mb-2'>
                Aucune notification
              </h3>
              <p className='text-gray-400'>
                {filter === 'unread'
                  ? "Vous n'avez aucune notification non lue"
                  : "Vous n'avez aucune notification pour le moment"}
              </p>
            </div>
          ) : (
            notifications.map(notification => (
              <div
                key={notification.id}
                className={`p-4 rounded-xl border transition-all ${
                  notification.is_read
                    ? 'bg-[#141414] border-[#262626]'
                    : `${getNotificationColor(
                        notification.type
                      )} border-opacity-50`
                }`}
              >
                <div className='flex items-start gap-4'>
                  {/* Icon */}
                  <div className='flex-shrink-0 w-10 h-10 rounded-full bg-[#1f1f1f] flex items-center justify-center'>
                    {getNotificationIcon(notification.type)}
                  </div>
                  {/* Content */}
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-start justify-between gap-2'>
                      <div>
                        <h4 className='text-white font-medium'>
                          {notification.title}
                        </h4>
                        <p className='text-gray-400 text-sm mt-1'>
                          {notification.message}
                        </p>
                        <p className='text-gray-500 text-xs mt-2'>
                          {notification.created_at}
                        </p>
                      </div>
                      <div className='flex items-center gap-2'>
                        {!notification.is_read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className='p-2 text-gray-400 hover:text-green-500 transition-colors'
                            title='Marquer comme lu'
                          >
                            <Check size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className='p-2 text-gray-400 hover:text-red-500 transition-colors'
                          title='Supprimer'
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    {/* Sender Info */}
                    {notification.sender && (
                      <div className='flex items-center gap-3 mt-3 pt-3 border-t border-[#262626]'>
                        <div className='w-8 h-8 rounded-full overflow-hidden flex-shrink-0 relative'>
                          {getUserAvatar(notification.sender)}
                        </div>
                        <span className='text-sm text-gray-300'>
                          {notification.sender.prenom} {notification.sender.nom}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Modal modal={modal} setModal={setModal} />
    </div>
  )
}

export default Notifications
