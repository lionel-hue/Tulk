// front/src/components/main/Notifications.jsx
import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../utils/api'
import Modal, { useModal } from '.././Modal'
import { getImageUrl } from '../../utils/imageUrls'
import Avatar from '../common/Avatar'
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
      like: 'bg-red-500/5 border-red-500/10 hover:border-red-500/20',
      comment: 'bg-blue-500/5 border-blue-500/10 hover:border-blue-500/20',
      friend_request: 'bg-purple-500/5 border-purple-500/10 hover:border-purple-500/20',
      friend_accepted: 'bg-green-500/5 border-green-500/10 hover:border-green-500/20',
      mention: 'bg-yellow-500/5 border-yellow-500/10 hover:border-yellow-500/20',
      welcome: 'bg-pink-500/5 border-pink-500/10 hover:border-pink-500/20',
      system: 'bg-white/5 border-white/10 hover:border-white/20',
      profile_like: 'bg-red-500/5 border-red-500/10 hover:border-red-500/20',
      follow: 'bg-purple-500/5 border-purple-500/10 hover:border-purple-500/20'
    }
    return colors[type] || 'bg-white/5 border-white/10 hover:border-white/20'
  }

  // Avatar logic replaced by Avatar component

  return (
    <div className='section-content active'>
      <div className='notifications-container max-w-4xl mx-auto'>
        {/* Header */}
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10'>
          <div className='flex items-center gap-4'>
            <div className='w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center border border-white/10 shadow-2xl'>
              <Bell size={28} className='text-white' />
            </div>
            <div>
              <h2 className='text-3xl md:text-5xl font-black text-white tracking-tighter'>Notifications</h2>
              {unreadCount > 0 && (
                <span className='inline-block mt-2 px-3 py-1 bg-red-500/20 text-red-500 border border-red-500/30 text-[10px] font-black uppercase tracking-widest rounded-full'>
                  {unreadCount} non lues
                </span>
              )}
            </div>
          </div>
          <div className='flex items-center gap-3 bg-white/5 p-2 rounded-[2rem] border border-white/10 backdrop-blur-md'>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className='px-6 py-3 rounded-[1.5rem] bg-white text-black font-black text-[10px] uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2'
              >
                <CheckCheck size={16} />
                <span>Tout lire</span>
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={deleteAllNotifications}
                className='px-6 py-3 rounded-[1.5rem] bg-red-500/10 text-red-500 font-black text-[10px] border border-red-500/20 uppercase tracking-widest hover:bg-red-500/20 transition-all flex items-center gap-2'
              >
                <Trash2 size={16} />
                <span>Vider</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className='bg-white/5 backdrop-blur-md p-1.5 rounded-[2.5rem] border border-white/5 flex gap-2 w-fit mb-10 overflow-x-auto no-scrollbar'>
          <button
            onClick={() => setFilter('all')}
            className={`px-8 py-3 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-700 whitespace-nowrap ${
              filter === 'all'
                ? 'bg-white text-black shadow-2xl scale-105'
                : 'text-gray-500 hover:text-white hover:bg-white/5'
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-8 py-3 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-700 whitespace-nowrap ${
              filter === 'unread'
                ? 'bg-white text-black shadow-2xl scale-105'
                : 'text-gray-500 hover:text-white hover:bg-white/5'
            }`}
          >
            Non lues
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-8 py-3 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-700 whitespace-nowrap ${
              filter === 'read'
                ? 'bg-white text-black shadow-2xl scale-105'
                : 'text-gray-500 hover:text-white hover:bg-white/5'
            }`}
          >
            Lues
          </button>
        </div>

        {/* Notifications List */}
        <div className='space-y-4'>
          {loading ? (
            <div className='col-span-full py-24 flex flex-col items-center justify-center bg-white/5 border border-dashed border-white/10 rounded-[3rem] group'>
              <div className='w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-700'>
                 <Clock size={40} className='text-gray-700 animate-pulse' />
              </div>
              <p className='text-gray-500 font-bold text-[10px] uppercase tracking-widest'>Chargement des notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className='col-span-full py-24 flex flex-col items-center justify-center bg-white/5 border border-dashed border-white/10 rounded-[3rem] group'>
              <div className='w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-700'>
                <Bell size={40} className='text-gray-700' />
              </div>
              <h3 className='text-lg font-black uppercase tracking-widest text-white mb-2'>
                Aucune notification
              </h3>
              <p className='text-gray-500 font-bold text-[10px] uppercase tracking-widest'>
                {filter === 'unread'
                  ? "Vous n'avez aucune notification non lue"
                  : "Vous n'avez aucune notification pour le moment"}
              </p>
            </div>
          ) : (
            notifications.map(notification => (
              <div
                key={notification.id}
                className={`p-6 md:p-8 rounded-[2rem] border transition-all duration-500 shadow-2xl group relative overflow-hidden ${
                  notification.is_read
                    ? 'bg-[#0f0f0f] border-white/5 hover:border-white/10 hover:-translate-y-1'
                    : `${getNotificationColor(notification.type)} backdrop-blur-md`
                }`}
              >
                {!notification.is_read && (
                    <div className='absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px] pointer-events-none'></div>
                )}
                <div className='flex items-start md:items-center gap-6 relative'>
                  {/* Icon */}
                  <div className='flex-shrink-0 w-14 h-14 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner'>
                    {getNotificationIcon(notification.type)}
                  </div>
                  {/* Content */}
                  <div className='flex-1 min-w-0'>
                    <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                      <div>
                        <h4 className='text-white font-black text-sm md:text-base tracking-tight'>
                          {notification.title}
                        </h4>
                        <p className='text-gray-300 font-medium text-sm mt-1 leading-relaxed'>
                          {notification.message}
                        </p>
                        <p className='text-gray-500 font-black text-[10px] uppercase tracking-widest mt-3'>
                          {notification.created_at}
                        </p>
                      </div>
                      <div className='flex items-center gap-2 self-start md:self-auto bg-white/5 p-1 rounded-2xl border border-white/5'>
                        {!notification.is_read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className='p-3 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-xl transition-all'
                            title='Marquer comme lu'
                          >
                            <Check size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className='p-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all'
                          title='Supprimer'
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    {/* Sender Info */}
                    {notification.sender && (
                      <div className='flex items-center gap-4 mt-6 pt-4 border-t border-white/5'>
                        <div className='w-10 h-10 rounded-[1rem] overflow-hidden flex-shrink-0 relative shadow-xl'>
                          <Avatar user={notification.sender} size='w-10 h-10' />
                        </div>
                        <span className='text-xs font-black uppercase tracking-widest text-gray-400'>
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
