import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../utils/api'
import Avatar from '../common/Avatar'
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
  Info
} from 'lucide-react'

const Messages = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { user: authUser } = useAuth()
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
  
  const fileInputRef = useRef(null)
  const messagesEndRef = useRef(null)
  const pollingInterval = useRef(null)

  const userIdParam = searchParams.get('userId')

  useEffect(() => {
    fetchConversations()
    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current)
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

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

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
    <div className='premium-chat-layout animate-fade-in'>
      {/* Search & List Sidebar */}
      <div className={`premium-sidebar ${activeConversation ? 'hidden lg:flex' : 'flex'}`}>
        <div className='premium-sidebar-header'>
          <h2>Discussions</h2>
          <div className='premium-search-wrapper'>
            <Search size={18} className='text-gray-500' />
            <input 
              type='text' 
              placeholder='Rechercher un ami...' 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className='premium-conversations-scroll custom-scrollbar'>
          {filteredConversations.length === 0 ? (
            <div className='premium-empty-state'>
              <div className='icon-circle'>
                <MessageCircle size={32} />
              </div>
              <p>{searchQuery ? 'Aucun ami trouvé' : 'Commencez à discuter'}</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div 
                key={conv.user.id}
                onClick={() => handleSelectConversation(conv)}
                className={`premium-conv-item ${activeConversation?.user.id === conv.user.id ? 'active' : ''}`}
              >
                <div className='avatar-wrapper'>
                  <Avatar user={conv.user} size='w-12 h-12' />
                  <span className='online-status-dot'></span>
                </div>
                <div className='conv-item-content'>
                  <div className='conv-item-top'>
                    <span className='conv-name'>{conv.user.prenom} {conv.user.nom}</span>
                    <span className='conv-time'>{conv.last_message ? formatDate(conv.last_message.date) : ''}</span>
                  </div>
                  <div className='conv-item-preview'>
                    {conv.last_message?.image && <ImageIcon size={14} className='inline mr-1' />}
                    {conv.last_message?.texte || (conv.last_message?.image ? 'Image' : 'Envoyer un message')}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`premium-chat-area ${!activeConversation ? 'hidden lg:flex' : 'flex'}`}>
        {activeConversation ? (
          <>
            {/* Header */}
            <div className='premium-chat-header'>
              <div className='header-left'>
                <button onClick={() => setActiveConversation(null)} className='lg:hidden p-2 -ml-2 text-gray-400 hover:text-white'>
                  <ChevronLeft size={24} />
                </button>
                <Avatar user={activeConversation.user} size='w-11 h-11' isLink={true} className='ring-2 ring-purple-500/20' />
                <div className='header-info'>
                  <Link to={`/profile/${activeConversation.user.id}`} className='user-name'>
                    {activeConversation.user.prenom} {activeConversation.user.nom}
                  </Link>
                  <div className='user-status'>
                    <span className='dot'></span>
                    <span>En ligne</span>
                  </div>
                </div>
              </div>
              <div className='header-actions'>
                 <button className='action-btn'><Search size={20} /></button>
                 <button className='action-btn'><Info size={20} /></button>
                 <button className='action-btn'><MoreVertical size={20} /></button>
              </div>
            </div>

            {/* Content */}
            <div className='premium-history custom-scrollbar'>
              <div className='history-spacer'></div>
              {messagesLoading && messages.length === 0 ? (
                <div className='history-loading'>
                  <Loader2 size={24} className='animate-spin text-purple-500' />
                </div>
              ) : (
                <div className='messages-stack'>
                  <div className='date-divider'>Aujourd'hui</div>
                  {messages.map((msg, index) => {
                    const isMe = msg.id_uti_1 === authUser.id
                    return (
                      <div key={msg.id || index} className={`bubble-group ${isMe ? 'my-bubble' : 'other-bubble'}`}>
                        <div className='bubble-meta'>
                           {!isMe && <span className='sender-name'>{activeConversation.user.prenom}</span>}
                        </div>
                        <div className={`bubble-content ${msg.image ? 'has-image' : ''}`}>
                          {msg.image && (
                            <div className='bubble-image'>
                              <img src={getImageUrl(msg.image)} alt='Attachment' onClick={() => window.open(getImageUrl(msg.image), '_blank')} />
                            </div>
                          )}
                          {msg.texte && <div className='bubble-text'>{msg.texte}</div>}
                          <span className='bubble-time'>{formatDate(msg.date)}</span>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Footer */}
            <div className='premium-input-footer'>
               {imagePreview && (
                  <div className='premium-preview-bar'>
                     <div className='preview-item'>
                        <img src={imagePreview} alt='Preview' />
                        <button onClick={clearImage} className='remove-btn'><X size={14} /></button>
                     </div>
                  </div>
               )}
               <form onSubmit={handleSendMessage} className='premium-input-container'>
                 <div className='input-addon'>
                   <button type='button' onClick={() => fileInputRef.current?.click()} className={selectedImage ? 'active' : ''}>
                     <ImageIcon size={22} />
                   </button>
                   <input 
                    type='file' 
                    ref={fileInputRef} 
                    onChange={handleImageSelect} 
                    accept='image/*' 
                    className='hidden' 
                   />
                 </div>
                 <div className='input-field'>
                   <input 
                    type='text' 
                    placeholder='Tapez votre message...' 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                   />
                   <button type='button' className='emoji-btn'><Smile size={22} /></button>
                 </div>
                 <button 
                  type='submit' 
                  className='send-btn' 
                  disabled={(!newMessage.trim() && !selectedImage) || sending}
                 >
                   {sending ? <Loader2 size={18} className='animate-spin' /> : <Send size={20} />}
                 </button>
               </form>
            </div>
          </>
        ) : (
          <div className='premium-chat-empty'>
             <div className='empty-artwork'>
                <div className='pattern-circles'></div>
                <MessageCircle size={80} className='main-icon' />
             </div>
             <h3>Bienvenue sur Tulk Chat</h3>
             <p>Sélectionnez un contact pour démarrer une conversation sécurisée et instantanée.</p>
             <button className='new-chat-btn'>Nouvelle discussion</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Messages
