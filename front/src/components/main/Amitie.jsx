import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../utils/api'
import Modal, { useModal } from '../Modal'
import {
  UserPlus,
  UserCheck,
  UserX,
  Users,
  UserCog,
  Search,
  X,
  MessageCircle,
  Check,
  Clock,
  MapPin,
  Heart,
  FileText,
  UserMinus
} from 'lucide-react'
import Avatar from '../common/Avatar'

/* ─── Skeleton card placeholder ─────────────────────────────────── */
const SkeletonCard = () => (
  <div className='bg-[#0f0f0f] border border-white/5 rounded-[2rem] overflow-hidden animate-pulse'>
    <div className='h-28 bg-white/5'></div>
    <div className='p-5'>
      <div className='flex items-center gap-3 -mt-10 mb-4'>
        <div className='w-16 h-16 rounded-2xl bg-white/10 border-2 border-[#0f0f0f] flex-shrink-0'></div>
        <div className='mt-8 flex-1'>
          <div className='h-3 rounded bg-white/10 mb-2 w-3/4'></div>
          <div className='h-2.5 rounded bg-white/5 w-1/2'></div>
        </div>
      </div>
      <div className='h-2 rounded bg-white/5 w-full mb-1.5'></div>
      <div className='h-2 rounded bg-white/5 w-2/3 mb-4'></div>
      <div className='flex gap-2'>
        <div className='h-2 rounded-full bg-white/5 w-12'></div>
        <div className='h-2 rounded-full bg-white/5 w-12'></div>
        <div className='h-2 rounded-full bg-white/5 w-12'></div>
      </div>
    </div>
  </div>
)

