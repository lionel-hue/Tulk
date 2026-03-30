import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../utils/api'
import Avatar from '../common/Avatar'
import { 
  Send, 
  Search, 
  MoreVertical, 
  Image as ImageIcon, 
  MessageCircle,
  Loader2,
  ChevronLeft
} from 'lucide-react'

const Messages = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { user: authUser } = useAuth()
  const [conversations, setConversations] = useState([])
  const [activeConversation, setActiveConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
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
    if (userIdParam && conversations.length > 0) {
      const conv = conversations.find(c => c.user.id === parseInt(userIdParam))
      if (conv) {
        handleSelectConversation(conv)
      } else {
        // If not in conversations list, we might need to fetch the user info
        fetchTargetUser(userIdParam)
      }
    }
  }, [userIdParam, conversations.length])

  const fetchConversations = async () => {
    try {
      const response = await api.get('/messages/conversations')
      if (response.data.success) {
        setConversations(response.data.conversations)
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

  // Polling for new messages
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
  }, [activeConversation])

  const refreshMessages = async (userId) => {
    try {
      const response = await api.get(`/messages/${userId}`)
      if (response.data.success) {
        // Only update if count changed or last message is different
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

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeConversation || sending) return

    setSending(true)
    try {
      const response = await api.post('/messages', {
        receiver_id: activeConversation.user.id,
        texte: newMessage
      })
      if (response.data.success) {
        setMessages([...messages, response.data.message])
        setNewMessage('')
        scrollToBottom()
        fetchConversations() // Update sidebar
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
      <div className='flex items-center justify-center h-full'>
        <Loader2 className='h-8 w-8 animate-spin text-purple-500' />
      </div>
    )
  }

  return (
    <div className='messages-container animate-fade-in'>
      {/* Sidebar */}
      <div className={`messages-sidebar ${activeConversation ? 'hidden lg:flex' : 'flex'}`}>
        <div className='messages-header'>
          <h3>Messages</h3>
        </div>
        <div className='conversations-list custom-scrollbar'>
          {conversations.length === 0 ? (
            <div className='text-center py-12 opacity-50'>
              <MessageCircle size={40} className='mx-auto mb-3' />
              <p className='text-sm'>Aucune conversation</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div 
                key={conv.user.id}
                onClick={() => handleSelectConversation(conv)}
                className={`conversation-item ${activeConversation?.user.id === conv.user.id ? 'active' : ''}`}
              >
                <Avatar user={conv.user} size='w-12 h-12' />
                <div className='conversation-info'>
                  <div className='conversation-name truncate'>
                    {conv.user.prenom} {conv.user.nom}
                  </div>
                  <div className='conversation-last-msg'>
                    {conv.last_message?.texte || 'Envoyez un message...'}
                  </div>
                </div>
                {conv.last_message && (
                  <span className='text-[10px] text-gray-500 whitespace-nowrap mt-[-1rem]'>
                    {formatDate(conv.last_message.date)}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`messages-main ${!activeConversation ? 'hidden lg:flex' : 'flex'}`}>
        {activeConversation ? (
          <>
            <div className='chat-header'>
              <div className='chat-user-info'>
                <button 
                  onClick={() => setActiveConversation(null)}
                  className='lg:hidden p-2 -ml-2 text-gray-400 hover:text-white'
                >
                  <ChevronLeft size={24} />
                </button>
                <Avatar user={activeConversation.user} size='w-10 h-10' />
                <div>
                  <h4 className='text-white font-semibold'>
                    {activeConversation.user.prenom} {activeConversation.user.nom}
                  </h4>
                  <span className='text-xs text-green-500 flex items-center gap-1'>
                    <span className='w-1.5 h-1.5 rounded-full bg-green-500'></span> En ligne
                  </span>
                </div>
              </div>
              <button className='p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5'>
                <MoreVertical size={20} />
              </button>
            </div>

            <div className='messages-history custom-scrollbar'>
              {messagesLoading && messages.length === 0 ? (
                <div className='flex items-center justify-center h-full'>
                  <Loader2 className='h-6 w-6 animate-spin text-purple-500' />
                </div>
              ) : (
                <>
                  {messages.map((msg, index) => {
                    const isSentByMe = msg.id_uti_1 === authUser.id
                    return (
                      <div 
                        key={msg.id || index}
                        className={`message-bubble ${isSentByMe ? 'message-sent' : 'message-received'}`}
                      >
                        <p>{msg.texte}</p>
                        <span className='message-time'>
                          {formatDate(msg.date)}
                        </span>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            <div className='chat-input-area'>
              <form onSubmit={handleSendMessage} className='chat-input-wrapper'>
                <button type='button' className='p-2 text-gray-400 hover:text-white transition-colors'>
                  <ImageIcon size={20} />
                </button>
                <input 
                  type='text' 
                  placeholder='Écrivez votre message...'
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button 
                  type='submit' 
                  disabled={!newMessage.trim() || sending}
                  className='chat-send-btn'
                >
                  {sending ? <Loader2 size={18} className='animate-spin' /> : <Send size={18} />}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className='messages-placeholder'>
            <div className='w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4'>
              <MessageCircle size={40} className='text-purple-400' />
            </div>
            <h3>Vos messages</h3>
            <p>Sélectionnez une conversation pour commencer à discuter avec vos amis.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Messages
