import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../utils/api'
import Avatar from '../common/Avatar'
import Modal, { useModal } from '../Modal'
import { getImageUrl } from '../../utils/imageUrls'
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'
import { 
  Send, 
  Search, 
  MoreVertical, 
  Image as ImageIcon, 
  MessageCircle,
  Loader2,
  ChevronLeft,
  X,
  Plus,
  Smile,
  Hash,
  Info,
  Trash2,
  UserCheck,
  Flag,
  UserX,
  Grid,
  PlusCircle,
  Users,
  ShieldAlert
} from 'lucide-react'
import GroupChat from './GroupChat'
import GroupModal from './GroupModal'
import EmojiPicker from 'emoji-picker-react'

const Messages = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { user: authUser } = useAuth()
  const { modal, setModal, confirm } = useModal()
  const [conversations, setConversations] = useState([])
  const [filteredConversations, setFilteredConversations] = useState([])
  const [activeConversation, setActiveConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [sending, setSending] = useState(false)
  
  // Pagination State
  const [convPage, setConvPage] = useState(1)
  const [hasMoreConv, setHasMoreConv] = useState(false)
  const [loadingMoreConv, setLoadingMoreConv] = useState(false)
  
  const [msgPage, setMsgPage] = useState(1)
  const [hasMoreMsg, setHasMoreMsg] = useState(false)
  const [loadingMoreMsg, setLoadingMoreMsg] = useState(false)
  
  // Advanced Features State
  const [showChatSearch, setShowChatSearch] = useState(false)
  const [chatSearchQuery, setChatSearchQuery] = useState('')
  const [showActions, setShowActions] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  // Group Chat State
  const [activeTab, setActiveTab] = useState('direct') // 'direct' or 'groups'
  const [groups, setGroups] = useState([])
  const [activeGroup, setActiveGroup] = useState(null)
  const [groupModal, setGroupModal] = useState({ show: false, type: 'create', data: null })
  const [loadingGroups, setLoadingGroups] = useState(false)
  
  const fileInputRef = useRef(null)
  const messagesEndRef = useRef(null)
  const pollingInterval = useRef(null)
  const actionsRef = useRef(null)
  const emojiRef = useRef(null)

  const userIdParam = searchParams.get('userId')
  const groupIdParam = searchParams.get('groupId')

  useEffect(() => {
    fetchConversations()
    fetchGroups()
    const handleClickOutside = (event) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target)) {
        setShowActions(false)
      }
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmojiPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredConversations(conversations)
    } else {
      const filtered = conversations.filter(conv => {
        const fullName = `${conv.user.prenom} ${conv.user.nom}`.toLowerCase()
        return fullName.includes(searchQuery.toLowerCase())
      })
      setFilteredConversations(filtered)
    }
  }, [searchQuery, conversations])

  useEffect(() => {
    if (userIdParam && (conversations.length > 0 || loading === false)) {
      const conv = conversations.find(c => c.user.id === parseInt(userIdParam))
      if (conv) {
        if (activeConversation?.user.id !== conv.user.id) {
          handleSelectConversation(conv)
        }
      } else if (!activeConversation || activeConversation.user.id !== parseInt(userIdParam)) {
        fetchTargetUser(userIdParam)
      }
    }
  }, [userIdParam, conversations.length, loading])

  const fetchConversations = async (page = 1) => {
    try {
      if (page === 1) {
        setLoading(true)
      } else {
        setLoadingMoreConv(true)
      }
      const response = await api.get(`/messages/conversations?page=${page}`)
      if (response.data.success) {
        const newConversations = response.data.conversations
        if (page === 1) {
          setConversations(newConversations)
          setFilteredConversations(newConversations)
        } else {
          setConversations(prev => [...prev, ...newConversations])
        }
        setConvPage(page)
        setHasMoreConv(response.data.pagination.has_more)
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      if (page === 1) setLoading(false)
      setLoadingMoreConv(false)
    }
  }

  const fetchGroups = async () => {
    try {
      setLoadingGroups(true)
      const response = await api.get('/groups')
      if (response.data.success) {
        setGroups(response.data.groups || [])
      }
    } catch (error) {
      console.error('Error fetching groups:', error)
    } finally {
      setLoadingGroups(false)
    }
  }

  const fetchGroupDetails = async (groupId) => {
    try {
      const response = await api.get(`/groups/${groupId}`)
      if (response.data.success) {
        setActiveGroup(response.data.group)
        setActiveTab('groups')
      }
    } catch (error) {
      console.error('Error fetching group details:', error)
    }
  }

  const fetchTargetUser = async (userId) => {
    try {
      const response = await api.get(`/profile/${userId}`)
      if (response.data.success) {
        const targetUser = response.data.profile
        const newConv = {
          user: {
            id: targetUser.id,
            nom: targetUser.nom,
            prenom: targetUser.prenom,
            image: targetUser.image,
            email: targetUser.email
          },
          last_message: null
        }
        setActiveConversation(newConv)
        fetchMessages(userId)
      }
    } catch (error) {
      console.error('Error fetching target user:', error)
    }
  }

  const fetchMessages = async (userId, page = 1) => {
    if (page === 1) {
      setMessagesLoading(true)
    } else {
      setLoadingMoreMsg(true)
    }
    
    try {
      const response = await api.get(`/messages/${userId}?page=${page}`)
      if (response.data.success) {
        const paginatedMessages = response.data.messages
        const messageData = Array.isArray(paginatedMessages?.data) ? paginatedMessages.data : []
        const reverseMessages = [...messageData].reverse()
        
        if (page === 1) {
          setMessages(reverseMessages)
          scrollToBottom()
        } else {
          setMessages(prev => [...reverseMessages, ...prev])
        }
        
        setMsgPage(page)
        setHasMoreMsg(paginatedMessages?.current_page < paginatedMessages?.last_page)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setMessagesLoading(false)
      setLoadingMoreMsg(false)
    }
  }

  useEffect(() => {
    if (activeConversation) {
      if (pollingInterval.current) clearInterval(pollingInterval.current)
      pollingInterval.current = setInterval(() => {
        refreshMessages(activeConversation.user.id)
      }, 5000)
    }
    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current)
    }
  }, [activeConversation, messages.length])

  const refreshMessages = async (userId) => {
    try {
      const response = await api.get(`/messages/${userId}?page=1`)
      if (response.data.success) {
        const paginatedMessages = response.data.messages
        const messageData = Array.isArray(paginatedMessages?.data) ? paginatedMessages.data : []
        const latestPage = [...messageData].reverse()
        
        if (msgPage === 1) {
           if (latestPage.length !== messages.length) {
              setMessages(latestPage)
              scrollToBottom()
           }
        }
      }
    } catch (error) {
      console.error('Error refreshing messages:', error)
    }
  }

  const loadMoreConversations = () => {
    if (hasMoreConv && !loadingMoreConv) {
      fetchConversations(convPage + 1)
    }
  }

  const loadMoreMessages = () => {
    if (hasMoreMsg && !loadingMoreMsg) {
      fetchMessages(activeConversation.user.id, msgPage + 1)
    }
  }

  const { sentinelRef: convSentinel } = useInfiniteScroll(loadMoreConversations, hasMoreConv, loadingMoreConv)
  const { sentinelRef: msgSentinel } = useInfiniteScroll(loadMoreMessages, hasMoreMsg, loadingMoreMsg)

  const handleSelectConversation = (conv) => {
    setActiveConversation(conv)
    setSearchParams({ userId: conv.user.id })
    fetchMessages(conv.user.id)
    setShowInfo(false)
    setShowActions(false)
    setShowChatSearch(false)
    setChatSearchQuery('')
    setActiveTab('direct')
    setActiveGroup(null)
  }

  const handleSelectGroup = (group) => {
    setActiveGroup(group)
    setSearchParams({ groupId: group.id })
    setActiveTab('groups')
    setActiveConversation(null)
    setShowInfo(false)
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if ((!newMessage.trim() && !selectedImage) || !activeConversation || sending) return

    setSending(true)
    try {
      const formData = new FormData()
      formData.append('receiver_id', activeConversation.user.id)
      formData.append('texte', newMessage)
      if (selectedImage) {
        formData.append('image', selectedImage)
      }

      const response = await api.post('/messages', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (response.data.success) {
        setMessages([...messages, response.data.message])
        setNewMessage('')
        clearImage()
        scrollToBottom()
        fetchConversations()
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  const handleClearHistory = async () => {
    if (!activeConversation) return
    const confirmed = await confirm('Voulez-vous vraiment vider cette conversation ? Cette action est irréversible.', 'Vider la conversation')
    if (!confirmed) return
    try {
      setMessages([])
      setShowActions(false)
      setModal({ show: true, type: 'success', title: 'Succès', message: 'Conversation vidée' })
    } catch (err) {
      console.error('Error clearing history:', err)
    }
  }

  const handleBlockUser = async () => {
    if (!activeConversation) return
    const confirmed = await confirm(`Voulez-vous vraiment bloquer ${activeConversation.user.prenom} ? Vous ne pourrez plus échanger de messages.`, 'Bloquer l\'utilisateur')
    if (!confirmed) return
    try {
      const response = await api.post('/blocks/block', { user_id: activeConversation.user.id })
      if (response.data.success) {
        setModal({ show: true, type: 'success', title: 'Utilisateur bloqué', message: `${activeConversation.user.prenom} a été bloqué.` })
        setActiveConversation(null)
        fetchConversations()
      }
    } catch (err) {
      console.error('Error blocking user:', err)
    }
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const formatDate = (dateString, full = false) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    if (full) {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
    }
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const filteredMessages = messages.filter(msg => {
    if (!chatSearchQuery.trim()) return true
    return msg.texte?.toLowerCase().includes(chatSearchQuery.toLowerCase())
  })

  const sharedImages = messages.filter(msg => msg.image).map(msg => msg.image)

  if (loading) {
    return (
      <div className='flex items-center justify-center h-full bg-[#0a0a0a]'>
        <div className='flex flex-col items-center gap-4'>
           <div className='w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin'></div>
           <p className='text-gray-400 font-medium'>Préparation de vos discussions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='premium-chat-layout animate-fade-in mobile-responsive-height flex bg-[var(--bg-primary)] h-[calc(100vh-80px)] overflow-hidden rounded-[3rem] border border-[var(--border-muted)] shadow-2xl mt-4 mx-4 md:mt-8 md:mx-8 mb-4 max-w-7xl lg:mx-auto relative'>
      {/* Search & List Sidebar */}
      <div className={`bg-[var(--bg-card)] flex-col border-r border-[var(--border-muted)] w-full lg:w-96 flex-shrink-0 relative ${activeConversation || activeGroup ? 'hidden lg:flex' : 'flex'}`}>
        <div className='p-8 border-b border-[var(--border-muted)] relative overflow-hidden'>
          <div className='absolute -top-12 -left-12 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px]'></div>
          <h2 className='text-3xl font-black text-[var(--text-primary)] tracking-tighter mb-6 relative'>Discussions</h2>
          <div className='flex items-center gap-3 bg-[var(--bg-input)] border border-[var(--border-muted)] rounded-[2rem] px-5 py-4 w-full backdrop-blur-md focus-within:border-purple-500/50 focus-within:shadow-[0_0_20px_rgba(168,85,247,0.1)] transition-all relative'>
            <Search size={18} className='text-gray-400' />
            <input 
              type='text' 
              placeholder={activeTab === 'direct' ? 'Rechercher un ami...' : 'Rechercher un groupe...'} 
              className='bg-transparent border-none outline-none text-[var(--text-primary)] w-full placeholder-[var(--text-secondary)] text-sm font-bold tracking-wide'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className='flex items-center gap-2 mt-6 p-1 bg-[var(--bg-input)] border border-[var(--border-muted)] rounded-[1.5rem] relative'>
             <button 
               onClick={() => setActiveTab('direct')}
               className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'direct' ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-lg' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
             >
                <MessageCircle size={14} /> Direct
             </button>
             <button 
               onClick={() => setActiveTab('groups')}
               className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'groups' ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-lg' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
             >
                <Users size={14} /> Groupes
             </button>
          </div>
        </div>

        <div className='flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1'>
          {activeTab === 'groups' && (
            <button 
              onClick={() => setGroupModal({ show: true, type: 'create', data: null })}
              className='w-full flex items-center gap-4 p-4 rounded-[2rem] border border-dashed border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10 transition-all mb-4 group'
            >
               <div className='w-12 h-12 bg-purple-500/20 rounded-[1.2rem] flex items-center justify-center group-hover:scale-110 transition-transform'>
                  <PlusCircle size={24} className='text-purple-400' />
               </div>
               <div className='text-left'>
                  <p className='text-[var(--text-primary)] font-bold text-sm'>Créer un groupe</p>
                  <p className='text-[9px] font-black text-purple-400 uppercase tracking-widest'>Nouvelle discussion collective</p>
               </div>
            </button>
          )}

          {activeTab === 'direct' ? (
            filteredConversations.length === 0 ? (
              <div className='flex flex-col items-center justify-center p-8 mt-4 bg-[var(--bg-input)] rounded-[2.5rem] border border-dashed border-[var(--border-muted)] text-center mx-2 group'>
                <div className='w-16 h-16 bg-[var(--bg-hover)] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                  <MessageCircle size={24} className='text-gray-600' />
                </div>
                <p className='text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]'>{searchQuery ? 'Aucun ami trouvé' : 'Commencez à discuter'}</p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <div 
                  key={conv.user.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`flex items-center gap-4 p-4 rounded-[2rem] cursor-pointer transition-all duration-500 border border-transparent ${activeConversation?.user.id === conv.user.id ? 'bg-[var(--bg-hover)] border-[var(--border-color)] shadow-xl ml-2' : 'hover:bg-[var(--bg-hover)] hover:border-[var(--border-muted)]'}`}
                >
                  <div className='relative flex-shrink-0'>
                    <Avatar user={conv.user} size='w-12 h-12' className='rounded-[1.2rem] shadow-lg' />
                    <span className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[var(--bg-primary)] rounded-full'></span>
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center justify-between mb-1'>
                      <span className='text-[var(--text-primary)] font-bold text-sm truncate'>{conv.user.prenom} {conv.user.nom}</span>
                      <span className='text-[9px] font-black text-gray-500 uppercase tracking-widest flex-shrink-0 ml-2'>{conv.last_message ? formatDate(conv.last_message.date) : ''}</span>
                    </div>
                    <div className='text-xs font-medium text-gray-400 truncate'>
                      {conv.last_message?.image && <ImageIcon size={12} className='inline mr-1 text-purple-400' />}
                      {conv.last_message?.texte || (conv.last_message?.image ? 'Image partagée' : 'Envoyer un message')}
                    </div>
                  </div>
                </div>
              ))
            )
          ) : (
            groups.length === 0 ? (
              <div className='flex flex-col items-center justify-center p-8 mt-4 bg-[var(--bg-input)] rounded-[2.5rem] border border-dashed border-[var(--border-muted)] text-center mx-2 group'>
                <div className='w-16 h-16 bg-[var(--bg-hover)] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                  <Users size={24} className='text-gray-600' />
                </div>
                <p className='text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]'>Aucun groupe trouvé</p>
              </div>
            ) : (
              groups.map((group) => (
                <div 
                  key={group.id}
                  onClick={() => handleSelectGroup(group)}
                  className={`flex items-center gap-4 p-4 rounded-[2rem] cursor-pointer transition-all duration-500 border border-transparent ${activeGroup?.id === group.id ? 'bg-[var(--bg-hover)] border-[var(--border-color)] shadow-xl ml-2' : 'hover:bg-[var(--bg-hover)] hover:border-[var(--border-muted)]'}`}
                >
                  <div className='relative flex-shrink-0'>
                     <Avatar user={{ image: group.image, prenom: group.nom }} size='w-12 h-12' className='rounded-[1.2rem] shadow-lg ring-1 ring-[var(--border-muted)]' />
                     <div className='absolute -bottom-1 -right-1 p-1 bg-purple-500 rounded-full border-2 border-[var(--bg-card)]'>
                        <Users size={8} className='text-white' />
                     </div>
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center justify-between mb-1'>
                      <span className='text-[var(--text-primary)] font-bold text-sm truncate'>{group.nom}</span>
                      <span className='text-[9px] font-black text-gray-500 uppercase tracking-widest flex-shrink-0 ml-2'>{group.last_message ? group.last_message.date : ''}</span>
                    </div>
                    <div className='text-xs font-medium text-gray-400 truncate'>
                      <span className='text-purple-400 mr-1 font-black uppercase text-[8px] tracking-tighter bg-purple-500/10 px-1 rounded'>{group.role}</span>
                      {group.last_message ? (
                        <>
                          <span className='text-gray-300 font-bold'>{group.last_message.sender}: </span>
                          {group.last_message.texte}
                        </>
                      ) : 'Aucun message'}
                    </div>
                  </div>
                </div>
              ))
            )
          )}
          {/* Conversations Infinite Scroll Sentinel */}
          {hasMoreConv && (
            <div ref={convSentinel} className='py-4 flex justify-center'>
              <Loader2 size={24} className='animate-spin text-purple-500' />
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col bg-[var(--bg-primary)] relative ${!activeConversation && !activeGroup ? 'hidden lg:flex' : 'flex flex-col'}`}>
        {activeConversation ? (
          <>
            {/* Header */}
            <div className='flex items-center justify-between p-6 border-b border-[var(--border-muted)] bg-[var(--glass-bg)] backdrop-blur-xl z-20'>
              <div className='flex items-center gap-4'>
                <button onClick={() => setActiveConversation(null)} className='lg:hidden p-2 -ml-2 text-gray-400 hover:text-[var(--text-primary)] bg-[var(--bg-input)] rounded-xl'>
                  <ChevronLeft size={24} />
                </button>
                <div className='relative'>
                  <Avatar user={activeConversation.user} size='w-12 h-12' isLink={true} className='rounded-[1.2rem] shadow-lg ring-2 border-[var(--border-muted)]' />
                  <span className='absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-[var(--bg-card)] rounded-full'></span>
                </div>
                <div>
                  <Link to={`/profile/${activeConversation.user.id}`} className='text-[var(--text-primary)] font-black text-lg hover:text-purple-400 transition-colors tracking-tight'>
                    {activeConversation.user.prenom} {activeConversation.user.nom}
                  </Link>
                  <p className='text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] mt-0.5'>En ligne</p>
                </div>
              </div>
              <div className='flex items-center gap-2 bg-[var(--bg-input)] p-1.5 rounded-[2rem] border border-[var(--border-muted)]'>
                 <button className={`p-3 rounded-xl transition-all ${showChatSearch ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'}`} onClick={() => { setShowChatSearch(!showChatSearch); if(showChatSearch) setChatSearchQuery(''); }}><Search size={18} /></button>
                 <button className={`p-3 rounded-xl transition-all ${showInfo ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'}`} onClick={() => setShowInfo(!showInfo)}><Info size={18} /></button>
                 <div className='relative' ref={actionsRef}>
                    <button className={`p-3 rounded-xl transition-all ${showActions ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'}`} onClick={() => setShowActions(!showActions)}><MoreVertical size={18} /></button>
                    {showActions && (
                      <div className='absolute right-0 mt-2 w-56 bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-[1.5rem] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-200'>
                        <button onClick={handleClearHistory} className='w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm font-bold transition-all'><Trash2 size={16} className='text-red-400' /> Vider la conversation</button>
                        <button onClick={handleBlockUser} className='w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm font-bold transition-all'><UserX size={16} className='text-orange-400' /> Bloquer</button>
                        <button className='w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm font-bold transition-all'><Flag size={16} className='text-blue-400' /> Signaler</button>
                      </div>
                    )}
                 </div>
              </div>

              {/* Chat Search Overlay */}
              {showChatSearch && (
                <div className='absolute top-full left-0 right-0 p-4 bg-[var(--glass-bg)] backdrop-blur-xl border-b border-[var(--border-muted)] z-10 animate-in slide-in-from-top-2 duration-300'>
                   <div className='flex items-center gap-3 bg-[var(--bg-input)] border border-[var(--border-muted)] rounded-[2rem] px-5 py-3 w-full max-w-xl mx-auto'>
                      <Search size={16} className='text-[var(--text-secondary)]' />
                      <input 
                       type='text' 
                       placeholder='Rechercher dans les messages...' 
                       className='bg-transparent border-none outline-none text-[var(--text-primary)] w-full text-sm font-bold placeholder-[var(--text-secondary)]'
                       value={chatSearchQuery}
                       autoFocus
                       onChange={(e) => setChatSearchQuery(e.target.value)}
                      />
                      <button onClick={() => { setShowChatSearch(false); setChatSearchQuery(''); }} className='p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-hover)] rounded-full'><X size={14} /></button>
                   </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className='flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6'>
              {messagesLoading && messages.length === 0 ? (
                <div className='flex items-center justify-center h-full'>
                  <Loader2 size={32} className='animate-spin text-purple-500' />
                </div>
              ) : (
                <div className='flex flex-col'>
                  {/* Messages Infinite Scroll Sentinel (at the top) */}
                  {hasMoreMsg && (
                    <div ref={msgSentinel} className='py-4 flex justify-center'>
                      <Loader2 size={20} className='animate-spin text-purple-500' />
                    </div>
                  )}
                  {filteredMessages.length === 0 && chatSearchQuery && (
                    <div className='text-center text-[var(--text-secondary)] text-sm font-bold bg-[var(--bg-input)] py-3 rounded-2xl border border-[var(--border-muted)]'>Aucun message trouvé pour "{chatSearchQuery}"</div>
                  )}
                  {filteredMessages.map((msg, index) => {
                    const isMe = msg.id_uti_1 === authUser.id
                    return (
                      <div key={msg.id || index} className={`flex flex-col w-full mb-6 ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`flex flex-col max-w-[85%] md:max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                          {!isMe && <span className='text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-2 ml-2'>{activeConversation.user.prenom}</span>}
                          <div className={`p-4 md:p-5 rounded-[2rem] shadow-2xl relative overflow-hidden ${isMe ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-tr-sm shadow-[0_10px_30px_rgba(168,85,247,0.3)]' : 'bg-[var(--bg-card)] border border-[var(--border-muted)] text-[var(--text-primary)] rounded-tl-sm backdrop-blur-md'}`}>
                            {msg.image && (
                              <div className='rounded-2xl overflow-hidden mb-3 ring-1 ring-white/20 relative group'>
                                <img src={getImageUrl(msg.image)} alt='Attachment' className='w-full max-h-64 object-cover cursor-pointer group-hover:scale-105 transition-transform duration-700' onClick={() => window.open(getImageUrl(msg.image), '_blank')} />
                              </div>
                            )}
                            {msg.texte && <div className='text-sm md:text-base font-medium leading-relaxed whitespace-pre-wrap'>{msg.texte}</div>}
                          </div>
                          <span className={`text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)] mt-2 ${isMe ? 'mr-2' : 'ml-2'}`}>{formatDate(msg.date)}</span>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

             {/* Input Footer */}
             <div className='p-4 border-t border-[var(--border-muted)] bg-[var(--bg-primary)]/90 backdrop-blur-xl relative z-20'>
                {imagePreview && (
                   <div className='absolute bottom-full left-0 p-4 w-full bg-[var(--bg-card)]/90 backdrop-blur-xl border-t border-[var(--border-muted)] animate-in slide-in-from-bottom-2 duration-200'>
                      <div className='relative inline-block'>
                         <img src={imagePreview} alt='Preview' className='h-32 rounded-2xl border border-[var(--border-muted)] shadow-2xl object-cover' />
                         <button onClick={clearImage} className='absolute -top-3 -right-3 p-1.5 bg-[var(--bg-input)] border border-[var(--border-muted)] hover:border-red-500 hover:text-red-500 text-white rounded-full transition-all shadow-xl'><X size={14} /></button>
                      </div>
                   </div>
                )}
                
                {showEmojiPicker && (
                  <div className='absolute bottom-full right-4 mb-4 z-50' ref={emojiRef}>
                    <EmojiPicker 
                      onEmojiClick={(emojiData) => {
                        setNewMessage(prev => prev + emojiData.emoji);
                        setShowEmojiPicker(false);
                      }}
                      theme="dark"
                      width={300}
                      height={400}
                    />
                  </div>
                )}

                <form onSubmit={handleSendMessage} className='flex items-end gap-3 max-w-4xl mx-auto w-full relative'>
                  <div className='flex items-center gap-2 bg-[var(--bg-input)] border border-[var(--border-muted)] rounded-[2.5rem] px-2 py-2 flex-1 shadow-inner focus-within:border-purple-500/50 focus-within:ring-1 focus-within:ring-purple-500/50 transition-all'>
                    <button type='button' onClick={() => fileInputRef.current?.click()} className={`p-3 rounded-full transition-all flex-shrink-0 ${selectedImage ? 'bg-purple-500/20 text-purple-400' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'}`}>
                      <ImageIcon size={20} />
                    </button>
                    <input 
                     type='file' 
                     ref={fileInputRef} 
                     onChange={handleImageSelect} 
                     accept='image/*' 
                     className='hidden' 
                    />
                    <input 
                     type='text' 
                     placeholder='Écrivez votre message...' 
                     className='bg-transparent border-none outline-none text-[var(--text-primary)] w-full px-2 py-3 text-sm font-medium placeholder-[var(--text-secondary)] min-h-[44px]'
                     value={newMessage}
                     onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button 
                      type='button' 
                      className={`p-3 rounded-full transition-all flex-shrink-0 ${showEmojiPicker ? 'bg-[var(--bg-hover)] text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'}`}
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      <Smile size={20} />
                    </button>
                  </div>
                  <button 
                   type='submit' 
                   className='w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center shadow-[0_10px_30px_rgba(168,85,247,0.3)] hover:scale-105 active:scale-95 transition-all flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed group'
                   disabled={(!newMessage.trim() && !selectedImage) || sending}
                  >
                    {sending ? <Loader2 size={20} className='animate-spin' /> : <Send size={20} className='group-hover:translate-x-1 transition-transform' />}
                  </button>
                </form>
             </div>
          </>
        ) : activeGroup ? (
          <GroupChat 
            group={activeGroup} 
            onBack={() => setActiveGroup(null)} 
            onUpdate={(action) => setGroupModal({ show: true, type: action.type, data: action })}
          />
        ) : (
          <div className='flex-1 flex flex-col items-center justify-center text-center p-8 relative overflow-hidden'>
             <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(168,85,247,0.05),transparent_60%)]'></div>
             <div className='relative mb-8'>
                <div className='absolute -inset-8 bg-purple-500/5 rounded-full blur-2xl animate-pulse'></div>
                <div className='w-32 h-32 bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-full flex items-center justify-center shadow-2xl relative z-10'>
                  <MessageCircle size={48} className='text-[var(--text-secondary)]' />
                </div>
             </div>
             <h3 className='text-2xl font-black text-[var(--text-primary)] tracking-tighter mb-4 z-10'>Bienvenue sur Tulk Chat</h3>
             <p className='text-[var(--text-secondary)] font-bold text-sm max-w-md mx-auto mb-8 leading-relaxed z-10'>Sélectionnez un contact pour démarrer une conversation sécurisée et instantanée avec nos composants en verre.</p>
             <button className='px-8 py-4 rounded-[2rem] bg-[var(--text-primary)] text-[var(--bg-primary)] font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all z-10' onClick={() => document.querySelector('input[placeholder="Rechercher un ami..."]')?.focus()}>Nouvelle discussion</button>
          </div>
        )}
      </div>

      {/* Info Sidebar */}
      {activeConversation && showInfo && (
        <div className={`bg-[var(--bg-card)] border-l border-[var(--border-muted)] w-80 lg:w-96 flex-col absolute lg:relative right-0 top-0 bottom-0 z-40 transform transition-transform duration-500 flex shadow-2xl`}>
           <div className='flex-1 overflow-y-auto custom-scrollbar pb-10'>
              <div className='flex items-center justify-between p-6 border-b border-[var(--border-muted)] bg-[var(--glass-bg)] backdrop-blur-xl sticky top-0 z-10'>
                 <h3 className='text-xl font-black text-[var(--text-primary)] tracking-tighter'>Détails</h3>
                 <button onClick={() => setShowInfo(false)} className='p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-hover)] hover:bg-[var(--bg-hover)] rounded-xl transition-all'><X size={20} /></button>
              </div>
              
              <div className='flex flex-col items-center p-8 border-b border-[var(--border-muted)]'>
                 <div className='relative mb-4 group'>
                    <div className='absolute -inset-4 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-all duration-700'></div>
                    <Avatar user={activeConversation.user} size='w-32 h-32' className='relative z-10 shadow-2xl rounded-[3rem] ring-4 ring-[var(--bg-card)]' />
                 </div>
                 <h4 className='text-xl font-black text-[var(--text-primary)] tracking-tighter text-center'>{activeConversation.user.prenom} {activeConversation.user.nom}</h4>
                 <div className='flex items-center gap-2 mt-3 bg-green-500/10 px-3 py-1.5 rounded-[1rem] border border-green-500/20'>
                    <span className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></span>
                    <span className='text-[10px] font-black uppercase tracking-widest text-green-500'>En ligne</span>
                 </div>
              </div>

              <div className='p-6 space-y-8'>
                 <div>
                    <div className='flex items-center gap-2 mb-4 text-[var(--text-secondary)]'>
                       <Grid size={16} /> 
                       <span className='text-[10px] font-black uppercase tracking-widest'>Médias partagés</span>
                    </div>
                    <div className='grid grid-cols-3 gap-2'>
                       {sharedImages.length === 0 ? (
                         <div className='col-span-3 text-center p-6 bg-[var(--bg-input)] rounded-[1.5rem] border border-dashed border-[var(--border-muted)] text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest'>Aucun média partagé</div>
                       ) : (
                         sharedImages.map((img, idx) => (
                           <div key={idx} className='aspect-square rounded-[1rem] overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border border-[var(--border-muted)] relative group' onClick={() => window.open(getImageUrl(img), '_blank')}>
                              <img src={getImageUrl(img)} alt='Shared' className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500' />
                           </div>
                         ))
                       )}
                    </div>
                 </div>

                 <div>
                    <div className='flex items-center gap-2 mb-4 text-[var(--text-secondary)]'>
                       <Info size={16} /> 
                       <span className='text-[10px] font-black uppercase tracking-widest'>À propos</span>
                    </div>
                    <div className='bg-[var(--bg-input)] p-5 rounded-[1.5rem] border border-[var(--border-muted)] shadow-inner'>
                       <p className='text-[var(--text-primary)] text-sm font-bold'>Utilisateur de Tulk</p>
                       <p className='text-[var(--text-secondary)] text-[10px] uppercase tracking-widest mt-2 font-mono break-all'>{activeConversation.user.email}</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Group Modal Integration */}
      {groupModal.show && (
        <GroupModal 
          type={groupModal.type} 
          data={groupModal.data} 
          onClose={() => setGroupModal({ show: false, type: 'create', data: null })}
          onRefresh={(groupId) => {
             fetchGroups()
             if (groupId) {
               fetchGroupDetails(groupId)
             }
          }}
        />
      )}

      {/* Standard Modal Integration */}
      <Modal modal={modal} setModal={setModal} />
    </div>
  )
}

export default Messages