/* ─── Empty state ────────────────────────────────────────────────── */
const EmptyState = ({ icon: Icon, title, sub, cta, onCta }) => (
  <div className='col-span-full py-24 flex flex-col items-center justify-center bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem] group'>
    <div className='w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-700'>
      <Icon size={40} className='text-gray-700' />
    </div>
    <h3 className='text-lg font-black uppercase tracking-widest text-white mb-2'>{title}</h3>
    <p className='text-gray-500 font-bold text-[10px] uppercase tracking-widest mb-8'>{sub}</p>
    {cta && (
      <button
        className='px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-[1.5rem] font-black text-xs tracking-widest hover:scale-110 active:scale-95 shadow-[0_10px_30px_rgba(168,85,247,0.3)] transition-all'
        onClick={onCta}
      >
        {cta}
      </button>
    )}
  </div>
)

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════ */
const Amitie = ({ searchQuery, onSearchFocus, onSearchBlur }) => {
  const { user: authUser } = useAuth()
  const { modal, setModal, confirm } = useModal()

  const PER_PAGE = 12

  // Data lists
  const [friends, setFriends] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [pendingRequests, setPendingRequests] = useState([])
  const [blockedUsers, setBlockedUsers] = useState([])
  const [searchResults, setSearchResults] = useState([])

  // Pagination state per section
  const [pagination, setPagination] = useState({
    friends:     { page: 1, hasMore: false, loading: false, initialLoading: true },
    suggestions: { page: 1, hasMore: false, loading: false, initialLoading: true },
    pending:     { page: 1, hasMore: false, loading: false, initialLoading: true },
    blocked:     { page: 1, hasMore: false, loading: false, initialLoading: true },
    search:      { page: 1, hasMore: false, loading: false, initialLoading: false }
  })

  const [activeTab, setActiveTab] = useState('friends')
  const [isSearching, setIsSearching] = useState(false)
  const searchTimeoutRef = useRef(null)

  // Sentinel refs for IntersectionObserver
  const friendsSentinelRef   = useRef(null)
  const suggestionsSentinelRef = useRef(null)
  const pendingSentinelRef   = useRef(null)
  const searchSentinelRef    = useRef(null)

  /* ── helpers ── */
  const setPag = (key, patch) =>
    setPagination(prev => ({ ...prev, [key]: { ...prev[key], ...patch } }))

  /* ═══ LOAD FUNCTIONS ═══════════════════════════════════════════ */

  const loadFriends = useCallback(async (page = 1, append = false) => {
    setPag('friends', page === 1 ? { initialLoading: true } : { loading: true })
    try {
      const res = await api.get(`/friends?page=${page}&per_page=${PER_PAGE}`)
      if (res.data.success) {
        setFriends(prev => append ? [...prev, ...res.data.friends] : res.data.friends)
        setPag('friends', { page, hasMore: res.data.has_more, initialLoading: false, loading: false })
      }
    } catch { setPag('friends', { initialLoading: false, loading: false }) }
  }, [])

  const loadSuggestions = useCallback(async (page = 1, append = false) => {
    setPag('suggestions', page === 1 ? { initialLoading: true } : { loading: true })
    try {
      const res = await api.get(`/friends/suggestions?page=${page}&per_page=${PER_PAGE}`)
      if (res.data.success) {
        setSuggestions(prev => append ? [...prev, ...res.data.suggestions] : res.data.suggestions)
        setPag('suggestions', { page, hasMore: res.data.has_more, initialLoading: false, loading: false })
      }
    } catch { setPag('suggestions', { initialLoading: false, loading: false }) }
  }, [])

  const loadPendingRequests = useCallback(async (page = 1, append = false) => {
    setPag('pending', page === 1 ? { initialLoading: true } : { loading: true })
    try {
      const res = await api.get(`/friends/pending?page=${page}&per_page=${PER_PAGE}`)
      if (res.data.success) {
        setPendingRequests(prev => append ? [...prev, ...res.data.pending_requests] : res.data.pending_requests)
        setPag('pending', { page, hasMore: res.data.has_more, initialLoading: false, loading: false })
      }
    } catch { setPag('pending', { initialLoading: false, loading: false }) }
  }, [])

  const loadBlockedUsers = useCallback(async () => {
    setPag('blocked', { initialLoading: true })
    try {
      const res = await api.get('/blocks')
      if (res.data.success) setBlockedUsers(res.data.blocked_users)
    } finally { setPag('blocked', { initialLoading: false, loading: false }) }
  }, [])

  /* ═══ INITIAL LOAD ══════════════════════════════════════════════ */
  useEffect(() => {
    if (!isSearching) {
      loadFriends(1, false)
      loadSuggestions(1, false)
      loadPendingRequests(1, false)
      loadBlockedUsers()
    }
  }, [isSearching])

  /* ═══ SEARCH ════════════════════════════════════════════════════ */
  const handleSearch = useCallback(async (query, page = 1, append = false) => {
    setPag('search', page === 1 ? { initialLoading: true } : { loading: true })
    try {
      const res = await api.get(`/friends/search?query=${encodeURIComponent(query)}`)
      if (res.data.success) {
        setSearchResults(prev => append ? [...prev, ...res.data.users] : res.data.users)
        setPag('search', { page, hasMore: false, initialLoading: false, loading: false })
      }
    } catch { setPag('search', { initialLoading: false, loading: false }) }
  }, [])

  useEffect(() => {
    if (searchQuery && searchQuery.trim().length >= 2) {
      setIsSearching(true)
      clearTimeout(searchTimeoutRef.current)
      searchTimeoutRef.current = setTimeout(() => handleSearch(searchQuery, 1, false), 500)
    } else if (searchQuery === '') {
      setIsSearching(false)
      setSearchResults([])
    }
    return () => clearTimeout(searchTimeoutRef.current)
  }, [searchQuery])

  /* ═══ INFINITE SCROLL (IntersectionObserver) ════════════════════ */
  const useInfiniteObserver = (sentinelRef, section, loadMore) => {
    useEffect(() => {
      const el = sentinelRef.current
      if (!el) return
      const obs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && pagination[section].hasMore && !pagination[section].loading) {
          loadMore(pagination[section].page + 1, true)
        }
      }, { threshold: 0.1 })
      obs.observe(el)
      return () => obs.disconnect()
    }, [pagination[section].hasMore, pagination[section].loading, pagination[section].page])
  }

  useInfiniteObserver(friendsSentinelRef,     'friends',     loadFriends)
  useInfiniteObserver(suggestionsSentinelRef, 'suggestions', loadSuggestions)
  useInfiniteObserver(pendingSentinelRef,     'pending',     loadPendingRequests)

  /* ═══ FRIEND ACTIONS ════════════════════════════════════════════ */

  const handleSendRequest = async userId => {
    try {
      const res = await api.post('/friends/request', { user_id: userId })
      if (res.data.success) {
        setModal({ show: true, type: 'success', title: 'Envoyé !', message: "Demande d'amitié envoyée." })
        if (isSearching) handleSearch(searchQuery, 1, false)
        else loadSuggestions(1, false)
      }
    } catch (e) {
      setModal({ show: true, type: 'error', title: 'Erreur', message: e.response?.data?.message || "Impossible d'envoyer la demande." })
    }
  }

  const handleAcceptRequest = async userId => {
    try {
      const res = await api.post('/friends/accept', { user_id: userId })
      if (res.data.success) {
        setModal({ show: true, type: 'success', title: 'Accepté !', message: "Vous êtes maintenant amis." })
        loadFriends(1, false)
        loadPendingRequests(1, false)
        if (isSearching) handleSearch(searchQuery, 1, false)
      }
    } catch { setModal({ show: true, type: 'error', title: 'Erreur', message: "Impossible d'accepter." }) }
  }

  const handleRemoveFriend = async (userId, userName) => {
    const ok = await confirm(`Supprimer ${userName} de vos amis ?`, 'Confirmer')
    if (!ok) return
    try {
      const res = await api.post('/friends/remove', { user_id: userId })
      if (res.data.success) {
        setModal({ show: true, type: 'success', title: 'Supprimé', message: 'Ami supprimé.' })
        setFriends(prev => prev.filter(f => f.id !== userId))
        loadSuggestions(1, false)
      }
    } catch { setModal({ show: true, type: 'error', title: 'Erreur', message: "Impossible de supprimer." }) }
  }

  const handleCancelRequest = async userId => {
    const ok = await confirm("Annuler cette demande d'amitié ?", "Confirmer l'annulation")
    if (!ok) return
    try {
      const res = await api.post('/friends/remove', { user_id: userId })
      if (res.data.success) {
        setModal({ show: true, type: 'success', title: 'Annulé', message: "Demande annulée." })
        setPendingRequests(prev => prev.filter(r => r.id !== userId))
        if (isSearching) handleSearch(searchQuery, 1, false)
      }
    } catch { setModal({ show: true, type: 'error', title: 'Erreur', message: "Impossible d'annuler." }) }
  }

  const handleUnblock = async (userId, userName) => {
    const ok = await confirm(`Débloquer ${userName} ?`, 'Débloquer')
    if (!ok) return
    try {
      const res = await api.post('/blocks/unblock', { user_id: userId })
      if (res.data.success) {
        setModal({ show: true, type: 'success', title: 'Débloqué', message: 'Utilisateur débloqué.' })
        setBlockedUsers(prev => prev.filter(u => u.id !== userId))
        loadSuggestions(1, false)
      }
    } catch { setModal({ show: true, type: 'error', title: 'Erreur', message: "Impossible de débloquer." }) }
  }

  /* ═══ CARD RENDERER ═════════════════════════════════════════════ */

  const renderUserCard = (user, type = 'friend') => {
    const isMe = user.id === authUser?.id
    const gradients = ['from-purple-600 to-pink-600', 'from-blue-600 to-purple-600', 'from-pink-600 to-orange-500', 'from-teal-500 to-blue-600']
    const grad = gradients[user.id % gradients.length]

    return (
      <div
        key={`${type}-${user.id}`}
        className='group bg-[#0f0f0f] border border-white/5 rounded-[2rem] overflow-hidden hover:border-purple-500/30 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(139,92,246,0.15)] transition-all duration-500 flex flex-col'
      >
        {/* ── Card banner ── */}
        <div className={`h-24 bg-gradient-to-br ${grad} opacity-30 group-hover:opacity-50 transition-opacity duration-500 flex-shrink-0 relative`}>
          <div 
            className="absolute inset-0 opacity-[0.04]"
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          ></div>
        </div>

        {/* ── Avatar + name area ── */}
        <div className='px-5 pb-4 flex-1 flex flex-col'>
          <div className='flex items-end justify-between -mt-8 mb-3'>
            <Link to={`/profile/${user.id}`} className='flex-shrink-0'>
              <div className='w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#0f0f0f] group-hover:border-purple-500/40 transition-colors shadow-xl'>
                <Avatar user={user} size='w-16 h-16' />
              </div>
            </Link>
            {/* Quick action top-right */}
            {!isMe && type === 'friend' && (
              <Link
                to={`/messages?userId=${user.id}`}
                className='mb-1 p-2.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-xl border border-transparent hover:border-white/10 transition-all'
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

          {/* Location */}
          {user.location && (
            <p className='text-gray-600 text-[11px] flex items-center gap-1 mb-2'>
              <MapPin size={10} /> {user.location}
            </p>
          )}

          {/* Bio */}
          {user.bio ? (
            <p className='text-gray-500 text-[12px] leading-relaxed mb-3 line-clamp-2 flex-1'>
              {user.bio}{user.bio.length >= 100 ? '…' : ''}
            </p>
          ) : (
            <div className='flex-1'></div>
          )}

          {/* Stats row */}
          <div className='flex items-center gap-3 mb-4 flex-wrap'>
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
            {user.mutual_friends > 0 && (
              <span className='flex items-center gap-1 text-[11px] bg-white/5 text-gray-400 px-2 py-0.5 rounded-full border border-white/10'>
                <Users size={10} />
                {user.mutual_friends} mutuel{user.mutual_friends > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Date badge */}
          {(user.friendship_date || user.request_date) && (
            <p className='text-[10px] text-gray-700 mb-3'>
              {type === 'friend' ? 'Amis depuis' : 'Envoyé le'}{' '}
              {new Date(user.friendship_date || user.request_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          )}

          {/* ── Action buttons ── */}
          {!isMe && (
            <div className='mt-auto'>
              {type === 'friend' && (
                <div className='flex gap-2'>
                  <Link
                    to={`/messages?userId=${user.id}`}
                    className='flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl transition-all'
                  >
                    <MessageCircle size={14} /> Message
                  </Link>
                  <button
                    className='flex items-center justify-center gap-1 px-3 py-2.5 text-xs font-bold text-gray-500 hover:text-red-400 bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 rounded-2xl transition-all'
                    onClick={() => handleRemoveFriend(user.id, `${user.prenom} ${user.nom}`)}
                    title="Supprimer l'ami"
                  >
                    <UserMinus size={14} />
                  </button>
                </div>
              )}

              {type === 'suggestion' && (
                <button
                  className='w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-black tracking-wider rounded-2xl hover:scale-[1.02] active:scale-95 shadow-[0_8px_24px_rgba(139,92,246,0.3)] transition-all'
                  onClick={() => handleSendRequest(user.id)}
                >
                  <UserPlus size={15} /> Ajouter
                </button>
              )}

              {type === 'pending' && (
                <div className='flex gap-2'>
                  <button
                    className='flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl hover:scale-[1.02] active:scale-95 shadow-[0_6px_20px_rgba(34,197,94,0.25)] transition-all'
                    onClick={() => handleAcceptRequest(user.id)}
                  >
                    <Check size={14} /> Accepter
                  </button>
                  <button
                    className='flex items-center justify-center px-3 py-2.5 text-xs font-bold text-gray-500 hover:text-red-400 bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 rounded-2xl transition-all'
                    onClick={() => handleCancelRequest(user.id)}
                    title='Refuser'
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {type === 'search' && (
                <div>
                  {user.is_friend ? (
                    <div className='flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 rounded-2xl'>
                      <UserCheck size={14} /> Amis
                    </div>
                  ) : user.has_pending_request ? (
                    <div className='flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-2xl'>
                      <Clock size={14} /> En attente
                    </div>
                  ) : (
                    <button
                      className='w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-black tracking-wider rounded-2xl hover:scale-[1.02] active:scale-95 shadow-[0_8px_24px_rgba(139,92,246,0.3)] transition-all'
                      onClick={() => handleSendRequest(user.id)}
                    >
                      <UserPlus size={15} /> Ajouter
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  /* ─── Blocked user card ─────────────────────────────────────────── */
  const renderBlockedCard = (user, index) => (
    <div key={`blocked-${user.id}-${index}`}
      className='group bg-[#0f0f0f] border border-white/5 rounded-[2rem] overflow-hidden hover:border-red-500/20 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(239,68,68,0.1)] transition-all duration-500 flex flex-col'
    >
      <div className='h-16 bg-gradient-to-br from-red-900/30 to-gray-900 flex-shrink-0 relative overflow-hidden'>
        <div className='absolute inset-0 flex items-center justify-center opacity-20'>
          <UserX size={48} className='text-red-500' />
        </div>
      </div>
      <div className='px-5 pb-5 flex-1 flex flex-col'>
        <div className='flex items-end gap-3 -mt-7 mb-3'>
          <div className='w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#0f0f0f] flex-shrink-0'>
            <Avatar user={user} size='w-14 h-14' />
          </div>
          <div className='mb-1'>
            <h4 className='text-white font-bold text-sm'>{user.prenom} {user.nom}</h4>
            <span className='text-[10px] font-bold text-red-500/70 uppercase tracking-widest'>Bloqué</span>
          </div>
        </div>
        {user.bio && (
          <p className='text-gray-600 text-[12px] leading-relaxed mb-3 line-clamp-2'>{user.bio}…</p>
        )}
        <div className='mt-auto'>
          <button
            className='w-full py-2.5 text-xs font-black uppercase tracking-wider text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl transition-all'
            onClick={() => handleUnblock(user.id, `${user.prenom} ${user.nom}`)}
          >
            Débloquer
          </button>
        </div>
      </div>
    </div>
  )

  /* ─── Tab nav counts ─────────────────────────────────────────────── */
  const pendingCount = pendingRequests.length

  /* ═══ RENDER ═════════════════════════════════════════════════════ */
  return (
    <div className='section-content active'>
      <div className='friends-container'>

        {/* ── HEADER ── */}
        <div className='section-header'>
          <h2>Amis</h2>
          <div className='flex items-center gap-2'>
            {!isSearching && (
              <button
                className='px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-[1.5rem] shadow-[0_10px_30px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2'
                onClick={onSearchFocus}
              >
                <Search size={15} />
                Rechercher
              </button>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════
            SEARCH RESULTS
        ══════════════════════════════════════ */}
        {isSearching && (
          <div className='mb-6'>
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-base font-semibold text-white'>
                Résultats pour <span className='text-purple-400'>"{searchQuery}"</span>
              </h3>
              <button
                className='p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all'
                onClick={() => { setIsSearching(false); if (onSearchBlur) onSearchBlur() }}
              >
                <X size={18} />
              </button>
            </div>

            {pagination.search.initialLoading ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : searchResults.length > 0 ? (
              <>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {searchResults.map(u => renderUserCard(u, 'search'))}
                </div>
                <div ref={searchSentinelRef} className='h-4'></div>
              </>
            ) : (
              <EmptyState icon={Search} title='Aucun résultat' sub='Essayez un autre nom ou email.' />
            )}
          </div>
        )}

        {/* ══════════════════════════════════════
            TABS + SECTIONS
        ══════════════════════════════════════ */}
        {!isSearching && (
          <>
            {/* Tab bar */}
            <div className='bg-white/5 backdrop-blur-md p-1.5 rounded-[2.5rem] border border-white/5 flex gap-1.5 w-fit mx-auto md:mx-0 mb-8 overflow-x-auto no-scrollbar'>
              {[
                { key: 'friends',     label: 'Amis',        count: friends.length },
                { key: 'suggestions', label: 'Suggestions',  count: suggestions.length },
                { key: 'pending',     label: 'Demandes',     count: pendingCount, dot: pendingCount > 0 },
                { key: 'blocked',     label: 'Bloqués',      count: blockedUsers.length }
              ].map(tab => (
                <button
                  key={tab.key}
                  className={`relative px-6 py-3 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap flex items-center gap-2 ${
                    activeTab === tab.key
                      ? 'bg-white text-black shadow-2xl scale-105'
                      : 'text-gray-500 hover:text-white hover:bg-white/5'
                  }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${
                    activeTab === tab.key ? 'bg-black/10 text-black/60' : 'bg-white/10 text-gray-400'
                  }`}>{tab.count}</span>
                  {tab.dot && activeTab !== tab.key && (
                    <span className='absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full'></span>
                  )}
                </button>
              ))}
            </div>

            {/* ── FRIENDS TAB ── */}
            {activeTab === 'friends' && (
              <>
                {pagination.friends.initialLoading ? (
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                  </div>
                ) : friends.length > 0 ? (
                  <>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                      {friends.map(f => renderUserCard(f, 'friend'))}
                    </div>
                    <div ref={friendsSentinelRef} className='h-8 flex items-center justify-center'>
                      {pagination.friends.loading && (
                        <div className='flex gap-1.5'>
                          {[0,1,2].map(i => <div key={i} className='w-2 h-2 bg-purple-500/50 rounded-full animate-bounce' style={{ animationDelay: `${i * 0.15}s` }}></div>)}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <EmptyState icon={Users} title='Aucun ami pour le moment'
                    sub='Ajoutez des amis pour voir leur activité ici.'
                    cta='Voir les suggestions' onCta={() => setActiveTab('suggestions')} />
                )}
              </>
            )}

            {/* ── SUGGESTIONS TAB ── */}
            {activeTab === 'suggestions' && (
              <>
                {pagination.suggestions.initialLoading ? (
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                  </div>
                ) : suggestions.length > 0 ? (
                  <>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                      {suggestions.map(s => renderUserCard(s, 'suggestion'))}
                    </div>
                    <div ref={suggestionsSentinelRef} className='h-8 flex items-center justify-center'>
                      {pagination.suggestions.loading && (
                        <div className='flex gap-1.5'>
                          {[0,1,2].map(i => <div key={i} className='w-2 h-2 bg-purple-500/50 rounded-full animate-bounce' style={{ animationDelay: `${i * 0.15}s` }}></div>)}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <EmptyState icon={UserCog} title='Aucune suggestion' sub="Invitez des amis à rejoindre Tulk !" />
                )}
              </>
            )}

            {/* ── PENDING TAB ── */}
            {activeTab === 'pending' && (
              <>
                {pagination.pending.initialLoading ? (
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                  </div>
                ) : pendingRequests.length > 0 ? (
                  <>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                      {pendingRequests.map(r => renderUserCard(r, 'pending'))}
                    </div>
                    <div ref={pendingSentinelRef} className='h-8 flex items-center justify-center'>
                      {pagination.pending.loading && (
                        <div className='flex gap-1.5'>
                          {[0,1,2].map(i => <div key={i} className='w-2 h-2 bg-purple-500/50 rounded-full animate-bounce' style={{ animationDelay: `${i * 0.15}s` }}></div>)}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <EmptyState icon={Clock} title='Aucune demande en attente' sub="Vous n'avez pas de demandes d'amitié en attente." />
                )}
              </>
            )}

            {/* ── BLOCKED TAB ── */}
            {activeTab === 'blocked' && (
              <>
                {pagination.blocked.initialLoading ? (
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
                  </div>
                ) : blockedUsers.length > 0 ? (
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {blockedUsers.map((u, i) => renderBlockedCard(u, i))}
                  </div>
                ) : (
                  <EmptyState icon={UserX} title='Aucun utilisateur bloqué' sub='Les utilisateurs que vous bloquez apparaîtront ici.' />
                )}
              </>
            )}
          </>
        )}
      </div>
      <Modal modal={modal} setModal={setModal} />
    </div>
  )
}

export default Amitie
