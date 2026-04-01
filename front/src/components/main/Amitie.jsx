import React, { useState, useEffect, useRef } from 'react'
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
  Clock
} from 'lucide-react'
import Avatar from '../common/Avatar'

const Amitie = ({ searchQuery, onSearchFocus, onSearchBlur }) => {
  const { user: authUser } = useAuth()
  const { modal, setModal, confirm } = useModal()

  const [friends, setFriends] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [pendingRequests, setPendingRequests] = useState([])
  const [blockedUsers, setBlockedUsers] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState({
    friends: false,
    suggestions: false,
    pending: false,
    blocked: false,
    search: false
  })
  const [activeTab, setActiveTab] = useState('friends')
  const [isSearching, setIsSearching] = useState(false)
  const searchTimeoutRef = useRef(null)

  // Load friends, suggestions, and pending requests on mount
  useEffect(() => {
    if (!isSearching) {
      loadFriends()
      loadSuggestions()
      loadPendingRequests()
      loadBlockedUsers()
    }
  }, [isSearching])

  // Handle search query changes
  useEffect(() => {
    if (searchQuery && searchQuery.trim().length >= 2) {
      setIsSearching(true)
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }

      searchTimeoutRef.current = setTimeout(() => {
        handleSearch(searchQuery)
      }, 500)
    } else if (searchQuery === '') {
      setIsSearching(false)
      setSearchResults([])
    }
  }, [searchQuery])

  const loadFriends = async () => {
    setLoading(prev => ({ ...prev, friends: true }))
    try {
      const response = await api.get('/friends')
      if (response.data.success) {
        setFriends(response.data.friends)
      }
    } catch (error) {
      console.error('Error loading friends:', error)
      setModal({
        show: true,
        type: 'error',
        title: 'Erreur',
        message: "Impossible de charger la liste d'amis."
      })
    } finally {
      setLoading(prev => ({ ...prev, friends: false }))
    }
  }

  const loadSuggestions = async () => {
    setLoading(prev => ({ ...prev, suggestions: true }))
    try {
      const response = await api.get('/friends/suggestions')
      if (response.data.success) {
        setSuggestions(response.data.suggestions)
      }
    } catch (error) {
      console.error('Error loading suggestions:', error)
      setModal({
        show: true,
        type: 'error',
        title: 'Erreur',
        message: "Impossible de charger les suggestions d'amis."
      })
    } finally {
      setLoading(prev => ({ ...prev, suggestions: false }))
    }
  }

  const loadPendingRequests = async () => {
    setLoading(prev => ({ ...prev, pending: true }))
    try {
      const response = await api.get('/friends/pending')
      if (response.data.success) {
        setPendingRequests(response.data.pending_requests)
      }
    } catch (error) {
      console.error('Error loading pending requests:', error)
      setModal({
        show: true,
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de charger les demandes en attente.'
      })
    } finally {
      setLoading(prev => ({ ...prev, pending: false }))
    }
  }

  const loadBlockedUsers = async () => {
    setLoading(prev => ({ ...prev, blocked: true }))
    try {
      const response = await api.get('/blocks')
      if (response.data.success) {
        setBlockedUsers(response.data.blocked_users)
      }
    } catch (error) {
      console.error('Error loading blocked users:', error)
    } finally {
      setLoading(prev => ({ ...prev, blocked: false }))
    }
  }

  const handleUnblock = async (userId, userName) => {
    const shouldUnblock = await confirm(
      `Voulez-vous vraiment débloquer ${userName} ?`,
      'Débloquer l\'utilisateur'
    )
    if (!shouldUnblock) return

    try {
      const response = await api.post('/blocks/unblock', { user_id: userId })
      if (response.data.success) {
        setModal({
          show: true,
          type: 'success',
          title: 'Succès',
          message: 'Utilisateur débloqué.'
        })
        setBlockedUsers(blockedUsers.filter(u => u.id !== userId))
        loadSuggestions()
      }
    } catch (error) {
      console.error('Error unblocking user:', error)
      setModal({
        show: true,
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de débloquer l\'utilisateur.'
      })
    }
  }

  const handleSearch = async query => {
    setLoading(prev => ({ ...prev, search: true }))
    try {
      const response = await api.get(
        `/friends/search?query=${encodeURIComponent(query)}`
      )
      if (response.data.success) {
        setSearchResults(response.data.users)
      }
    } catch (error) {
      console.error('Error searching friends:', error)
      setModal({
        show: true,
        type: 'error',
        title: 'Erreur',
        message: "Impossible d'effectuer la recherche."
      })
    } finally {
      setLoading(prev => ({ ...prev, search: false }))
    }
  }

  const handleSendRequest = async userId => {
    try {
      const response = await api.post('/friends/request', { user_id: userId })
      if (response.data.success) {
        setModal({
          show: true,
          type: 'success',
          title: 'Succès',
          message: "Demande d'amitié envoyée avec succès."
        })

        if (isSearching) {
          handleSearch(searchQuery)
        }
      }
    } catch (error) {
      console.error('Error sending friend request:', error)
      const message =
        error.response?.data?.message ||
        "Impossible d'envoyer la demande d'amitié."
      setModal({
        show: true,
        type: 'error',
        title: 'Erreur',
        message: message
      })
    }
  }

  const handleAcceptRequest = async userId => {
    try {
      const response = await api.post('/friends/accept', { user_id: userId })
      if (response.data.success) {
        setModal({
          show: true,
          type: 'success',
          title: 'Succès',
          message: "Demande d'amitié acceptée."
        })

        loadFriends()
        loadPendingRequests()
        if (isSearching) {
          handleSearch(searchQuery)
        }
      }
    } catch (error) {
      console.error('Error accepting friend request:', error)
      setModal({
        show: true,
        type: 'error',
        title: 'Erreur',
        message: "Impossible d'accepter la demande d'amitié."
      })
    }
  }

  const handleRemoveFriend = async (userId, userName) => {
    const shouldRemove = await confirm(
      `Êtes-vous sûr de vouloir supprimer ${userName} de vos amis ?`,
      'Confirmer la suppression'
    )

    if (shouldRemove) {
      try {
        const response = await api.post('/friends/remove', { user_id: userId })
        if (response.data.success) {
          setModal({
            show: true,
            type: 'success',
            title: 'Succès',
            message: 'Ami supprimé avec succès.'
          })

          setFriends(friends.filter(friend => friend.id !== userId))
          loadSuggestions()
          if (isSearching) {
            handleSearch(searchQuery)
          }
        }
      } catch (error) {
        console.error('Error removing friend:', error)
        setModal({
          show: true,
          type: 'error',
          title: 'Erreur',
          message: "Impossible de supprimer l'ami."
        })
      }
    }
  }

  const handleCancelRequest = async userId => {
    const shouldCancel = await confirm(
      "Êtes-vous sûr de vouloir annuler cette demande d'amitié ?",
      "Confirmer l'annulation"
    )

    if (shouldCancel) {
      try {
        const response = await api.post('/friends/remove', { user_id: userId })
        if (response.data.success) {
          setModal({
            show: true,
            type: 'success',
            title: 'Succès',
            message: "Demande d'amitié annulée."
          })

          if (isSearching) {
            handleSearch(searchQuery)
          }
        }
      } catch (error) {
        console.error('Error canceling friend request:', error)
        setModal({
          show: true,
          type: 'error',
          title: 'Erreur',
          message: "Impossible d'annuler la demande d'amitié."
        })
      }
    }
  }

  const renderUserCard = (user, type = 'friend', index = 0) => {
    return (
      <div
        key={`${type}-${user.id}-${index}`}
        className='bg-[#0f0f0f] border border-white/5 rounded-[2rem] p-6 hover:shadow-2xl hover:border-purple-500/20 transition-all duration-700 hover:-translate-y-2 group relative overflow-hidden'
      >
        <div className='absolute -top-12 -right-12 w-32 h-32 bg-purple-500/5 rounded-full blur-[40px] group-hover:bg-purple-500/10 transition-all duration-1000'></div>
        <div className='flex items-start justify-between relative'>
          <div className='flex items-center gap-3 min-w-0 flex-1'>
            <Link
              to={`/profile/${user.id}`}
              className='w-12 h-12 rounded-full overflow-hidden flex-shrink-0 relative hover:opacity-80 transition-opacity'
            >
              <Avatar user={user} size='w-12 h-12' />
            </Link>
            <div className='min-w-0 flex-1'>
              <Link
                to={`/profile/${user.id}`}
                className='hover:text-purple-400 transition-colors block'
              >
                <h4 className='text-white font-medium truncate'>
                  {user.prenom} {user.nom}
                </h4>
              </Link>
              <p className='text-gray-400 text-sm truncate'>{user.email}</p>
              {user.mutual_friends > 0 && (
                <p className='text-gray-500 text-xs mt-1 truncate'>
                  {user.mutual_friends} ami{user.mutual_friends > 1 ? 's' : ''}{' '}
                  mutuel{user.mutual_friends > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>

          <div className='flex gap-2 items-center'>
            {user.id === authUser.id ? (
              <span className='text-xs font-medium bg-purple-500/10 text-purple-400 px-2 py-1 rounded border border-purple-500/20'>
                Vous
              </span>
            ) : (
              <>
                {type === 'friend' && (
                  <>
                    <Link
                      className='p-3 text-gray-400 hover:text-white transition-colors rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10'
                      title='Envoyer un message'
                      to={`/messages?userId=${user.id}`}
                    >
                      <MessageCircle size={20} />
                    </Link>
                    <button
                      className='p-3 text-gray-400 hover:text-red-400 transition-colors rounded-2xl hover:bg-red-500/10 border border-transparent hover:border-red-500/20'
                      onClick={() =>
                        handleRemoveFriend(user.id, `${user.prenom} ${user.nom}`)
                      }
                      title="Supprimer l'ami"
                    >
                      <UserX size={20} />
                    </button>
                  </>
                )}

                {type === 'suggestion' && (
                  <button
                    className='px-6 py-3 bg-white text-black text-[10px] font-black tracking-widest uppercase rounded-[1.5rem] hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)] flex items-center gap-2'
                    onClick={() => handleSendRequest(user.id)}
                  >
                    <UserPlus size={16} />
                    Ajouter
                  </button>
                )}

                {type === 'pending' && (
                  <div className='flex gap-2'>
                    <button
                      className='p-3 text-gray-400 hover:text-green-400 transition-colors rounded-2xl hover:bg-green-500/10 border border-transparent hover:border-green-500/20'
                      onClick={() => handleAcceptRequest(user.id)}
                      title='Accepter'
                    >
                      <Check size={20} />
                    </button>
                    <button
                      className='p-3 text-gray-400 hover:text-red-400 transition-colors rounded-2xl hover:bg-red-500/10 border border-transparent hover:border-red-500/20'
                      onClick={() => handleCancelRequest(user.id)}
                      title='Refuser'
                    >
                      <X size={20} />
                    </button>
                  </div>
                )}

                {type === 'search' && (
                  <>
                    {user.is_friend ? (
                      <div className='flex items-center gap-2 text-green-500 text-sm'>
                        <UserCheck size={16} />
                        <span>Ami</span>
                      </div>
                    ) : user.has_pending_request ? (
                      <div className='flex items-center gap-2 text-yellow-500 text-sm'>
                        <Clock size={16} />
                        <span>En attente</span>
                      </div>
                    ) : (
                      <button
                        className='px-6 py-3 bg-white text-black text-[10px] font-black tracking-widest uppercase rounded-[1.5rem] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-[0_10px_30px_rgba(255,255,255,0.1)]'
                        onClick={() => handleSendRequest(user.id)}
                      >
                        <UserPlus size={16} />
                        Ajouter
                      </button>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='section-content active'>
      <div className='friends-container'>
        <div className='section-header'>
          <h2>Amis</h2>
          <div className='flex items-center gap-2'>
            {!isSearching && (
              <button
                className='px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-[1.5rem] shadow-[0_10px_30px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2'
                onClick={onSearchFocus}
              >
                <Search size={16} />
                Rechercher des amis
              </button>
            )}
          </div>
        </div>

        {isSearching && (
          <div className='mb-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-white'>
                Résultats de recherche pour "{searchQuery}"
              </h3>
              <button
                className='text-gray-400 hover:text-white transition-colors'
                onClick={() => {
                  setIsSearching(false)
                  if (onSearchBlur) onSearchBlur()
                }}
              >
                <X size={20} />
              </button>
            </div>

            {loading.search ? (
              <div className='text-center py-8'>
                <div className='text-gray-400'>Recherche en cours...</div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {searchResults.map((user, index) => renderUserCard(user, 'search', index))}
              </div>
            ) : (
              <div className='text-center py-8 bg-[#141414] border border-[#262626] rounded-lg'>
                <div className='text-gray-400'>Aucun utilisateur trouvé.</div>
              </div>
            )}
          </div>
        )}

        {!isSearching && (
          <>
            <div className='bg-white/5 backdrop-blur-md p-1.5 rounded-[2.5rem] border border-white/5 flex gap-2 w-fit mx-auto md:mx-0 mb-8 overflow-x-auto no-scrollbar'>
              <button
                className={`px-8 py-3 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-700 whitespace-nowrap ${
                  activeTab === 'friends'
                    ? 'bg-white text-black shadow-2xl scale-105'
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => setActiveTab('friends')}
              >
                Amis ({friends.length})
              </button>
              <button
                className={`px-8 py-3 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-700 whitespace-nowrap ${
                  activeTab === 'suggestions'
                    ? 'bg-white text-black shadow-2xl scale-105'
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => setActiveTab('suggestions')}
              >
                Suggestions ({suggestions.length})
              </button>
              <button
                className={`px-8 py-3 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-700 whitespace-nowrap ${
                  activeTab === 'pending'
                    ? 'bg-white text-black shadow-2xl scale-105'
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => setActiveTab('pending')}
              >
                Demandes ({pendingRequests.length})
              </button>
              <button
                className={`px-8 py-3 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-700 whitespace-nowrap ${
                  activeTab === 'blocked'
                    ? 'bg-white text-black shadow-2xl scale-105'
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => setActiveTab('blocked')}
              >
                Bloqués ({blockedUsers.length})
              </button>
            </div>

            {activeTab === 'friends' && (
              <div>
                {loading.friends ? (
                  <div className='text-center py-8'>
                    <div className='text-gray-400'>Chargement des amis...</div>
                  </div>
                ) : friends.length > 0 ? (
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {friends.map((friend, index) => renderUserCard(friend, 'friend', index))}
                  </div>
                ) : (
                  <div className='col-span-full py-24 flex flex-col items-center justify-center bg-white/5 border border-dashed border-white/10 rounded-[3rem] group'>
                    <div className='w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-700'>
                      <Users size={40} className='text-gray-700' />
                    </div>
                    <h3 className='text-lg font-black uppercase tracking-widest text-white mb-2'>
                      Aucun ami pour le moment
                    </h3>
                    <p className='text-gray-500 font-bold text-[10px] uppercase tracking-widest mb-8'>
                      Ajoutez des amis pour voir leur activité ici.
                    </p>
                    <button
                      className='px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-[1.5rem] font-black text-xs tracking-widest hover:scale-110 active:scale-95 shadow-[0_10px_30px_rgba(168,85,247,0.3)] transition-all'
                      onClick={() => setActiveTab('suggestions')}
                    >
                      Voir les suggestions
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'suggestions' && (
              <div>
                {loading.suggestions ? (
                  <div className='text-center py-8'>
                    <div className='text-gray-400'>
                      Chargement des suggestions...
                    </div>
                  </div>
                ) : suggestions.length > 0 ? (
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {suggestions.map((suggestion, index) =>
                      renderUserCard(suggestion, 'suggestion', index)
                    )}
                  </div>
                ) : (
                  <div className='col-span-full py-24 flex flex-col items-center justify-center bg-white/5 border border-dashed border-white/10 rounded-[3rem] group'>
                    <div className='w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-700'>
                      <UserCog size={40} className='text-gray-700' />
                    </div>
                    <h3 className='text-lg font-black uppercase tracking-widest text-white mb-2'>
                      Aucune suggestion
                    </h3>
                    <p className='text-gray-500 font-bold text-[10px] uppercase tracking-widest'>
                      Nous n'avons pas de suggestions d'amis pour le moment.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'pending' && (
              <div>
                {loading.pending ? (
                  <div className='text-center py-8'>
                    <div className='text-gray-400'>
                      Chargement des demandes...
                    </div>
                  </div>
                ) : pendingRequests.length > 0 ? (
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {pendingRequests.map((request, index) =>
                      renderUserCard(request, 'pending', index)
                    )}
                  </div>
                ) : (
                  <div className='col-span-full py-24 flex flex-col items-center justify-center bg-white/5 border border-dashed border-white/10 rounded-[3rem] group'>
                    <div className='w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-700'>
                      <Clock size={40} className='text-gray-700' />
                    </div>
                    <h3 className='text-lg font-black uppercase tracking-widest text-white mb-2'>
                      Aucune demande en attente
                    </h3>
                    <p className='text-gray-500 font-bold text-[10px] uppercase tracking-widest'>
                      Vous n'avez pas de demandes d'amitié en attente.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'blocked' && (
              <div>
                {loading.blocked ? (
                  <div className='text-center py-8'>
                    <div className='text-gray-400'>Chargement des utilisateurs bloqués...</div>
                  </div>
                ) : blockedUsers.length > 0 ? (
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {blockedUsers.map((user, index) => (
                      <div key={`blocked-${user.id}-${index}`} className='bg-[#0f0f0f] border border-white/5 rounded-[2rem] p-6 hover:shadow-2xl hover:border-red-500/20 transition-all duration-700 hover:-translate-y-2 group relative overflow-hidden'>
                        <div className='absolute -top-12 -right-12 w-32 h-32 bg-red-500/5 rounded-full blur-[40px] group-hover:bg-red-500/10 transition-all duration-1000'></div>
                        <div className='flex items-center justify-between relative'>
                           <div className='flex items-center gap-4'>
                              <Avatar user={user} size='w-14 h-14' />
                              <div>
                                 <h4 className='text-white font-medium'>{user.prenom} {user.nom}</h4>
                                 <p className='text-gray-500 text-xs mt-1'>ID: {user.id}</p>
                              </div>
                           </div>
                           <button 
                            className='px-6 py-3 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-[1.5rem] hover:bg-white/10 hover:border-white/20 transition-all'
                            onClick={() => handleUnblock(user.id, `${user.prenom} ${user.nom}`)}
                           >
                            Débloquer
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='col-span-full py-24 flex flex-col items-center justify-center bg-white/5 border border-dashed border-white/10 rounded-[3rem] group'>
                    <div className='w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-700'>
                      <UserX size={40} className='text-gray-700' />
                    </div>
                    <h3 className='text-lg font-black uppercase tracking-widest text-white mb-2'>
                      Aucun utilisateur bloqué
                    </h3>
                    <p className='text-gray-500 font-bold text-[10px] uppercase tracking-widest'>
                      Les utilisateurs que vous bloquez apparaîtront ici.
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
      <Modal modal={modal} setModal={setModal} />
    </div>
  )
}

export default Amitie
