// front/src/components/main/Profile.jsx
import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import api from '../../utils/api'
import Modal, { useModal } from '../Modal'
import { getImageUrl } from '../../utils/imageUrls'
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
  MoreVertical,
  Image as ImageIcon,
  Trash2,
  LayoutDashboard,
  Bell,
  Settings,
  LogOut,
  Menu
} from 'lucide-react'
import Header from '../Header'
import SideMenuNav from '../SideMenuNav'

const Profile = () => {
  const { user: currentUser } = useAuth()
  const { userId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { modal, setModal, confirm } = useModal()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [posts, setPosts] = useState([])
  const [activeTab, setActiveTab] = useState('posts')
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const fileInputRef = useRef(null)
  const bannerInputRef = useRef(null)

  // Load profile data
  useEffect(() => {
    console.log('Profile component mounted, userId:', userId)
    console.log('Current user:', currentUser)
    loadProfile()
  }, [userId])

  const loadProfile = async () => {
    try {
      console.log('Loading profile for userId:', userId || 'current user')
      setLoading(true)
      setError(null)
      const response = await api.get(`/profile/${userId || ''}`)
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

  // Load user posts
  useEffect(() => {
    if (profile && activeTab === 'posts') {
      loadPosts()
    }
  }, [activeTab, profile])

  const loadPosts = async () => {
    try {
      console.log('Loading posts for user:', profile.id)
      const response = await api.get(`/profile/${profile.id}/posts`)
      console.log('Posts API response:', response.data)
      if (response.data.success) {
        setPosts(response.data.posts)
      }
    } catch (error) {
      console.error('Error loading posts:', error)
    }
  }

  // Handle image upload
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

  // Handle banner upload
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

  // Handle profile update
  const handleSaveProfile = async () => {
    try {
      const submitData = { ...editData }
      if (submitData.website && !submitData.website.startsWith('http')) {
        submitData.website = 'https://' + submitData.website
      }
      const response = await api.put('/profile', submitData)
      if (response.data.success) {
        setProfile(prev => ({ ...prev, ...response.data.user }))
        setIsEditing(false)
        setModal({
          show: true,
          type: 'success',
          title: 'Succès',
          message: 'Profil mis à jour'
        })
        // Reload profile to ensure all data is fresh
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

  // Handle friend actions
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

  const handleRemoveFriend = async () => {
    const confirmed = await confirm('Supprimer cet ami ?', 'Confirmer')
    if (!confirmed) return
    try {
      const response = await api.post('/friends/remove', {
        user_id: profile.id
      })
      if (response.data.success) {
        setProfile(prev => ({ ...prev, is_friend: false }))
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  // Loading state
  if (loading) {
    return (
      <div className='min-h-screen bg-black flex items-center justify-center'>
        <div className='text-white text-lg'>Chargement du profil...</div>
      </div>
    )
  }

  // Error state
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

  // No profile state
  if (!profile) {
    return (
      <div className='min-h-screen bg-black flex items-center justify-center'>
        <div className='text-white text-lg'>Profil non trouvé</div>
      </div>
    )
  }

  const isOwner = profile.is_owner

  return (
    <div className='profile-page min-h-screen bg-[#0a0a0a]'>
      <SideMenuNav isOpen={sidebarOpen} onClose={closeSidebar} />
      <div className='home-main'>
        <Header
          sidebarOpen={sidebarOpen}
          onSidebarToggle={toggleSidebar}
          activeSection='profile'
          searchQuery=''
          onSearchChange={() => {}}
        />
        <main className='home-main-content'>
          {/* Banner Section */}
          <div className='relative h-64 md:h-80 lg:h-96 overflow-hidden'>
            <div
              className='w-full h-full bg-cover bg-center'
              style={{
                backgroundImage: profile.banner
                  ? `url(${getImageUrl(profile.banner)})`
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              <div className='absolute inset-0 bg-black/30'></div>
            </div>
            {/* Banner Upload (Owner Only) */}
            {isOwner && (
              <button
                onClick={() => bannerInputRef.current?.click()}
                disabled={uploadingBanner}
                className='absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all'
              >
                {uploadingBanner ? (
                  <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                ) : (
                  <Camera size={18} />
                )}
                <span className='hidden md:inline'>Changer la bannière</span>
              </button>
            )}
            <input
              ref={bannerInputRef}
              type='file'
              accept='image/*'
              onChange={handleBannerUpload}
              className='hidden'
            />
          </div>

          {/* Profile Info Section */}
          <div className='max-w-6xl mx-auto px-4 -mt-20 md:-mt-24 relative z-10'>
            <div className='bg-[#141414] border border-[#262626] rounded-2xl p-6 md:p-8'>
              <div className='flex flex-col md:flex-row items-center md:items-end gap-6'>
                {/* Avatar */}
                <div className='relative group'>
                  <div className='w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-[#141414] shadow-2xl'>
                    {profile.image ? (
                      <img
                        src={getImageUrl(profile.image)}
                        alt={`${profile.prenom} ${profile.nom}`}
                        className='w-full h-full object-cover'
                        onError={e => {
                          e.target.style.display = 'none'
                          e.target.nextElementSibling.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl md:text-4xl font-bold ${
                        profile.image ? 'hidden' : 'flex'
                      }`}
                    >
                      {getInitials(profile)}
                    </div>
                  </div>
                  {/* Avatar Upload (Owner Only) */}
                  {isOwner && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className='absolute bottom-2 right-2 bg-white text-black p-2 rounded-full shadow-lg hover:scale-110 transition-transform'
                    >
                      {uploadingImage ? (
                        <div className='w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin'></div>
                      ) : (
                        <Camera size={18} />
                      )}
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type='file'
                    accept='image/*'
                    onChange={handleImageUpload}
                    className='hidden'
                  />
                </div>

                {/* Name & Basic Info */}
                <div className='flex-1 text-center md:text-left'>
                  <div className='flex flex-col md:flex-row md:items-center gap-3 mb-2'>
                    <h1 className='text-2xl md:text-3xl font-bold text-white'>
                      {profile.prenom} {profile.nom}
                    </h1>
                    {profile.role && (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium w-fit mx-auto md:mx-0 ${
                          profile.role === 'admin'
                            ? 'bg-red-500/20 text-red-400'
                            : profile.role === 'mod'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {profile.role === 'admin'
                          ? '★ Administrateur'
                          : profile.role === 'mod'
                          ? '★ Modérateur'
                          : 'Utilisateur'}
                      </span>
                    )}
                  </div>
                  {!isEditing ? (
                    <>
                      {profile.bio && (
                        <p className='text-gray-400 mb-3 max-w-2xl'>
                          {profile.bio}
                        </p>
                      )}
                      <div className='flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500'>
                        {profile.location && (
                          <div className='flex items-center gap-1'>
                            <MapPin size={14} />
                            <span>{profile.location}</span>
                          </div>
                        )}
                        {profile.website && (
                          <a
                            href={
                              profile.website.startsWith('http')
                                ? profile.website
                                : `https://${profile.website}`
                            }
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex items-center gap-1 hover:text-white transition-colors'
                          >
                            <LinkIcon size={14} />
                            <span>
                              {profile.website.replace(/^https?:\/\//, '')}
                            </span>
                          </a>
                        )}
                        <div className='flex items-center gap-1'>
                          <Calendar size={14} />
                          <span>
                            Membre depuis {formatDate(profile.created_at)}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className='space-y-3 max-w-2xl mx-auto md:mx-0'>
                      <input
                        type='text'
                        value={editData.bio || ''}
                        onChange={e =>
                          setEditData(prev => ({
                            ...prev,
                            bio: e.target.value
                          }))
                        }
                        placeholder='Votre bio...'
                        className='w-full px-3 py-2 bg-[#262626] border border-[#262626] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-500'
                      />
                      <div className='flex gap-3'>
                        <input
                          type='text'
                          value={editData.location || ''}
                          onChange={e =>
                            setEditData(prev => ({
                              ...prev,
                              location: e.target.value
                            }))
                          }
                          placeholder='Localisation'
                          className='flex-1 px-3 py-2 bg-[#262626] border border-[#262626] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-500'
                        />
                        <input
                          type='text'
                          value={editData.website || ''}
                          onChange={e =>
                            setEditData(prev => ({
                              ...prev,
                              website: e.target.value
                            }))
                          }
                          placeholder='Site web'
                          className='flex-1 px-3 py-2 bg-[#262626] border border-[#262626] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-500'
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className='flex gap-3'>
                  {isOwner ? (
                    !isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className='px-6 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center gap-2'
                      >
                        <Edit2 size={18} />
                        Modifier
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setIsEditing(false)
                            setEditData({
                              nom: profile.nom,
                              prenom: profile.prenom,
                              bio: profile.bio || '',
                              location: profile.location || '',
                              website: profile.website || '',
                              sexe: profile.sexe || ''
                            })
                          }}
                          className='px-6 py-2 bg-[#262626] text-white rounded-lg font-medium hover:bg-[#363636] transition-all flex items-center gap-2'
                        >
                          <X size={18} />
                          Annuler
                        </button>
                        <button
                          onClick={handleSaveProfile}
                          className='px-6 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center gap-2'
                        >
                          <Save size={18} />
                          Enregistrer
                        </button>
                      </>
                    )
                  ) : (
                    <>
                      {profile.is_friend ? (
                        <button
                          onClick={handleRemoveFriend}
                          className='px-6 py-2 bg-[#262626] text-white rounded-lg font-medium hover:bg-red-500/20 hover:text-red-400 transition-all flex items-center gap-2'
                        >
                          <UserX size={18} />
                          Retirer
                        </button>
                      ) : profile.has_pending_request ? (
                        <>
                          <button
                            onClick={handleAcceptRequest}
                            className='px-6 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center gap-2'
                          >
                            <UserCheck size={18} />
                            Accepter
                          </button>
                          <button
                            onClick={handleRemoveFriend}
                            className='px-6 py-2 bg-[#262626] text-white rounded-lg font-medium hover:bg-[#363636] transition-all flex items-center gap-2'
                          >
                            <X size={18} />
                            Refuser
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleSendRequest}
                          className='px-6 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center gap-2'
                        >
                          <UserPlus size={18} />
                          Ajouter
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-[#262626]'>
                <div className='text-center p-4 bg-[#1f1f1f] rounded-xl'>
                  <div className='flex items-center justify-center gap-2 text-gray-400 mb-2'>
                    <FileText size={20} />
                    <span className='text-sm'>Publications</span>
                  </div>
                  <div className='text-2xl md:text-3xl font-bold text-white'>
                    {profile.stats.posts}
                  </div>
                </div>
                <div className='text-center p-4 bg-[#1f1f1f] rounded-xl'>
                  <div className='flex items-center justify-center gap-2 text-gray-400 mb-2'>
                    <Users size={20} />
                    <span className='text-sm'>Amis</span>
                  </div>
                  <div className='text-2xl md:text-3xl font-bold text-white'>
                    {profile.stats.friends}
                  </div>
                </div>
                <div className='text-center p-4 bg-[#1f1f1f] rounded-xl'>
                  <div className='flex items-center justify-center gap-2 text-gray-400 mb-2'>
                    <Heart size={20} />
                    <span className='text-sm'>Likes reçus</span>
                  </div>
                  <div className='text-2xl md:text-3xl font-bold text-white'>
                    {profile.stats.likes_received}
                  </div>
                </div>
                <div className='text-center p-4 bg-[#1f1f1f] rounded-xl'>
                  <div className='flex items-center justify-center gap-2 text-gray-400 mb-2'>
                    <MessageCircle size={20} />
                    <span className='text-sm'>Commentaires</span>
                  </div>
                  <div className='text-2xl md:text-3xl font-bold text-white'>
                    {profile.stats.comments_received}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className='mt-6'>
              <div className='flex gap-2 mb-6 overflow-x-auto'>
                {[
                  { id: 'posts', label: 'Publications', icon: FileText },
                  {
                    id: 'friends',
                    label: 'Amis',
                    icon: Users,
                    count: profile.recent_friends?.length
                  },
                  { id: 'about', label: 'À propos', icon: MapPin }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-white text-black'
                        : 'bg-[#141414] text-gray-400 hover:text-white border border-[#262626]'
                    }`}
                  >
                    <tab.icon size={18} />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && tab.count > 0 && (
                      <span className='bg-[#262626] px-2 py-0.5 rounded-full text-xs'>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className='bg-[#141414] border border-[#262626] rounded-2xl p-6 min-h-96'>
                {activeTab === 'posts' && (
                  <div className='space-y-4'>
                    {posts.length === 0 ? (
                      <div className='text-center py-12 text-gray-400'>
                        <FileText
                          size={48}
                          className='mx-auto mb-4 opacity-50'
                        />
                        <p>Aucune publication pour le moment</p>
                      </div>
                    ) : (
                      posts.map(post => (
                        <div
                          key={post.id}
                          className='bg-[#1f1f1f] rounded-xl p-4'
                        >
                          <p className='text-white mb-3'>{post.description}</p>
                          {post.image && (
                            <img
                              src={getImageUrl(post.image)}
                              alt='Post'
                              className='w-full max-h-96 object-cover rounded-lg mb-3'
                            />
                          )}
                          <div className='flex gap-4 text-sm text-gray-400'>
                            <span className='flex items-center gap-1'>
                              <Heart size={14} /> {post.likes_count}
                            </span>
                            <span className='flex items-center gap-1'>
                              <MessageCircle size={14} /> {post.comments_count}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
                {activeTab === 'friends' && (
                  <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                    {profile.recent_friends?.length > 0 ? (
                      profile.recent_friends.map(friend => (
                        <div
                          key={friend.id}
                          className='bg-[#1f1f1f] rounded-xl p-4 text-center hover:bg-[#262626] transition-all cursor-pointer'
                        >
                          <div className='w-16 h-16 mx-auto rounded-full overflow-hidden mb-3'>
                            {friend.image ? (
                              <img
                                src={getImageUrl(friend.image)}
                                alt={`${friend.prenom} ${friend.nom}`}
                                className='w-full h-full object-cover'
                              />
                            ) : (
                              <div className='w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold'>
                                {getInitials(friend)}
                              </div>
                            )}
                          </div>
                          <p className='text-white font-medium text-sm truncate'>
                            {friend.prenom} {friend.nom}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className='col-span-full text-center py-12 text-gray-400'>
                        <Users size={48} className='mx-auto mb-4 opacity-50' />
                        <p>Aucun ami à afficher</p>
                      </div>
                    )}
                  </div>
                )}
                {activeTab === 'about' && (
                  <div className='space-y-6'>
                    <div>
                      <h3 className='text-lg font-semibold text-white mb-3'>
                        Informations
                      </h3>
                      <div className='grid md:grid-cols-2 gap-4'>
                        <div className='bg-[#1f1f1f] rounded-xl p-4'>
                          <div className='text-gray-400 text-sm mb-1'>
                            Nom complet
                          </div>
                          <div className='text-white'>
                            {profile.prenom} {profile.nom}
                          </div>
                        </div>
                        <div className='bg-[#1f1f1f] rounded-xl p-4'>
                          <div className='text-gray-400 text-sm mb-1'>
                            Email
                          </div>
                          <div className='text-white'>{profile.email}</div>
                        </div>
                        {profile.location && (
                          <div className='bg-[#1f1f1f] rounded-xl p-4'>
                            <div className='text-gray-400 text-sm mb-1 flex items-center gap-2'>
                              <MapPin size={14} /> Localisation
                            </div>
                            <div className='text-white'>{profile.location}</div>
                          </div>
                        )}
                        {profile.website && (
                          <div className='bg-[#1f1f1f] rounded-xl p-4'>
                            <div className='text-gray-400 text-sm mb-1 flex items-center gap-2'>
                              <LinkIcon size={14} /> Site web
                            </div>
                            <a
                              href={
                                profile.website.startsWith('http')
                                  ? profile.website
                                  : `https://${profile.website}`
                              }
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-white hover:underline'
                            >
                              {profile.website}
                            </a>
                          </div>
                        )}
                        <div className='bg-[#1f1f1f] rounded-xl p-4'>
                          <div className='text-gray-400 text-sm mb-1 flex items-center gap-2'>
                            <Calendar size={14} /> Membre depuis
                          </div>
                          <div className='text-white'>
                            {formatDate(profile.created_at)}
                          </div>
                        </div>
                        {profile.mutual_friends_count > 0 && (
                          <div className='bg-[#1f1f1f] rounded-xl p-4'>
                            <div className='text-gray-400 text-sm mb-1 flex items-center gap-2'>
                              <Users size={14} /> Amis mutuels
                            </div>
                            <div className='text-white'>
                              {profile.mutual_friends_count}
                            </div>
                          </div>
                        )}
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
