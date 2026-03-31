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

  const renderUserCard = (user, type = 'friend') => {
    return (
      <div
        key={user.id}
        className='bg-[#141414] border border-[#262626] rounded-lg p-4'
      >
        <div className='flex items-start justify-between'>
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
                      className='p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-[#262626]'
                      title='Envoyer un message'
                      to={`/messages?userId=${user.id}`}
                    >
                      <MessageCircle size={18} />
                    </Link>
                    <button
                      className='p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-[#262626]'
                      onClick={() =>
                        handleRemoveFriend(user.id, `${user.prenom} ${user.nom}`)
                      }
                      title="Supprimer l'ami"
                    >
                      <UserX size={18} />
                    </button>
                  </>
                )}

                {type === 'suggestion' && (
                  <button
                    className='px-3 py-1 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2'
                    onClick={() => handleSendRequest(user.id)}
                  >
                    <UserPlus size={16} />
                    Ajouter
                  </button>
                )}

                {type === 'pending' && (
                  <div className='flex gap-2'>
                    <button
                      className='p-2 text-gray-400 hover:text-green-500 transition-colors rounded-lg hover:bg-[#262626]'
                      onClick={() => handleAcceptRequest(user.id)}
                      title='Accepter'
                    >
                      <Check size={18} />
                    </button>
                    <button
                      className='p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-[#262626]'
                      onClick={() => handleCancelRequest(user.id)}
                      title='Refuser'
                    >
                      <X size={18} />
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
                        className='px-3 py-1 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2'
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
                className='btn-primary flex items-center gap-2'
                onClick={onSearchFocus}
              >
                <Search size={18} />
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
                {searchResults.map(user => renderUserCard(user, 'search'))}
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
            <div className='flex border-b border-[#262626] mb-6'>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'friends'
                    ? 'text-white border-b-2 border-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('friends')}
              >
                Amis ({friends.length})
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'suggestions'
                    ? 'text-white border-b-2 border-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('suggestions')}
              >
                Suggestions ({suggestions.length})
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'pending'
                    ? 'text-white border-b-2 border-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('pending')}
              >
                Demandes ({pendingRequests.length})
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'blocked'
                    ? 'text-white border-b-2 border-white'
                    : 'text-gray-400 hover:text-white'
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
                    {friends.map(friend => renderUserCard(friend, 'friend'))}
                  </div>
                ) : (
                  <div className='text-center py-8 bg-[#141414] border border-[#262626] rounded-lg'>
                    <Users size={48} className='mx-auto text-gray-400 mb-4' />
                    <h3 className='text-lg font-semibold text-white mb-2'>
                      Aucun ami pour le moment
                    </h3>
                    <p className='text-gray-400 mb-4'>
                      Ajoutez des amis pour voir leur activité ici.
                    </p>
                    <button
                      className='btn-primary'
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
                    {suggestions.map(suggestion =>
                      renderUserCard(suggestion, 'suggestion')
                    )}
                  </div>
                ) : (
                  <div className='text-center py-8 bg-[#141414] border border-[#262626] rounded-lg'>
                    <UserCog size={48} className='mx-auto text-gray-400 mb-4' />
                    <h3 className='text-lg font-semibold text-white mb-2'>
                      Aucune suggestion
                    </h3>
                    <p className='text-gray-400'>
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
                    {pendingRequests.map(request =>
                      renderUserCard(request, 'pending')
                    )}
                  </div>
                ) : (
                  <div className='text-center py-8 bg-[#141414] border border-[#262626] rounded-lg'>
                    <Clock size={48} className='mx-auto text-gray-400 mb-4' />
                    <h3 className='text-lg font-semibold text-white mb-2'>
                      Aucune demande en attente
                    </h3>
                    <p className='text-gray-400'>
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
                    {blockedUsers.map(user => (
                      <div key={user.id} className='bg-[#141414] border border-[#262626] rounded-lg p-4'>
                        <div className='flex items-center justify-between'>
                           <div className='flex items-center gap-3'>
                              <Avatar user={user} size='w-12 h-12' />
                              <div>
                                 <h4 className='text-white font-medium'>{user.prenom} {user.nom}</h4>
                                 <p className='text-gray-500 text-xs'>ID: {user.id}</p>
                              </div>
                           </div>
                           <button 
                            className='px-3 py-1 bg-[#262626] text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-700 hover:text-white transition-colors'
                            onClick={() => handleUnblock(user.id, `${user.prenom} ${user.nom}`)}
                           >
                            Débloquer
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='text-center py-8 bg-[#141414] border border-[#262626] rounded-lg'>
                    <UserX size={48} className='mx-auto text-gray-400 mb-4' />
                    <h3 className='text-lg font-semibold text-white mb-2'>
                      Aucun utilisateur bloqué
                    </h3>
                    <p className='text-gray-400'>
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
