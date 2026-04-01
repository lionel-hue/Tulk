import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../utils/api'
import Avatar from '../common/Avatar'
import Modal, { useModal } from '../Modal'
import { getImageUrl } from '../../utils/imageUrls'
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
  Grid
} from 'lucide-react'

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
  
  // Advanced Features State
  const [showChatSearch, setShowChatSearch] = useState(false)
  const [chatSearchQuery, setChatSearchQuery] = useState('')
  const [showActions, setShowActions] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  
  const emojis = ['❤️', '😂', '😮', '😢', '😡', '👍', '🔥', '👏', '🙌', '✨', '😊', '😍', '🤔', '😎', '🙏', '💯']
  
  const fileInputRef = useRef(null)
  const messagesEndRef = useRef(null)
  const pollingInterval = useRef(null)
  const actionsRef = useRef(null)

  const userIdParam = searchParams.get('userId')

  useEffect(() => {
    fetchConversations()
    const handleClickOutside = (event) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target)) {
        setShowActions(false)
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

  const fetchConversations = async () => {
    try {
      const response = await api.get('/messages/conversations')
      if (response.data.success) {
        setConversations(response.data.conversations)
        setFilteredConversations(response.data.conversations)
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
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

  const fetchMessages = async (userId) => {
    setMessagesLoading(true)
    try {
      const response = await api.get(`/messages/${userId}`)
      if (response.data.success) {
        setMessages(response.data.messages)
        scrollToBottom()
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setMessagesLoading(false)
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
      const response = await api.get(`/messages/${userId}`)
      if (response.data.success) {
        if (response.data.messages.length !== messages.length) {
          setMessages(response.data.messages)
          scrollToBottom()
        }
      }
    } catch (error) {
      console.error('Error refreshing messages:', error)
    }
  }

  const handleSelectConversation = (conv) => {
    setActiveConversation(conv)
    setSearchParams({ userId: conv.user.id })
    fetchMessages(conv.user.id)
    setShowInfo(false)
    setShowActions(false)
    setShowChatSearch(false)
    setChatSearchQuery('')
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
      // Assuming we can clear locally for now as requested
      setMessages([])
      setShowActions(false)
      setModal({
        show: true,
        type: 'success',
        title: 'Succès',
        message: 'Conversation vidée'
      })
    } catch (err) {
      console.error('Error clearing history:', err)
      setModal({
        show: true,
        type: 'error',
        title: 'Erreur',
        message: 'Échec du vidage'
      })
    }
  }

  const handleBlockUser = async () => {
    if (!activeConversation) return
    
    const confirmed = await confirm(`Voulez-vous vraiment bloquer ${activeConversation.user.prenom} ? Vous ne pourrez plus échanger de messages.`, 'Bloquer l\'utilisateur')
    if (!confirmed) return
    
    try {
      const response = await api.post('/blocks/block', {
        user_id: activeConversation.user.id
      })
      if (response.data.success) {
        setModal({
          show: true,
          type: 'success',
          title: 'Utilisateur bloqué',
          message: `${activeConversation.user.prenom} a été bloqué.`
        })
        setActiveConversation(null)
        fetchConversations()
      }
    } catch (err) {
      console.error('Error blocking user:', err)
      setModal({
        show: true,
        type: 'error',
        title: 'Erreur',
        message: err.response?.data?.message || 'Échec du blocage'
      })
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

  // Extract shared images for info panel
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
    <div className='premium-chat-layout animate-fade-in mobile-responsive-height flex bg-[#060606] h-[calc(100vh-80px)] overflow-hidden rounded-[3rem] border border-white/5 shadow-2xl mt-4 mx-4 md:mt-8 md:mx-8 mb-4 max-w-7xl lg:mx-auto'>
      {/* Search & List Sidebar */}
      <div className={`bg-[#0f0f0f] flex-col border-r border-white/5 w-full lg:w-96 flex-shrink-0 relative ${activeConversation ? 'hidden lg:flex' : 'flex'}`}>
        <div className='p-8 border-b border-white/5 relative overflow-hidden'>
          <div className='absolute -top-12 -left-12 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px]'></div>
          <h2 className='text-3xl font-black text-white tracking-tighter mb-6 relative'>Discussions</h2>
          <div className='flex items-center gap-3 bg-white/5 border border-white/10 rounded-[2rem] px-5 py-4 w-full backdrop-blur-md focus-within:border-purple-500/50 focus-within:shadow-[0_0_20px_rgba(168,85,247,0.1)] transition-all relative'>
            <Search size={18} className='text-gray-400' />
            <input 
              type='text' 
              placeholder='Rechercher un ami...' 
              className='bg-transparent border-none outline-none text-white w-full placeholder-gray-600 text-sm font-bold tracking-wide'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className='flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1'>
          {filteredConversations.length === 0 ? (
            <div className='flex flex-col items-center justify-center p-8 mt-4 bg-white/5 rounded-[2.5rem] border border-dashed border-white/10 text-center mx-2 group'>
              <div className='w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                <MessageCircle size={24} className='text-gray-600' />
              </div>
              <p className='text-[10px] font-black uppercase tracking-widest text-gray-500'>{searchQuery ? 'Aucun ami trouvé' : 'Commencez à discuter'}</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div 
                key={conv.user.id}
                onClick={() => handleSelectConversation(conv)}
                className={`flex items-center gap-4 p-4 rounded-[2rem] cursor-pointer transition-all duration-500 border border-transparent ${activeConversation?.user.id === conv.user.id ? 'bg-white/10 border-white/10 shadow-xl ml-2' : 'hover:bg-white/5 hover:border-white/5'}`}
              >
                <div className='relative flex-shrink-0'>
                  <Avatar user={conv.user} size='w-12 h-12' className='rounded-[1.2rem] shadow-lg' />
                  <span className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#0f0f0f] rounded-full'></span>
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center justify-between mb-1'>
                    <span className='text-white font-bold text-sm truncate'>{conv.user.prenom} {conv.user.nom}</span>
                    <span className='text-[9px] font-black text-gray-500 uppercase tracking-widest flex-shrink-0 ml-2'>{conv.last_message ? formatDate(conv.last_message.date) : ''}</span>
                  </div>
                  <div className='text-xs font-medium text-gray-400 truncate'>
                    {conv.last_message?.image && <ImageIcon size={12} className='inline mr-1 text-purple-400' />}
                    {conv.last_message?.texte || (conv.last_message?.image ? 'Image partagée' : 'Envoyer un message')}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex col bg-[#060606] relative ${!activeConversation ? 'hidden lg:flex' : 'flex flex-col'}`}>
        {activeConversation ? (
          <>
            {/* Header */}
            <div className='flex items-center justify-between p-6 border-b border-white/5 bg-[#0f0f0f]/60 backdrop-blur-xl z-20'>
              <div className='flex items-center gap-4'>
                <button onClick={() => setActiveConversation(null)} className='lg:hidden p-2 -ml-2 text-gray-400 hover:text-white bg-white/5 rounded-xl'>
                  <ChevronLeft size={24} />
                </button>
                <div className='relative'>
                  <Avatar user={activeConversation.user} size='w-12 h-12' isLink={true} className='rounded-[1.2rem] shadow-lg ring-2 ring-white/10' />
                  <span className='absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-[#0a0a0a] rounded-full'></span>
                </div>
                <div>
                  <Link to={`/profile/${activeConversation.user.id}`} className='text-white font-black text-lg hover:text-purple-400 transition-colors tracking-tight'>
                    {activeConversation.user.prenom} {activeConversation.user.nom}
                  </Link>
                  <p className='text-[10px] font-black uppercase tracking-widest text-gray-500 mt-0.5'>En ligne</p>
                </div>
              </div>
              <div className='flex items-center gap-2 bg-white/5 p-1.5 rounded-[2rem] border border-white/5'>
                 <button className={`p-3 rounded-xl transition-all ${showChatSearch ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`} onClick={() => { setShowChatSearch(!showChatSearch); if(showChatSearch) setChatSearchQuery(''); }}><Search size={18} /></button>
                 <button className={`p-3 rounded-xl transition-all ${showInfo ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`} onClick={() => setShowInfo(!showInfo)}><Info size={18} /></button>
                 <div className='relative' ref={actionsRef}>
                    <button className={`p-3 rounded-xl transition-all ${showActions ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`} onClick={() => setShowActions(!showActions)}><MoreVertical size={18} /></button>
                    {showActions && (
                      <div className='absolute right-0 mt-2 w-56 bg-[#141414] border border-white/10 rounded-[1.5rem] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-200'>
                        <button onClick={handleClearHistory} className='w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white text-sm font-bold transition-all'><Trash2 size={16} className='text-red-400' /> Vider la conversation</button>
                        <button onClick={handleBlockUser} className='w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white text-sm font-bold transition-all'><UserX size={16} className='text-orange-400' /> Bloquer</button>
                        <button className='w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white text-sm font-bold transition-all'><Flag size={16} className='text-blue-400' /> Signaler</button>
                      </div>
                    )}
                 </div>
              </div>

              {/* Chat Search Overlay */}
              {showChatSearch && (
                <div className='absolute top-full left-0 right-0 p-4 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5 z-10 animate-in slide-in-from-top-2 duration-300'>
                   <div className='flex items-center gap-3 bg-white/5 border border-white/10 rounded-[2rem] px-5 py-3 w-full max-w-xl mx-auto'>
                      <Search size={16} className='text-gray-400' />
                      <input 
                       type='text' 
                       placeholder='Rechercher dans les messages...' 
                       className='bg-transparent border-none outline-none text-white w-full text-sm font-bold placeholder-gray-600'
                       value={chatSearchQuery}
                       autoFocus
                       onChange={(e) => setChatSearchQuery(e.target.value)}
                      />
                      <button onClick={() => { setShowChatSearch(false); setChatSearchQuery(''); }} className='p-1 text-gray-500 hover:text-white bg-white/5 rounded-full'><X size={14} /></button>
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
                  {filteredMessages.length === 0 && chatSearchQuery && (
                    <div className='text-center text-gray-500 text-sm font-bold bg-white/5 py-3 rounded-2xl border border-white/5'>Aucun message trouvé pour "{chatSearchQuery}"</div>
                  )}
                  {filteredMessages.map((msg, index) => {
                    const isMe = msg.id_uti_1 === authUser.id
                    return (
                      <div key={msg.id || index} className={`flex flex-col w-full mb-6 ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`flex flex-col max-w-[85%] md:max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                          {!isMe && <span className='text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-2'>{activeConversation.user.prenom}</span>}
                          <div className={`p-4 md:p-5 rounded-[2rem] shadow-2xl relative overflow-hidden ${isMe ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-tr-sm shadow-[0_10px_30px_rgba(168,85,247,0.3)]' : 'bg-[#141414] border border-white/5 text-white rounded-tl-sm backdrop-blur-md'}`}>
                            {msg.image && (
                              <div className='rounded-2xl overflow-hidden mb-3 ring-1 ring-white/20 relative group'>
                                <img src={getImageUrl(msg.image)} alt='Attachment' className='w-full max-h-64 object-cover cursor-pointer group-hover:scale-105 transition-transform duration-700' onClick={() => window.open(getImageUrl(msg.image), '_blank')} />
                              </div>
                            )}
                            {msg.texte && <div className='text-sm md:text-base font-medium leading-relaxed whitespace-pre-wrap'>{msg.texte}</div>}
                          </div>
                          <span className={`text-[9px] font-black uppercase tracking-widest text-gray-500 mt-2 ${isMe ? 'mr-2' : 'ml-2'}`}>{formatDate(msg.date)}</span>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

             {/* Input Footer */}
             <div className='p-4 border-t border-white/5 bg-[#0a0a0a]/90 backdrop-blur-xl relative z-20'>
                {imagePreview && (
                   <div className='absolute bottom-full left-0 p-4 w-full bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-white/5 animate-in slide-in-from-bottom-2 duration-200'>
                      <div className='relative inline-block'>
                         <img src={imagePreview} alt='Preview' className='h-32 rounded-2xl border border-white/10 shadow-2xl object-cover' />
                         <button onClick={clearImage} className='absolute -top-3 -right-3 p-1.5 bg-[#0f0f0f] border border-white/20 hover:border-red-500 hover:text-red-500 text-white rounded-full transition-all shadow-xl'><X size={14} /></button>
                      </div>
                   </div>
                )}
                
                {showEmojiPicker && (
                  <div className='absolute bottom-full right-4 mb-4 p-4 bg-[#141414] border border-white/10 rounded-[2rem] shadow-2xl animate-in zoom-in-95 duration-200 w-64'>
                    <div className='grid grid-cols-4 gap-3'>
                      {emojis.map(emoji => (
                        <button key={emoji} type='button' onClick={() => { setNewMessage(prev => prev + emoji); setShowEmojiPicker(false); }} className='w-10 h-10 flex items-center justify-center text-xl bg-white/5 hover:bg-white/10 rounded-xl transition-all hover:scale-110 active:scale-95'>
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <form onSubmit={handleSendMessage} className='flex items-end gap-3 max-w-4xl mx-auto w-full relative'>
                  <div className='flex items-center gap-2 bg-[#0f0f0f] border border-white/10 rounded-[2.5rem] px-2 py-2 flex-1 shadow-inner focus-within:border-purple-500/50 focus-within:ring-1 focus-within:ring-purple-500/50 transition-all'>
                    <button type='button' onClick={() => fileInputRef.current?.click()} className={`p-3 rounded-full transition-all flex-shrink-0 ${selectedImage ? 'bg-purple-500/20 text-purple-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
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
                     className='bg-transparent border-none outline-none text-white w-full px-2 py-3 text-sm font-medium placeholder-gray-500 min-h-[44px]'
                     value={newMessage}
                     onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button 
                      type='button' 
                      className={`p-3 rounded-full transition-all flex-shrink-0 ${showEmojiPicker ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
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
        ) : (
          <div className='flex-1 flex flex-col items-center justify-center text-center p-8 relative overflow-hidden'>
             <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(168,85,247,0.05),transparent_60%)]'></div>
             <div className='relative mb-8'>
                <div className='absolute -inset-8 bg-purple-500/5 rounded-full blur-2xl animate-pulse'></div>
                <div className='w-32 h-32 bg-white/5 border border-white/10 rounded-full flex items-center justify-center shadow-2xl relative z-10'>
                  <MessageCircle size={48} className='text-gray-500' />
                </div>
             </div>
             <h3 className='text-2xl font-black text-white tracking-tighter mb-4 z-10'>Bienvenue sur Tulk Chat</h3>
             <p className='text-gray-500 font-bold text-sm max-w-md mx-auto mb-8 leading-relaxed z-10'>Sélectionnez un contact pour démarrer une conversation sécurisée et instantanée avec nos composants en verre.</p>
             <button className='px-8 py-4 rounded-[2rem] bg-white text-black font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all z-10' onClick={() => document.querySelector('input[placeholder="Rechercher un ami..."]')?.focus()}>Nouvelle discussion</button>
          </div>
        )}
      </div>

      {/* Modal Integration */}
      <Modal modal={modal} setModal={setModal} />

      {/* Info Sidebar */}
      {activeConversation && (
        <div className={`bg-[#0a0a0a] border-l border-white/5 w-80 lg:w-96 flex-col absolute lg:relative right-0 top-0 bottom-0 z-40 transform transition-transform duration-500 ${showInfo ? 'translate-x-0 flex' : 'translate-x-full lg:hidden lg:translate-x-0'}`}>
           <div className='flex-1 overflow-y-auto custom-scrollbar pb-10'>
              <div className='flex items-center justify-between p-6 border-b border-white/5 bg-[#0f0f0f]/60 backdrop-blur-xl sticky top-0 z-10'>
                 <h3 className='text-xl font-black text-white tracking-tighter'>Détails</h3>
                 <button onClick={() => setShowInfo(false)} className='p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all'><X size={20} /></button>
              </div>
              
              <div className='flex flex-col items-center p-8 border-b border-white/5'>
                 <div className='relative mb-4 group'>
                    <div className='absolute -inset-4 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-all duration-700'></div>
                    <Avatar user={activeConversation.user} size='w-32 h-32' className='relative z-10 shadow-2xl rounded-[3rem] ring-4 ring-[#0f0f0f]' />
                 </div>
                 <h4 className='text-xl font-black text-white tracking-tighter text-center'>{activeConversation.user.prenom} {activeConversation.user.nom}</h4>
                 <div className='flex items-center gap-2 mt-3 bg-green-500/10 px-3 py-1.5 rounded-[1rem] border border-green-500/20'>
                    <span className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></span>
                    <span className='text-[10px] font-black uppercase tracking-widest text-green-500'>En ligne</span>
                 </div>
              </div>

              <div className='p-6 space-y-8'>
                 <div>
                    <div className='flex items-center gap-2 mb-4 text-gray-400'>
                       <Grid size={16} /> 
                       <span className='text-[10px] font-black uppercase tracking-widest'>Médias partagés</span>
                    </div>
                    <div className='grid grid-cols-3 gap-2'>
                       {sharedImages.length === 0 ? (
                         <div className='col-span-3 text-center p-6 bg-white/5 rounded-[1.5rem] border border-dashed border-white/10 text-[10px] font-black text-gray-500 uppercase tracking-widest'>Aucun média partagé</div>
                       ) : (
                         sharedImages.map((img, idx) => (
                           <div key={idx} className='aspect-square rounded-[1rem] overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border border-white/10 relative group' onClick={() => window.open(getImageUrl(img), '_blank')}>
                              <img src={getImageUrl(img)} alt='Shared' className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500' />
                           </div>
                         ))
                       )}
                    </div>
                 </div>

                 <div>
                    <div className='flex items-center gap-2 mb-4 text-gray-400'>
                       <Info size={16} /> 
                       <span className='text-[10px] font-black uppercase tracking-widest'>À propos</span>
                    </div>
                    <div className='bg-white/5 p-5 rounded-[1.5rem] border border-white/5 shadow-inner'>
                       <p className='text-gray-300 text-sm font-bold'>Utilisateur de Tulk</p>
                       <p className='text-gray-500 text-[10px] uppercase tracking-widest mt-2 font-mono break-all'>{activeConversation.user.email}</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  )
}

export default Messages
