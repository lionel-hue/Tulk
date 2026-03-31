import { useState, useEffect, useCallback } from 'react'
import api from '../utils/api'
import { useAuth } from '../contexts/AuthContext'

/**
 * Custom hook to fetch and manage notification counts for badges
 * (Messages, Notifications, Friend Requests)
 */
export const useNotificationCounts = () => {
  const { user } = useAuth()
  const [counts, setCounts] = useState({
    messages: 0,
    notifications: 0,
    friends: 0,
    home: 0
  })
  const [loading, setLoading] = useState(false)

  const fetchCounts = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)
      const [msgRes, notifRes, friendRes, postRes] = await Promise.all([
        api.get('/messages/unread-count'),
        api.get('/notifications/unread-count'),
        api.get('/friends/pending-count'),
        api.get('/posts/unread-count')
      ])

      setCounts({
        messages: msgRes.data.count || 0,
        notifications: notifRes.data.count || 0,
        friends: friendRes.data.count || 0,
        home: postRes.data.count || 0
      })
    } catch (error) {
      console.error('Error fetching notification counts:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchCounts()

    // Periodically refresh counts (every 60 seconds)
    const interval = setInterval(fetchCounts, 60000)
    return () => clearInterval(interval)
  }, [fetchCounts])

  return { ...counts, loading, refresh: fetchCounts }
}

export default useNotificationCounts
