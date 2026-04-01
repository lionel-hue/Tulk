// front/src/components/main/Profile.jsx
import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom'
import api from '../../utils/api'
import Modal, { useModal } from '../Modal'
import { getImageUrl } from '../../utils/imageUrls'
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'
import {
  Camera,
  MapPin,
  Link as LinkIcon,
  Calendar,
  Users,
  Heart,
  MessageCircle,
  FileText,
  Edit2,
  Save,
  X,
  UserPlus,
  UserCheck,
  UserX,
  Clock,
  Image,
  User,
  Bell,
  Mail,
  UserMinus
} from 'lucide-react'
import Header from '../Header'
import SideMenuNav from '../SideMenuNav'
import Avatar from '../common/Avatar'

const Profile = () => {
  const { user: currentUser, updateUser } = useAuth()
  const { userId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { modal, setModal, confirm } = useModal()
  const [profile, setProfile] = useState(null)
  const isOwner = !userId || parseInt(userId) === currentUser?.id
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [posts, setPosts] = useState([])
  const [postsPage, setPostsPage] = useState(1)
  const [hasMorePosts, setHasMorePosts] = useState(false)
  const [loadingMorePosts, setLoadingMorePosts] = useState(false)
  
  const [friends, setFriends] = useState([])
  const [friendsPage, setFriendsPage] = useState(1)
  const [hasMoreFriends, setHasMoreFriends] = useState(false)
  const [loadingMoreFriends, setLoadingMoreFriends] = useState(false)

  const [activeTab, setActiveTab] = useState('posts')
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const [bannerError, setBannerError] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [likingProfile, setLikingProfile] = useState(false)
  const [following, setFollowing] = useState(false)
  const fileInputRef = useRef(null)
  const bannerInputRef = useRef(null)

  const loadMorePosts = () => {
    if (hasMorePosts && !loadingMorePosts) {
        loadPosts(postsPage + 1)
    }
  }

  const loadMoreFriends = () => {
    if (hasMoreFriends && !loadingMoreFriends) {
        loadFriends(friendsPage + 1)
    }
  }

  const { sentinelRef: postsSentinel } = useInfiniteScroll(loadMorePosts, hasMorePosts, loadingMorePosts)
  const { sentinelRef: friendsSentinel } = useInfiniteScroll(loadMoreFriends, hasMoreFriends, loadingMoreFriends)

  useEffect(() => {
    console.log('Profile component mounted, userId:', userId)
    console.log('Current user:', currentUser)
    // Reset pages when profile changes
    setPostsPage(1)
    setFriendsPage(1)
    setPosts([])
    setFriends([])
    loadProfile()
  }, [userId])

  const loadProfile = async () => {
    try {
      console.log('Loading profile for userId:', userId || 'current user')
      setLoading(true)
      setError(null)
      const url = userId ? `/profile/${userId}` : '/profile'
      const response = await api.get(url)
      console.log('Profile API response:', response.data)
      if (response.data.success) {
        setProfile(response.data.profile)
        setEditData({
          nom: response.data.profile.nom,
          prenom: response.data.profile.prenom,
          bio: response.data.profile.bio || '',
          location: response.data.profile.location || '',
          website: response.data.profile.website || '',
          sexe: response.data.profile.sexe || ''
        })
      } else {
        setError('Impossible de charger le profil')
        setModal({
          show: true,
          type: 'error',
          title: 'Erreur',
          message: response.data.message || 'Impossible de charger le profil'
        })
      }
    } catch (error) {
      console.error('Profile load error:', error)
      console.error('Error response:', error.response)
      console.error('Error status:', error.response?.status)
      console.error('Error data:', error.response?.data)
      const errorMessage =
        error.response?.data?.message || error.message || 'Erreur de connexion'
      setError(errorMessage)
      setModal({
        show: true,
        type: 'error',
        title: 'Erreur',
        message: errorMessage
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (profile) {
      if (activeTab === 'posts' && posts.length === 0) {
        loadPosts(1)
      } else if (activeTab === 'friends' && friends.length === 0) {
        loadFriends(1)
      }
    }
  }, [activeTab, profile?.id])

  const loadPosts = async (page = 1) => {
    try {
      console.log('Loading posts for user:', profile.id, 'page:', page)
      if (page === 1) {
        // Initial load or refresh
      } else {
        setLoadingMorePosts(true)
      }
      
      const response = await api.get(`/profile/${profile.id}/posts?page=${page}`)
      console.log('Posts API response:', response.data)
      if (response.data.success) {
        const newPosts = response.data.posts.data
        if (page === 1) {
          setPosts(newPosts)
        } else {
          setPosts(prev => [...prev, ...newPosts])
        }
        setPostsPage(page)
        setHasMorePosts(response.data.posts.current_page < response.data.posts.last_page)
      }
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setLoadingMorePosts(false)
    }
  }

  const loadFriends = async (page = 1) => {
    try {
      if (page === 1) {
        // Initial load
      } else {
        setLoadingMoreFriends(true)
      }
      const response = await api.get(`/friends?user_id=${profile.id}&page=${page}`)
      if (response.data.success) {
        const newFriends = response.data.friends
        if (page === 1) {
          setFriends(newFriends)
        } else {
          setFriends(prev => [...prev, ...newFriends])
        }
        setFriendsPage(page)
        setHasMoreFriends(response.data.has_more)
      }
    } catch (error) {
      console.error('Error loading friends:', error)
    } finally {
      setLoadingMoreFriends(false)
    }
  }

  const handleImageUpload = async e => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setModal({
        show: true,
        type: 'error',
        title: 'Erreur',
        message: 'Fichier invalide'
      })
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setModal({
        show: true,
        type: 'error',
        title: 'Erreur',
        message: 'Image trop volumineuse (max 5MB)'
      })
      return
    }
    try {
      setUploadingImage(true)
      const formData = new FormData()
      formData.append('image', file)
      const response = await api.post('/profile/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (response.data.success) {
        setProfile(prev => ({ ...prev, image: response.data.image_url }))
        updateUser({ image: response.data.image_url })
        setModal({
          show: true,
          type: 'success',
          title: 'Succès',
          message: 'Photo mise à jour'
        })
      }
    } catch (error) {
      console.error('Image upload error:', error)
      setModal({
        show: true,
        type: 'error',
        title: 'Erreur',
        message: 'Échec du téléchargement'
      })
    } finally {
      setUploadingImage(false)
    }
  }

  const handleBannerUpload = async e => {
    const file = e.target.files[0]
    if (!file) return
    try {
      setUploadingBanner(true)
      const formData = new FormData()
      formData.append('banner', file)
      const response = await api.post('/profile/banner', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (response.data.success) {
        setProfile(prev => ({ ...prev, banner: response.data.banner_url }))
        setModal({
          show: true,
          type: 'success',
          title: 'Succès',
          message: 'Bannière mise à jour'
        })
      }
    } catch (error) {
      console.error('Banner upload error:', error)
      setModal({
        show: true,
        type: 'error',
        title: 'Erreur',
        message: 'Échec du téléchargement'
      })
    } finally {
      setUploadingBanner(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      const submitData = { ...editData }
      if (submitData.website && !submitData.website.startsWith('http')) {
        submitData.website = 'https://' + submitData.website
      }
      const response = await api.put('/profile', submitData)
      if (response.data.success) {
        setProfile(prev => ({ ...prev, ...response.data.user }))
        updateUser(response.data.user)
        setIsEditing(false)
        setModal({
          show: true,
          type: 'success',
          title: 'Succès',
          message: 'Profil mis à jour'
        })
        loadProfile()
      }
    } catch (error) {
      console.error('Profile update error:', error)
      setModal({
        show: true,
        type: 'error',
        title: 'Erreur',
        message: 'Échec de la mise à jour'
      })
    }
  }

  const handleSendRequest = async () => {
    try {
      const response = await api.post('/friends/request', {
        user_id: profile.id
      })
      if (response.data.success) {
        setProfile(prev => ({ ...prev, has_pending_request: true }))
        setModal({
          show: true,
          type: 'success',
          title: 'Succès',
          message: 'Demande envoyée'
        })
      }
    } catch (error) {
      console.error('Send request error:', error)
      setModal({
        show: true,
        type: 'error',
        title: 'Erreur',
        message: error.response?.data?.message || 'Échec'
      })
    }
  }

  const handleAcceptRequest = async () => {
    try {
      const response = await api.post('/friends/accept', {
        user_id: profile.id
      })
      if (response.data.success) {
        setProfile(prev => ({
          ...prev,
          is_friend: true,
          has_pending_request: false
        }))
        setModal({
          show: true,
          type: 'success',
          title: 'Succès',
          message: 'Ami ajouté'
        })
      }
    } catch (error) {
      console.error('Accept request error:', error)
      setModal({
        show: true,
        type: 'error',
        title: 'Erreur',
        message: 'Échec'
      })
    }
  }

  const handleRemoveFriend = async (targetId = null, targetName = null) => {
    const id = targetId || profile.id
    const name = targetName || `${profile.prenom} ${profile.nom}`
    
    const confirmed = await confirm(`Supprimer ${name} de vos amis ?`, 'Confirmer')
    if (!confirmed) return
    try {
      const response = await api.post('/friends/remove', {
        user_id: id
      })
      if (response.data.success) {
        if (!targetId || targetId === profile.id) {
          setProfile(prev => ({ ...prev, is_friend: false }))
        }
        
        // Also update the friends list if we're on the friends tab
        if (targetId) {
          setProfile(prev => ({
            ...prev,
            recent_friends: prev.recent_friends.filter(f => f.id !== targetId),
            stats: { ...prev.stats, friends: Math.max(0, prev.stats.friends - 1) }
          }))
        }
        
        setModal({
          show: true,
          type: 'success',
          title: 'Succès',
          message: 'Ami supprimé'
        })
      }
    } catch (error) {
      console.error('Remove friend error:', error)
      setModal({
        show: true,
        type: 'error',
        title: 'Erreur',
        message: 'Échec'
      })
    }
  }

  const handleLikeProfile = async () => {
    try {
      setLikingProfile(true)
      const response = await api.post(`/profile/${profile.id}/like`)
      if (response.data.success) {
        setProfile(prev => ({
          ...prev,
          has_liked_profile: response.data.liked,
          stats: {
            ...prev.stats,
            likes_received: response.data.likes_count
          }
        }))
        setModal({
          show: true,
          type: 'success',
          title: 'Succès',
          message: response.data.liked
            ? 'Profil liké avec succès!'
            : 'Like retiré'
        })
      }
    } catch (error) {
      setModal({
        show: true,
        type: 'error',
        title: 'Erreur',
        message: error.response?.data?.message || 'Erreur lors du like'
      })
    } finally {
      setLikingProfile(false)
    }
  }

  const handleFollow = async () => {
    try {
      setFollowing(true)
      const response = await api.post(`/profile/${profile.id}/follow`)
      if (response.data.success) {
        setProfile(prev => ({
          ...prev,
          is_following: true,
          stats: {
            ...prev.stats,
            followers: prev.stats.followers + 1
          }
        }))
        setModal({
          show: true,
          type: 'success',
          title: 'Succès',
          message: 'Utilisateur suivi avec succès!'
        })
      }
    } catch (error) {
      setModal({
        show: true,
        type: 'error',
        title: 'Erreur',
        message: error.response?.data?.message || 'Erreur lors du follow'
      })
    } finally {
      setFollowing(false)
    }
  }

  const handleUnfollow = async () => {
    const confirmed = await confirm(
      'Voulez-vous vraiment vous désabonner ?',
      'Confirmer'
    )
    if (!confirmed) return
    try {
      setFollowing(true)
      const response = await api.delete(`/profile/${profile.id}/follow`)
      if (response.data.success) {
        setProfile(prev => ({
          ...prev,
          is_following: false,
          stats: {
            ...prev.stats,
            followers: Math.max(0, prev.stats.followers - 1)
          }
        }))
        setModal({
          show: true,
          type: 'success',
          title: 'Succès',
          message: 'Utilisateur non suivi'
        })
      }
    } catch (error) {
      setModal({
        show: true,
        type: 'error',
        title: 'Erreur',
        message: error.response?.data?.message || 'Erreur lors du unfollow'
      })
    } finally {
      setFollowing(false)
    }
  }

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getInitials = user => {
    return `${user?.prenom?.[0] || ''}${user?.nom?.[0] || ''}`.toUpperCase()
  }

  /* ─── Rich user card for friends tab ─────────────────────────────── */
  const renderUserCard = (user, index) => {
    const isMe = user.id === currentUser?.id

    return (
      <div key={`friend-${user.id}-${index}`}
        className='group bg-[#0f0f0f] border border-white/5 rounded-[2rem] overflow-hidden hover:border-purple-500/20 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(139,92,246,0.1)] transition-all duration-500 flex flex-col h-full'
      >
        {/* Banner area */}
        <div className='h-24 bg-gradient-to-br from-purple-900/40 via-gray-900 to-black flex-shrink-0 relative overflow-hidden'>
          <div className='absolute inset-0 opacity-20 bg-[url("https://www.transparenttextures.com/patterns/carbon-fibre.png")]'></div>
          <div className='absolute -bottom-6 -right-6 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all duration-700'></div>
        </div>

        {/* Content area */}
        <div className='px-5 pb-5 flex-1 flex flex-col'>
          {/* Avatar & Top actions */}
          <div className='flex items-start justify-between -mt-10 mb-4 relative z-10'>
            <div className='p-1 bg-[#0f0f0f] rounded-2xl md:rounded-[1.5rem] shadow-2xl group-hover:scale-105 transition-transform duration-700'>
              <Avatar user={user} size='w-16 h-16 md:w-20 md:h-20' className='rounded-[1.2rem] md:rounded-[1.4rem] border-2 border-[#0f0f0f]' />
            </div>
            
            {!isMe && (
              <Link
                to={`/messages?userId=${user.id}`}
                className='mb-1 p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl border border-transparent hover:border-white/10 transition-all'
                title='Envoyer un message'
              >
                <MessageCircle size={18} />
              </Link>
            )}
          </div>

          {/* Name */}
          <Link to={`/profile/${user.id}`} className='hover:text-purple-400 transition-colors mb-0.5'>
            <h4 className='text-white font-bold text-sm leading-snug'>
              {user.prenom} {user.nom}
              {isMe && <span className='ml-2 text-[10px] font-black bg-purple-500/15 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/20'>Vous</span>}
            </h4>
          </Link>

          {/* Bio */}
          {user.bio ? (
            <p className='text-gray-500 text-[12px] leading-relaxed mb-4 line-clamp-2 flex-1'>
              {user.bio}
            </p>
          ) : (
            <div className='flex-1'></div>
          )}

          {/* Stats row */}
          <div className='flex items-center gap-3 mb-5 flex-wrap'>
            {user.followers_count != null && (
              <span className='flex items-center gap-1 text-[11px] text-gray-500'>
                <Heart size={11} className='text-pink-500/60' />
                <span className='font-semibold text-gray-400'>{user.followers_count}</span>
                <span>abonnés</span>
              </span>
            )}
            {user.posts_count != null && (
              <span className='flex items-center gap-1 text-[11px] text-gray-500'>
                <FileText size={11} className='text-purple-500/60' />
                <span className='font-semibold text-gray-400'>{user.posts_count}</span>
                <span>posts</span>
              </span>
            )}
          </div>

          {/* Action button */}
          {!isMe && (
            <div className='mt-auto pt-2 border-t border-white/5'>
              <div className='flex gap-2'>
                <Link
                  to={`/messages?userId=${user.id}`}
                  className='flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all'
                >
                  <MessageCircle size={14} /> Message
                </Link>
                <button
                  className='flex items-center justify-center gap-1 px-3 py-2 text-xs font-bold text-gray-600 hover:text-red-400 bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 rounded-xl transition-all'
                  onClick={() => handleRemoveFriend(user.id, `${user.prenom} ${user.nom}`)}
                  title="Supprimer l'ami"
                >
                  <UserMinus size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-black flex items-center justify-center'>
        <div className='text-white text-lg'>Chargement du profil...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='min-h-screen bg-black flex items-center justify-center'>
        <div className='text-white text-lg text-center'>
          <p className='mb-4'>{error}</p>
          <button
            onClick={loadProfile}
            className='px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200'
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className='min-h-screen bg-black flex items-center justify-center'>
        <div className='text-white text-lg'>Profil non trouvé</div>
      </div>
    )
  }

    return (
    <div className='profile-page min-h-screen bg-[#060606] text-white selection:bg-purple-500/30'>
      <SideMenuNav isOpen={sidebarOpen} onClose={closeSidebar} />
      
      <div className='flex flex-col min-h-screen'>
        <Header
          sidebarOpen={sidebarOpen}
          onSidebarToggle={toggleSidebar}
          activeSection='profile'
          searchQuery=''
          onSearchChange={() => {}}
        />

        <main className='flex-1 overflow-y-auto no-scrollbar pt-16'>
          <div className='max-w-7xl mx-auto'>
            {/* 1. Header Section (Banner + Avatar) */}
            <div className='relative group/header'>
              <div className={`h-56 md:h-96 w-full overflow-hidden relative ${!isEditing ? 'rounded-b-[3rem] md:rounded-b-[5rem]' : ''} transition-all duration-1000 shadow-2xl`}>
                {profile.banner && !bannerError ? (
                  <img
                    src={getImageUrl(profile.banner)}
                    alt='Banner'
                    className='w-full h-full object-cover group-hover/header:scale-105 transition-transform duration-[2000ms] ease-out'
                    onError={() => setBannerError(true)}
                  />
                ) : (
                  <div className='w-full h-full bg-gradient-to-br from-[#0f0f0f] via-purple-900/30 to-[#0f0f0f] flex items-center justify-center relative overflow-hidden'>
                    <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(168,85,247,0.1),transparent_70%)] animate-pulse'></div>
                    <div className='absolute top-0 left-0 w-full h-full opacity-10 bg-[url("https://www.transparenttextures.com/patterns/carbon-fibre.png")]'></div>
                    <FileText size={64} className='text-white/5' />
                  </div>
                )}
                
                {/* Banner Gradient Overlay */}
                <div className='absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60'></div>

                {isEditing && (
                  <button
                    onClick={() => bannerInputRef.current?.click()}
                    className='absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white gap-3 transition-all hover:bg-black/60 group/banner'
                  >
                    <div className='w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center group-hover/banner:scale-110 group-hover/banner:rotate-12 transition-all duration-500 border border-white/20 shadow-2xl'>
                      <Camera size={28} />
                    </div>
                    <span className='font-black text-xs tracking-[0.3em] uppercase'>Changer la couverture</span>
                  </button>
                )}
                <input ref={bannerInputRef} type='file' accept='image/*' onChange={handleBannerUpload} className='hidden' />
              </div>

              {/* Avatar - Positioned absolutely relative to header area */}
              <div className='absolute -bottom-16 left-8 md:left-16 z-30 group/avatar'>
                <div className='relative'>
                  <div className='p-2 bg-[#060606] rounded-[2.5rem] md:rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden'>
                    <div className='absolute inset-0 bg-gradient-to-tr from-purple-600 to-pink-600 opacity-0 group-hover/avatar:opacity-30 transition-opacity duration-700 animate-pulse'></div>
                    <Avatar 
                      user={isEditing ? { ...profile, image: editData.image } : profile} 
                      size='w-32 h-32 md:w-44 md:h-44' 
                      className='rounded-[2.2rem] md:rounded-[3rem] border-4 border-[#060606] object-cover relative z-10'
                    />
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className='absolute bottom-2 right-2 p-4 bg-purple-600 text-white rounded-[1.5rem] border-4 border-[#060606] hover:bg-purple-500 transition-all hover:scale-110 hover:rotate-12 shadow-2xl z-20'
                    >
                      <Camera size={22} />
                    </button>
                  )}
                  <input ref={fileInputRef} type='file' accept='image/*' onChange={handleImageUpload} className='hidden' />
                </div>
              </div>
            </div>

            {/* 2. Profile Info & Actions Carrier - Glassmorphism */}
            <div className='relative mt-12 px-4 md:px-8 lg:px-16'>
              <div className='bg-[#0f0f0f]/60 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group/info'>
                {/* Decorative Elements */}
                <div className='absolute -top-32 -right-32 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] group-hover/info:bg-purple-600/20 transition-all duration-1000'></div>
                <div className='absolute -bottom-32 -left-32 w-64 h-64 bg-pink-600/10 rounded-full blur-[100px] group-hover/info:bg-pink-600/20 transition-all duration-1000'></div>

                <div className='relative flex flex-col md:flex-row md:items-end justify-between gap-10'>
                  {/* Left: Identity */}
                  <div className='flex-1 space-y-6'>
                    <div className='pt-8 md:pt-0'>
                      {!isEditing ? (
                        <>
                          <div className='flex items-center gap-4 flex-wrap'>
                            <h1 className='text-4xl md:text-6xl font-black text-white tracking-tighter'>
                              {profile.prenom}{' '}
                              <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 animate-gradient-x'>
                                {profile.nom}
                              </span>
                            </h1>
                            {profile.role && (
                              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                profile.role === 'admin' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                              }`}>
                                {profile.role === 'admin' ? 'Admin' : 'VIP Member'}
                              </span>
                            )}
                          </div>
                          {profile.bio && (
                            <p className='text-gray-400 mt-4 text-xl font-medium max-w-2xl leading-relaxed italic'>
                              "{profile.bio}"
                            </p>
                          )}
                          <div className='flex flex-wrap items-center gap-3 mt-6'>
                            {profile.location && (
                              <div className='flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl border border-white/5 hover:border-white/20 transition-all group/loc'>
                                <MapPin size={16} className='text-purple-400 group-hover/loc:scale-125 transition-transform' />
                                <span className='text-sm font-bold text-gray-300'>{profile.location}</span>
                              </div>
                            )}
                            {profile.website && (
                              <a
                                href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                                target='_blank' rel='noopener noreferrer'
                                className='flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group/web'
                              >
                                <LinkIcon size={16} className='text-pink-400 group-hover/web:rotate-12 transition-transform' />
                                <span className='text-sm font-bold text-gray-300'>{profile.website.replace(/^https?:\/\//, '')}</span>
                              </a>
                            )}
                            <div className='flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl border border-white/5'>
                              <Calendar size={16} className='text-blue-400' />
                              <span className='text-sm font-bold text-gray-300'>{formatDate(profile.created_at)}</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className='space-y-6 max-w-2xl bg-white/5 p-6 rounded-[2rem] border border-white/10'>
                          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='space-y-1.5'>
                               <label className='text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2'>Prénom</label>
                               <input type='text' value={editData.prenom} onChange={e => setEditData(prev => ({ ...prev, prenom: e.target.value }))} className='w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-purple-500/50 transition-all' />
                            </div>
                            <div className='space-y-1.5'>
                               <label className='text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2'>Nom</label>
                               <input type='text' value={editData.nom} onChange={e => setEditData(prev => ({ ...prev, nom: e.target.value }))} className='w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-purple-500/50 transition-all' />
                            </div>
                          </div>
                          <div className='space-y-1.5'>
                             <label className='text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2'>Bio</label>
                             <textarea value={editData.bio || ''} onChange={e => setEditData(prev => ({ ...prev, bio: e.target.value }))} rows='3' className='w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none' />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className='flex gap-4 flex-wrap items-center md:pb-4'>
                    {isOwner ? (
                      !isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className='px-10 py-4 bg-white text-black rounded-[1.5rem] font-black text-sm tracking-widest hover:bg-gray-200 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)] hover:scale-110 active:scale-95'
                        >
                          EDIT PROFILE
                        </button>
                      ) : (
                        <div className='flex gap-3'>
                          <button onClick={() => setIsEditing(false)} className='px-6 py-4 bg-white/5 text-white border border-white/10 rounded-[1.5rem] font-bold hover:bg-white/10 transition-all'>
                            DISCARD
                          </button>
                          <button onClick={handleSaveProfile} className='px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-[1.5rem] font-black text-sm tracking-widest hover:scale-110 active:scale-95 shadow-[0_10px_30px_rgba(168,85,247,0.3)]'>
                            SAVE CHANGES
                          </button>
                        </div>
                      )
                    ) : (
                      <div className='flex items-center gap-4 bg-white/5 p-2 rounded-[2rem] border border-white/5 backdrop-blur-md'>
                        <button
                          onClick={handleLikeProfile} disabled={likingProfile}
                          className={`p-4 rounded-2xl transition-all hover:scale-110 active:scale-90 ${
                            profile.has_liked_profile ? 'bg-red-500 text-white shadow-xl shadow-red-500/30' : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'
                          }`}
                        >
                          <Heart size={24} fill={profile.has_liked_profile ? 'currentColor' : 'none'} />
                        </button>

                        <button
                          onClick={profile.is_following ? handleUnfollow : handleFollow} disabled={following}
                          className={`px-10 py-4 rounded-2xl font-black text-xs tracking-[0.2em] transition-all hover:scale-105 active:scale-95 ${
                            profile.is_following ? 'bg-white/10 text-white border border-white/20' : 'bg-white text-black shadow-2xl'
                          }`}
                        >
                          {profile.is_following ? 'FOLLOWING' : 'FOLLOW'}
                        </button>

                        {profile.is_friend ? (
                          <button onClick={handleRemoveFriend} className='p-4 bg-white/5 text-gray-500 border border-white/10 rounded-2xl hover:text-red-400 transition-all'>
                            <UserX size={24} />
                          </button>
                        ) : (
                          <button onClick={handleSendRequest} className={`p-4 rounded-2xl font-bold transition-all hover:scale-110 ${profile.has_pending_request ? 'bg-yellow-500/20 text-yellow-500' : 'bg-purple-600 text-white shadow-xl shadow-purple-600/20'}`}>
                            {profile.has_pending_request ? <Clock size={24} /> : <UserPlus size={24} />}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Modern Integrated Stats */}
                <div className='grid grid-cols-3 md:grid-cols-6 gap-4 mt-12 pt-12 border-t border-white/5'>
                  {[
                    { label: 'Posts', value: profile.stats.posts, icon: FileText, color: 'text-blue-400' },
                    { label: 'Amis', value: profile.stats.friends, icon: Users, color: 'text-purple-400' },
                    { label: 'Likes', value: profile.stats.likes_received, icon: Heart, color: 'text-red-400' },
                    { label: 'Followers', value: profile.stats.followers, icon: UserCheck, color: 'text-green-400' },
                    { label: 'Following', value: profile.stats.following, icon: Users, color: 'text-orange-400' },
                    { label: 'Comment', value: profile.stats.comments_received, icon: MessageCircle, color: 'text-pink-400' }
                  ].map((stat, i) => (
                    <div key={i} className='text-center group/stat'>
                      <div className='flex items-center justify-center gap-1.5 mb-2 opacity-50 group-hover/stat:opacity-100 transition-opacity'>
                        <stat.icon size={12} className={stat.color} />
                        <span className='text-[8px] font-black uppercase tracking-[0.2em] text-gray-400'>{stat.label}</span>
                      </div>
                      <div className='text-2xl md:text-3xl font-black text-white group-hover/stat:scale-125 transition-transform duration-500 ease-out cursor-default'>
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Navigation Tabs */}
            <div className='mt-16 px-4 md:px-16'>
            <div className='flex flex-wrap sm:flex-nowrap items-center justify-center md:justify-start gap-2 w-full'>
              {[
                { id: 'posts', label: 'Feeds', icon: FileText },
                { id: 'friends', label: 'Friends', icon: Users, count: profile.stats.friends },
                { id: 'about', label: 'Details', icon: MapPin }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 sm:px-10 py-3.5 sm:py-4 rounded-[1.5rem] sm:rounded-[2rem] font-black text-[10px] uppercase tracking-[0.25em] transition-all duration-700 flex items-center gap-3 ${
                    activeTab === tab.id ? 'bg-white text-black shadow-2xl scale-105' : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5'
                  }`}
                >
                  <tab.icon size={16} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[8px] ${activeTab === tab.id ? 'bg-black text-white' : 'bg-white/10 text-gray-500'}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

              {/* Tab Content Panes */}
              <div className='mt-12 mb-20 min-h-[400px] overflow-x-hidden'>
                {activeTab === 'posts' && (
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-5 duration-700 px-1 sm:px-0'>
                    {posts.length === 0 ? (
                      <div className='col-span-full py-32 flex flex-col items-center justify-center bg-white/5 border border-dashed border-white/10 rounded-[4rem] group'>
                         <div className='w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-700'>
                            <FileText size={40} className='text-gray-700' />
                         </div>
                         <p className='text-gray-600 font-black uppercase tracking-widest'>Aucune publication ici</p>
                      </div>
                    ) : (
                      posts.map((post, index) => (
                        <div key={`post-${post.id}-${index}`} className='group bg-[#0f0f0f] border border-white/5 rounded-[3rem] p-8 hover:border-purple-500/20 transition-all duration-700 hover:shadow-2xl hover:shadow-purple-500/5 hover:-translate-y-2'>
                          <div className='flex items-center gap-4 mb-8'>
                             <Avatar user={profile} size='w-12 h-12' className='rounded-2xl' />
                             <div>
                                <p className='text-white font-black text-sm tracking-tight'>{profile.prenom} {profile.nom}</p>
                                <p className='text-[10px] font-bold text-gray-600 uppercase tracking-widest'>{formatDate(post.created_at)}</p>
                             </div>
                          </div>
                          
                          <p className='text-gray-300 mb-8 text-lg font-medium leading-relaxed'>{post.description}</p>
                          
                          {post.image ? (
                            <div className='rounded-[2.5rem] overflow-hidden mb-8 aspect-video shadow-2xl relative'>
                              <img src={getImageUrl(post.image)} alt='Post' className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000' />
                              <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent'></div>
                            </div>
                          ) : (
                            <div className='w-full h-48 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-[2.5rem] mb-8 flex flex-col items-center justify-center border border-white/5 shadow-inner'>
                              <Image size={32} className='text-white/5 mb-2' />
                              <span className='text-[10px] font-black uppercase tracking-[0.3em] text-white/10'>Tulk Visual</span>
                            </div>
                          )}

                          <div className='flex items-center justify-between'>
                            <div className='flex gap-8'>
                               <div className='flex items-center gap-2 group/btn cursor-pointer'>
                                 <Heart size={20} className='text-gray-600 group-hover/btn:text-red-500 transition-colors' />
                                 <span className='text-xs font-black text-gray-500 group-hover/btn:text-white'>{post.likes_count}</span>
                               </div>
                               <div className='flex items-center gap-2 group/btn cursor-pointer'>
                                 <MessageCircle size={20} className='text-gray-600 group-hover/btn:text-blue-500 transition-colors' />
                                 <span className='text-xs font-black text-gray-500 group-hover/btn:text-white'>{post.comments_count}</span>
                               </div>
                            </div>
                            <button className='text-[10px] font-black uppercase tracking-[0.2em] text-gray-700 hover:text-white transition-colors'>View details</button>
                          </div>
                        </div>
                      ))
                    )}
                    {/* Posts Infinite Scroll Sentinel */}
                    {hasMorePosts && (
                      <div ref={postsSentinel} className='col-span-full py-8 flex justify-center'>
                        <div className='w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin'></div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'friends' && (
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-5 duration-700 px-1 sm:px-0'>
                    {friends?.length > 0 ? (
                      friends.map((friend, index) => renderUserCard(friend, index))
                    ) : (
                      <div className='col-span-full py-32 text-center bg-white/5 rounded-[4rem] border border-dashed border-white/10'>
                        <Users size={40} className='mx-auto mb-4 text-gray-700' />
                        <p className='text-gray-500 font-black uppercase tracking-widest'>Pas encore d'amis</p>
                      </div>
                    )}
                    {/* Friends Infinite Scroll Sentinel */}
                    {hasMoreFriends && (
                      <div ref={friendsSentinel} className='col-span-full py-8 flex justify-center'>
                        <div className='w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin'></div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'about' && (
                  <div className='max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-700 px-1 sm:px-0'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10'>
                      <div className='space-y-10'>
                        <div className='group'>
                          <h3 className='text-[10px] font-black uppercase tracking-[0.5em] text-purple-400 mb-8 flex items-center gap-6'>
                             <span className='w-12 h-px bg-purple-400/30 group-hover:w-20 transition-all duration-700'></span>
                             Information de base
                          </h3>
                          <div className='grid gap-4'>
                            {[
                              { label: 'Identité Publique', value: `${profile.prenom} ${profile.nom}`, icon: User },
                              { label: 'Email vérifié', value: profile.email, icon: Mail },
                              { label: 'Localisation', value: profile.location || 'Dans le cloud', icon: MapPin }
                            ].map((item, i) => (
                              <div key={i} className='bg-white/5 border border-white/5 rounded-[2rem] p-6 hover:border-white/20 transition-all hover:bg-white/[0.07]'>
                                <div className='flex items-center gap-6'>
                                  <div className='w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5'>
                                    <item.icon size={20} className='text-gray-400' />
                                  </div>
                                  <div>
                                    <p className='text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1'>{item.label}</p>
                                    <p className='text-white font-bold text-lg'>{item.value}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className='space-y-10'>
                        <div className='group'>
                          <h3 className='text-[10px] font-black uppercase tracking-[0.5em] text-pink-400 mb-8 flex items-center gap-6'>
                             <span className='w-12 h-px bg-pink-400/30 group-hover:w-20 transition-all duration-700'></span>
                             Réseau & Social
                          </h3>
                          <div className='grid gap-4'>
                             <div className='bg-white/5 border border-white/5 rounded-[2rem] p-6 hover:border-white/20 transition-all'>
                                <div className='flex items-center gap-6'>
                                   <div className='w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5'>
                                      <LinkIcon size={20} className='text-gray-400' />
                                   </div>
                                   <div>
                                      <p className='text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2'>Digital Presence</p>
                                      {profile.website ? (
                                        <a href={profile.website} target='_blank' rel='noopener noreferrer' className='text-white font-bold text-lg hover:text-pink-400 transition-colors border-b-2 border-pink-400/20'>
                                          {profile.website.replace(/^https?:\/\//, '')}
                                        </a>
                                      ) : <span className='text-gray-700 font-bold'>Non spécifiée</span>}
                                   </div>
                                </div>
                             </div>
                             
                             <div className='bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-white/10 rounded-[3rem] p-10 text-center relative overflow-hidden group/m'>
                                <div className='absolute inset-0 bg-white/5 opacity-0 group-hover/m:opacity-100 transition-opacity duration-1000'></div>
                                <p className='text-[10px] font-black uppercase tracking-[0.4em] text-purple-300 mb-4'>Mutual Connections</p>
                                <div className='text-6xl font-black text-white mb-4 tracking-tighter'>{profile.mutual_friends_count}</div>
                                <p className='text-gray-400 text-xs font-bold leading-relaxed max-w-[200px] mx-auto'>Personnes que vous connaissez tous les deux sur Tulk.</p>
                             </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <Modal modal={modal} setModal={setModal} />
    </div>
  )
}

export default Profile
