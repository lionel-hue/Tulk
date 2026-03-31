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

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1)
    } else {
      navigate('/home')
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
      }
    } catch (error) {
      console.error('Error liking profile:', error)
    }
  }

  const handleFollow = async userId => {
    try {
      const response = await api.post(`/profile/${userId}/follow`)
      if (response.data.success) {
        setResults(
          results.map(u => (u.id === userId ? { ...u, is_following: true } : u))
        )
      }
    } catch (error) {
      console.error('Error following user:', error)
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
      }
    } catch (error) {
      console.error('Error unfollowing user:', error)
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
    <div className='section-content active animate-in fade-in slide-in-from-bottom-4 duration-500'>
      <div className='max-w-6xl mx-auto px-4 py-8'>
        <div className='flex items-center justify-between mb-8 pb-6 border-b border-white/5'>
          <div className='flex items-center gap-6'>
            <button
              onClick={handleBack}
              className='p-3 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-white hover:bg-white/10 transition-all group shadow-xl'
              title='Retour'
            >
              <X size={22} className='group-hover:-translate-x-1 transition-transform duration-300' />
            </button>
            <div>
              <h2 className='text-3xl font-black text-white tracking-tight leading-none'>
                Résultats pour <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400'>"{query}"</span>
              </h2>
              <p className='text-gray-500 text-sm mt-2 font-medium'>
                {results.length} utilisateur{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''} sur Tulk
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className='flex flex-col items-center justify-center py-24'>
            <div className='relative'>
              <div className='w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin'></div>
              <div className='absolute inset-0 flex items-center justify-center'>
                <Loader2 size={24} className='text-purple-400 animate-pulse' />
              </div>
            </div>
            <p className='text-gray-400 mt-6 font-medium animate-pulse text-lg'>Recherche en cours...</p>
          </div>
        ) : results.length === 0 ? (
          <div className='text-center py-20 bg-[#0f0f0f] border border-[#262626] rounded-3xl shadow-2xl'>
            <div className='w-24 h-24 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6'>
              <Users size={48} className='text-purple-400/50' />
            </div>
            <h3 className='text-2xl font-bold text-white mb-3'>Aucun résultat</h3>
            <p className='text-gray-500 max-w-sm mx-auto'>
              Nous n'avons trouvé aucun utilisateur correspondant à "{query}". Essayez un autre nom ou email.
            </p>
            <button 
              onClick={handleBack}
              className='mt-8 px-6 py-3 bg-white text-black rounded-xl font-bold hover:scale-105 active:scale-95 transition-all'
            >
              Fermer la recherche
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {results.map((userData, index) => (
              <div
                key={userData.id}
                className='bg-[#141414] border border-[#262626] rounded-3xl p-6 hover:border-purple-500/30 transition-all hover:shadow-2xl hover:shadow-purple-500/5 group animate-in slide-in-from-bottom-8 duration-500'
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className='flex items-start gap-5 mb-6'>
                  <Link
                    to={`/profile/${userData.id}`}
                    className='w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 relative group-hover:scale-105 transition-transform duration-300 ring-2 ring-transparent group-hover:ring-purple-500/30'
                  >
                    <Avatar user={userData} size='w-full h-full' />
                  </Link>
                  <div className='flex-1 min-w-0'>
                    <Link
                      to={`/profile/${userData.id}`}
                      className='block'
                    >
                      <h3 className='text-white font-bold text-xl truncate group-hover:text-purple-400 transition-colors'>
                        {userData.prenom} {userData.nom}
                      </h3>
                    </Link>
                    <p className='text-gray-500 text-sm truncate mb-3'>
                      @{userData.email?.split('@')[0]}
                    </p>
                    <div className='flex flex-wrap gap-2'>
                        {userData.role === 'admin' && (
                           <span className='px-2 py-0.5 bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider rounded-md border border-red-500/20'>Admin</span>
                        )}
                        {userData.mutual_friends > 0 && (
                           <span className='px-2 py-0.5 bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase tracking-wider rounded-md border border-purple-500/20'>{userData.mutual_friends} ami(s) commun(s)</span>
                        )}
                    </div>
                  </div>
                </div>

                {userData.bio && (
                  <p className='text-gray-400 text-sm mb-6 line-clamp-2 italic'>
                    "{userData.bio}"
                  </p>
                )}

                <div className='grid grid-cols-2 gap-3 mb-6'>
                  <div className='bg-[#0d0d0d] p-3 rounded-2xl border border-[#1a1a1a] flex flex-col items-center justify-center transition-colors group-hover:border-purple-500/10'>
                    <span className='text-white font-bold text-lg'>{userData.posts_count || 0}</span>
                    <span className='text-gray-500 text-[10px] uppercase font-semibold'>Posts</span>
                  </div>
                  <div className='bg-[#0d0d0d] p-3 rounded-2xl border border-[#1a1a1a] flex flex-col items-center justify-center transition-colors group-hover:border-purple-500/10'>
                    <span className='text-white font-bold text-lg'>{userData.followers_count || 0}</span>
                    <span className='text-gray-500 text-[10px] uppercase font-semibold'>Followers</span>
                  </div>
                </div>

                <div className='flex gap-2'>
                  {userData.id === user.id ? (
                    <Link
                      to='/profile'
                      className='w-full py-3 bg-purple-500/10 text-purple-400 rounded-2xl text-center font-bold border border-purple-500/20 hover:bg-purple-500/20 transition-all'
                    >
                      C'est vous
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={() => handleLikeProfile(userData.id)}
                        className={`flex-1 flex flex-col items-center justify-center py-3 rounded-2xl transition-all border ${
                          userData.has_liked_profile
                            ? 'bg-red-500/10 border-red-500/20 text-red-500 shadow-lg shadow-red-500/10'
                            : 'bg-[#1a1a1a] border-transparent text-gray-500 hover:text-red-400 hover:bg-red-500/5'
                        }`}
                      >
                        <Heart
                          size={18}
                          fill={userData.has_liked_profile ? 'currentColor' : 'none'}
                        />
                      </button>

                      <button
                        onClick={() =>
                          userData.is_following
                            ? handleUnfollow(userData.id)
                            : handleFollow(userData.id)
                        }
                        className={`flex-[2] py-3 rounded-2xl font-bold text-sm transition-all border ${
                          userData.is_following
                            ? 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                            : 'bg-white text-black hover:bg-gray-200'
                        }`}
                      >
                        {userData.is_following ? 'Abonné' : "S'abonner"}
                      </button>

                      {userData.is_friend ? (
                        <button
                          onClick={() => navigate(`/messages?userId=${userData.id}`)}
                          className='p-3 bg-[#1a1a1a] text-gray-400 hover:text-white rounded-2xl transition-all'
                        >
                          <MessageCircle size={20} />
                        </button>
                      ) : userData.has_pending_request ? (
                        <div className='p-3 bg-yellow-500/10 text-yellow-500 rounded-2xl border border-yellow-500/20 animate-pulse'>
                          <Loader2 size={18} className='animate-spin' />
                        </div>
                      ) : (
                        <button
                          onClick={() => handleSendFriendRequest(userData.id)}
                          className='p-3 bg-[#1a1a1a] text-gray-400 hover:text-purple-400 rounded-2xl hover:bg-purple-500/5 hover:border-purple-500/20 border border-transparent transition-all'
                        >
                          <UserPlus size={20} />
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
