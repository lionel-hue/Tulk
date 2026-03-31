import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../utils/api'
import Modal, { useModal } from '../Modal'
import {
  UserPlus,
  UserCheck,
  UserX,
  Heart,
  MessageCircle,
  Users,
  FileText,
  X,
  Loader2
} from 'lucide-react'
import Avatar from '../common/Avatar'

const SearchResults = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { modal, setModal } = useModal()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const searchQuery = searchParams.get('q')
    if (searchQuery && searchQuery.trim().length >= 2) {
      setQuery(searchQuery)
      handleSearch(searchQuery)
    }
  }, [searchParams])

  const handleSearch = async searchQuery => {
    setLoading(true)
    try {
      const response = await api.get(
        `/friends/search?query=${encodeURIComponent(searchQuery)}`
      )
      if (response.data.success) {
        setResults(response.data.users)
      }
    } catch (error) {
      setModal({
        show: true,
        type: 'error',
        title: 'Erreur',
        message: "Impossible d'effectuer la recherche"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLikeProfile = async userId => {
    try {
      const response = await api.post(`/profile/${userId}/like`)
      if (response.data.success) {
        setResults(
          results.map(u =>
            u.id === userId
              ? {
                  ...u,
                  has_liked_profile: response.data.liked,
                  profile_likes_count: response.data.likes_count
                }
              : u
          )
        )
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
    }
  }

  const handleFollow = async userId => {
    try {
      const response = await api.post(`/profile/${userId}/follow`)
      if (response.data.success) {
        setResults(
          results.map(u => (u.id === userId ? { ...u, is_following: true } : u))
        )
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
    }
  }

  const handleUnfollow = async userId => {
    try {
      const response = await api.delete(`/profile/${userId}/follow`)
      if (response.data.success) {
        setResults(
          results.map(u =>
            u.id === userId ? { ...u, is_following: false } : u
          )
        )
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
    }
  }

  const handleSendFriendRequest = async userId => {
    try {
      const response = await api.post('/friends/request', { user_id: userId })
      if (response.data.success) {
        setResults(
          results.map(u =>
            u.id === userId ? { ...u, has_pending_request: true } : u
          )
        )
        setModal({
          show: true,
          type: 'success',
          title: 'Succès',
          message: "Demande d'amitié envoyée!"
        })
      }
    } catch (error) {
      setModal({
        show: true,
        type: 'error',
        title: 'Erreur',
        message:
          error.response?.data?.message ||
          "Erreur lors de l'envoi de la demande"
      })
    }
  }

  return (
    <div className='section-content active'>
      <div className='max-w-4xl mx-auto'>
        <div className='section-header mb-6'>
          <div className='flex items-center gap-3'>
            <h2>Résultats pour "{query}"</h2>
            <span className='text-gray-400'>
              {results.length} utilisateur(s)
            </span>
          </div>
          <button
            onClick={() => navigate('/home')}
            className='p-2 text-gray-400 hover:text-white transition-colors'
          >
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div className='text-center py-12'>
            <Loader2 className='h-8 w-8 animate-spin mx-auto text-gray-400 mb-4' />
            <p className='text-gray-400'>Recherche en cours...</p>
          </div>
        ) : results.length === 0 ? (
          <div className='text-center py-12 bg-[#141414] border border-[#262626] rounded-xl'>
            <Users size={48} className='mx-auto text-gray-400 mb-4' />
            <h3 className='text-lg font-semibold text-white mb-2'>
              Aucun résultat
            </h3>
            <p className='text-gray-400'>
              Aucun utilisateur trouvé pour cette recherche
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {results.map(userData => (
              <div
                key={userData.id}
                className='bg-[#141414] border border-[#262626] rounded-xl p-4'
              >
                <div className='flex items-start gap-4 mb-4'>
                  <Link
                    to={`/profile/${userData.id}`}
                    className='w-16 h-16 rounded-full overflow-hidden flex-shrink-0 relative hover:opacity-80 transition-opacity'
                  >
                    <Avatar user={userData} size='w-full h-full' />
                  </Link>
                  <div className='flex-1 min-w-0'>
                    <Link
                      to={`/profile/${userData.id}`}
                      className='hover:text-purple-400 transition-colors'
                    >
                      <h3 className='text-white font-semibold text-lg truncate'>
                        {userData.prenom} {userData.nom}
                      </h3>
                    </Link>
                    <p className='text-gray-400 text-sm truncate'>
                      {userData.email}
                    </p>
                    {userData.bio && (
                      <p className='text-gray-500 text-sm mt-1 line-clamp-2'>
                        {userData.bio}
                      </p>
                    )}
                    {userData.location && (
                      <p className='text-gray-500 text-xs mt-1'>
                        📍 {userData.location}
                      </p>
                    )}
                  </div>
                </div>

                <div className='flex gap-4 mb-4 text-sm'>
                  <div className='flex items-center gap-1 text-gray-400'>
                    <FileText size={14} />
                    <span>{userData.posts_count || 0} posts</span>
                  </div>
                  <div className='flex items-center gap-1 text-gray-400'>
                    <Users size={14} />
                    <span>{userData.followers_count || 0} followers</span>
                  </div>
                  {userData.mutual_friends > 0 && (
                    <div className='flex items-center gap-1 text-purple-400'>
                      <UserCheck size={14} />
                      <span>{userData.mutual_friends} ami(s) mutuel(s)</span>
                    </div>
                  )}
                </div>

                <div className='flex gap-2 flex-wrap'>
                  {userData.id === user.id ? (
                    <div className='w-full text-center py-2 bg-purple-500/10 text-purple-400 rounded-lg text-sm font-medium border border-purple-500/20'>
                      C'est vous
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => handleLikeProfile(userData.id)}
                        className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                          userData.has_liked_profile
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-[#262626] text-gray-400 hover:text-white'
                        }`}
                      >
                        <Heart
                          size={16}
                          fill={
                            userData.has_liked_profile ? 'currentColor' : 'none'
                          }
                        />
                        {userData.has_liked_profile ? 'Liké' : 'Liker'}
                      </button>

                      <button
                        onClick={() =>
                          userData.is_following
                            ? handleUnfollow(userData.id)
                            : handleFollow(userData.id)
                        }
                        className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                          userData.is_following
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            : 'bg-[#262626] text-gray-400 hover:text-white'
                        }`}
                      >
                        <UserCheck size={16} />
                        {userData.is_following ? 'Abonné' : "S'abonner"}
                      </button>

                      {userData.is_friend ? (
                        <button
                          onClick={() =>
                            navigate(`/messages?userId=${userData.id}`)
                          }
                          className='px-3 py-2 bg-[#262626] text-gray-400 hover:text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all'
                        >
                          <MessageCircle size={16} />
                          Message
                        </button>
                      ) : userData.has_pending_request ? (
                        <div className='px-3 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg font-medium text-sm flex items-center gap-2'>
                          <Loader2 size={16} className='animate-spin' />
                          En attente
                        </div>
                      ) : (
                        <button
                          onClick={() => handleSendFriendRequest(userData.id)}
                          className='px-3 py-2 bg-white text-black rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition-all'
                        >
                          <UserPlus size={16} />
                          Ami
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchResults
