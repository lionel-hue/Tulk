import React, { useState, useEffect, useRef } from 'react'
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
  Loader2,
  Clock
} from 'lucide-react'
import Avatar from '../common/Avatar'
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'

const SearchResults = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { modal, setModal } = useModal()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  
  // Pagination
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  const loadMore = () => {
    if (hasMore && !loadingMore) {
      handleSearch(query, page + 1, true)
    }
  }

  const { sentinelRef } = useInfiniteScroll(loadMore, hasMore, loadingMore)

  useEffect(() => {
    const searchQuery = searchParams.get('q')
    if (searchQuery && searchQuery.trim().length >= 2) {
      setQuery(searchQuery)
      setPage(1)
      setResults([])
      handleSearch(searchQuery, 1, false)
    }
  }, [searchParams])

  const handleSearch = async (searchQuery, pageNum = 1, append = false) => {
    if (pageNum === 1) {
      setLoading(true)
    } else {
      setLoadingMore(true)
    }
    
    try {
      const response = await api.get(
        `/friends/search?query=${encodeURIComponent(searchQuery)}&page=${pageNum}`
      )
      if (response.data.success) {
        const newResults = response.data.users
        if (append) {
          setResults(prev => [...prev, ...newResults])
        } else {
          setResults(newResults)
        }
        setPage(pageNum)
        // Assuming search returns 12 per page (it's hardcoded in controller as 12)
        setHasMore(newResults.length === 12)
      }
    } catch (error) {
      console.error('Search error:', error)
      if (pageNum === 1) {
        setModal({
          show: true,
          type: 'error',
          title: 'Erreur',
          message: "Impossible d'effectuer la recherche"
        })
      }
    } finally {
      setLoading(false)
      setLoadingMore(false)
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

  const handleAcceptRequest = async userId => {
    try {
      const response = await api.post('/friends/accept', { user_id: userId })
      if (response.data.success) {
        setResults(
          results.map(u =>
            u.id === userId ? { ...u, is_friend: true, has_pending_request: false, is_received_request: false } : u
          )
        )
        setModal({
          show: true,
          type: 'success',
          title: 'Succès',
          message: 'Demande d\'amitié acceptée !'
        })
      }
    } catch (error) {
      setModal({
        show: true,
        type: 'error',
        title: 'Erreur',
        message: error.response?.data?.message || "Erreur lors de l'acceptation"
      })
    }
  }

  return (
    <div className='search-results-page min-h-screen selection:bg-purple-500/30'>
      <div className='max-w-7xl mx-auto px-4 py-12 md:px-8'>
        {/* Header Section with Glass Effect */}
        <div className='relative mb-12 animate-in fade-in slide-in-from-top-8 duration-1000'>
          <div className='bg-[var(--glass-overlay)] backdrop-blur-3xl border border-[var(--glass-border)] rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group'>
             {/* Decorative Background Gradients */}
             <div className='absolute -top-24 -right-24 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] group-hover:bg-purple-600/20 transition-all duration-1000'></div>
             <div className='absolute -bottom-24 -left-24 w-64 h-64 bg-pink-600/10 rounded-full blur-[100px] group-hover:bg-pink-600/20 transition-all duration-1000'></div>

             <div className='relative flex flex-col md:flex-row items-center justify-between gap-8'>
                <div className='flex items-center gap-8'>
                  <button
                    onClick={handleBack}
                    className='w-16 h-16 border rounded-[1.5rem] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] hover:scale-110 active:scale-95 transition-all shadow-xl group/back border-[var(--border-color)] bg-[var(--bg-input)]'
                    title='Retour'
                  >
                    <X size={28} className='group-hover:rotate-90 transition-transform duration-500' />
                  </button>
                  <div>
                    <h2 className='text-4xl md:text-6xl font-black text-[var(--text-primary)] tracking-tighter leading-none'>
                      Résultats pour <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 animate-gradient-x'>"{query}"</span>
                    </h2>
                    <p className='text-[var(--text-secondary)] text-sm mt-4 font-black uppercase tracking-[0.3em]'>
                      {results.length} membre{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''} sur le réseau
                    </p>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className='flex flex-col items-center justify-center py-32 animate-in fade-in duration-500'>
            <div className='relative'>
              <div className='w-24 h-24 border-4 border-purple-500/10 border-t-purple-500 rounded-full animate-spin'></div>
              <div className='absolute inset-0 flex items-center justify-center opacity-50'>
                <Loader2 size={32} className='text-purple-400 animate-pulse' />
              </div>
            </div>
            <p className='text-[var(--text-secondary)] mt-8 font-black uppercase tracking-[0.4em] animate-pulse'>Symphonie de recherche...</p>
          </div>
        ) : results.length === 0 ? (
          <div className='max-w-2xl mx-auto text-center py-24 bg-[var(--bg-card)] border border-dashed border-[var(--border-color)] rounded-[4rem] shadow-2xl animate-in zoom-in-95 duration-700'>
            <div className='w-32 h-32 bg-[var(--bg-input)] rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner'>
              <Users size={56} className='text-[var(--text-secondary)]' />
            </div>
            <h3 className='text-3xl font-black text-[var(--text-primary)] mb-4 tracking-tight'>Silence dans le vide...</h3>
            <p className='text-[var(--text-secondary)] max-w-sm mx-auto font-medium leading-relaxed italic'>
              Aucun membre ne semble correspondre à votre requête. Essayez un autre mot-clé pour explorer Tulk.
            </p>
            <button 
              onClick={handleBack}
              className='mt-10 px-10 py-4 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-[1.5rem] font-black text-sm tracking-widest hover:scale-110 active:scale-95 transition-all shadow-2xl hover:opacity-80'
            >
              RÉESSAYER
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {results.map((userData, index) => (
              <div
                key={userData.id}
                className='group relative bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[3rem] p-8 hover:border-purple-500/30 transition-all duration-700 hover:-translate-y-2 animate-in slide-in-from-bottom-12 duration-1000 fill-mode-both overflow-hidden'
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Decorative Slide-in Background */}
                <div className='absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000'></div>

                <div className='relative flex items-center gap-6 mb-8'>
                  <Link
                    to={`/profile/${userData.id}`}
                    className='w-24 h-24 rounded-[2rem] overflow-hidden flex-shrink-0 relative group-hover:rotate-6 group-hover:scale-110 transition-transform duration-700 border-2 border-[var(--border-muted)] shadow-2xl'
                  >
                    <Avatar user={userData} size='w-full h-full' className='object-cover' />
                  </Link>
                  <div className='flex-1 min-w-0'>
                    <Link
                      to={`/profile/${userData.id}`}
                      className='block'
                    >
                      <h3 className='text-[var(--text-primary)] font-black text-2xl tracking-tighter truncate transition-colors duration-500'>
                        {userData.prenom} {userData.nom}
                      </h3>
                    </Link>
                    <p className='text-[var(--text-secondary)] text-xs font-bold uppercase tracking-widest truncate mt-1'>
                      @{userData.email?.split('@')[0]}
                    </p>
                    <div className='flex flex-wrap gap-2 mt-3'>
                        {userData.role === 'admin' && (
                           <span className='px-3 py-1 bg-red-500/10 text-red-500 text-[8px] font-black uppercase tracking-widest rounded-full border border-red-500/20'>Admin</span>
                        )}
                        {userData.mutual_friends > 0 && (
                           <span className='px-3 py-1 bg-purple-500/10 text-purple-400 text-[8px] font-black uppercase tracking-widest rounded-full border border-purple-500/20'>{userData.mutual_friends} Mutuels</span>
                        )}
                    </div>
                  </div>
                </div>

                {userData.bio && (
                  <p className='text-[var(--text-secondary)] text-sm mb-8 line-clamp-2 italic font-medium leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity'>
                    "{userData.bio}"
                  </p>
                )}

                {/* Stats Preview Card */}
                <div className='grid grid-cols-2 gap-4 mb-8 bg-[var(--bg-input)] p-4 rounded-[2rem] border border-[var(--border-muted)] group-hover:border-[var(--border-color)] transition-all'>
                  <div className='text-center p-2'>
                    <div className='text-2xl font-black text-[var(--text-primary)] group-hover:scale-110 transition-transform duration-500'>{userData.posts_count || 0}</div>
                    <div className='text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]'>Posts</div>
                  </div>
                  <div className='text-center p-2 border-l border-[var(--border-muted)]'>
                    <div className='text-2xl font-black text-[var(--text-primary)] group-hover:scale-110 transition-transform duration-500'>{userData.followers_count || 0}</div>
                    <div className='text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]'>Followers</div>
                  </div>
                </div>

                <div className='flex gap-3 relative z-10'>
                  {userData.id === user.id ? (
                    <Link
                      to='/profile'
                      className='w-full py-4 bg-[var(--bg-input)] text-[var(--text-primary)] border-[var(--border-muted)] hover:border-[var(--border-color)] rounded-[1.5rem] text-center font-black text-xs tracking-widest border transition-all'
                    >
                      MON PROFIL
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={() => handleLikeProfile(userData.id)}
                        className={`p-4 rounded-2xl transition-all hover:scale-110 active:scale-90 border ${
                          userData.has_liked_profile
                            ? 'bg-red-500 text-white border-red-400 shadow-xl shadow-red-500/30'
                            : 'bg-[var(--bg-input)] border-[var(--border-muted)] text-[var(--text-secondary)] hover:text-red-500 hover:border-[var(--border-color)] hover:bg-[var(--bg-hover)]'
                        }`}
                      >
                        <Heart
                          size={20}
                          fill={userData.has_liked_profile ? 'currentColor' : 'none'}
                        />
                      </button>

                      <button
                        onClick={() =>
                          userData.is_following
                            ? handleUnfollow(userData.id)
                            : handleFollow(userData.id)
                        }
                        className={`flex-1 py-4 rounded-2xl font-black text-[10px] tracking-[0.15em] transition-all border ${
                          userData.is_following
                            ? 'bg-[var(--bg-input)] border-[var(--border-muted)] text-[var(--text-primary)]'
                            : 'bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-80 shadow-2xl'
                        }`}
                      >
                        {userData.is_following ? 'ABONNÉ' : "S'ABONNER"}
                      </button>

                      {userData.is_friend ? (
                        <button
                          onClick={() => navigate(`/messages?userId=${userData.id}`)}
                          className='p-4 bg-[var(--bg-input)] text-[var(--text-secondary)] hover:text-purple-400 rounded-2xl border border-[var(--border-muted)] hover:border-[var(--border-color)] transition-all'
                          title='Chatter'
                        >
                          <MessageCircle size={20} />
                        </button>
                      ) : userData.is_received_request ? (
                        <button
                          onClick={() => handleAcceptRequest(userData.id)}
                          className='p-4 bg-green-600 text-white rounded-2xl shadow-xl shadow-green-600/20 hover:scale-110 active:scale-95 transition-all'
                          title='Accepter la demande'
                        >
                          <UserCheck size={20} />
                        </button>
                      ) : userData.has_pending_request ? (
                        <div 
                          className='p-4 bg-yellow-500/20 text-yellow-500 rounded-2xl border border-yellow-500/30'
                          title='Demande envoyée'
                        >
                          <Clock size={20} className='animate-pulse' />
                        </div>
                      ) : (
                        <button
                          onClick={() => handleSendFriendRequest(userData.id)}
                          className='p-4 bg-purple-600 text-white rounded-2xl shadow-xl shadow-purple-600/20 hover:scale-110 active:scale-95 transition-all'
                          title="Ajouter l'ami"
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
        
        {/* Infinite Scroll Sentinel */}
        {hasMore && (
          <div ref={sentinelRef} className='py-12 flex justify-center'>
            <div className='w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin'></div>
          </div>
        )}
      </div>
      <Modal modal={modal} setModal={setModal} />
    </div>
  )
}

export default SearchResults
