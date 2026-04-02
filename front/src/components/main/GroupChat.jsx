import React, { useState, useEffect, useRef } from 'react'
import { 
  Send, 
  Image as ImageIcon, 
  Loader2, 
  MoreVertical, 
  Info, 
  Users, 
  X, 
  Smile, 
  Trash2, 
  UserX, 
  UserPlus, 
  Shield, 
  Lock, 
  Unlock, 
  LogOut,
  ChevronLeft
} from 'lucide-react'
import api from '../../utils/api'
import Avatar from '../common/Avatar'
import { getImageUrl } from '../../utils/imageUrls'
import { useAuth } from '../../contexts/AuthContext'
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'
import EmojiPicker from 'emoji-picker-react'
import QuickProfileModal from './QuickProfileModal'

const GroupChat = ({ group, onBack, onUpdate }) => {
  const { user: authUser } = useAuth()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const [selectedProfileId, setSelectedProfileId] = useState(null)
  
  // Pagination
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  
  const fileInputRef = useRef(null)
  const messagesEndRef = useRef(null)
  const actionsRef = useRef(null)
  const pollingInterval = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target)) {
        setShowActions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    fetchMessages(1)
    
    pollingInterval.current = setInterval(() => {
      refreshMessages()
    }, 5000)

    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current)
    }
  }, [group.id])

  const fetchMessages = async (pageNum = 1) => {
    if (pageNum === 1) setLoading(true)
    else setLoadingMore(true)

    try {
      const response = await api.get(`/groups/${group.id}/messages?page=${pageNum}`)
      if (response.data.success) {
        const msgData = response.data.messages.data || []
        const reversed = [...msgData].reverse()
        
        if (pageNum === 1) {
          setMessages(reversed)
          setTimeout(scrollToBottom, 100)
        } else {
          setMessages(prev => [...reversed, ...prev])
        }
        
        setPage(pageNum)
        setHasMore(response.data.messages.has_more)
      }
    } catch (error) {
      console.error('Error fetching group messages:', error)
    } finally {
      setLoading(false)
      setLoadingMore(true)
    }
  }

  const refreshMessages = async () => {
    try {
      const response = await api.get(`/groups/${group.id}/messages?page=1`)
      if (response.data.success) {
        const msgData = response.data.messages.data || []
        const latest = [...msgData].reverse()
        if (latest.length > 0 && (messages.length === 0 || latest[latest.length-1].id !== messages[messages.length-1].id)) {
           setMessages(latest)
           scrollToBottom()
        }
      }
    } catch (error) {
      console.error('Error refreshing messages:', error)
    }
  }

  const loadMore = () => {
    if (hasMore && !loadingMore) {
      fetchMessages(page + 1)
    }
  }

  const { sentinelRef } = useInfiniteScroll(loadMore, hasMore, loadingMore)

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if ((!newMessage.trim() && !selectedImage) || sending) return

    setSending(true)
    try {
      const formData = new FormData()
      formData.append('texte', newMessage)
      if (selectedImage) {
        formData.append('image', selectedImage)
      }

      const response = await api.post(`/groups/${group.id}/messages`, formData)
      if (response.data.success) {
        setMessages([...messages, response.data.message])
        setNewMessage('')
        setSelectedImage(null)
        setImagePreview(null)
        scrollToBottom()
      }
    } catch (error) {
      console.error('Error sending group message:', error)
    } finally {
      setSending(false)
    }
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
    
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    
    if (diffInDays === 0 && date.getDate() === now.getDate()) return timeStr
    if (diffInDays === 1 || (diffInDays === 0 && date.getDate() !== now.getDate())) return `Hier, ${timeStr}`
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  }

  if (loading) {
    return (
      <div className='flex-1 flex items-center justify-center bg-[var(--bg-primary)]'>
        <Loader2 size={32} className='animate-spin text-purple-500' />
      </div>
    )
  }

  const isAdmin = group.role === 'owner' || group.role === 'admin'

  return (
    <div className='flex-1 flex flex-col bg-[var(--bg-primary)] h-full relative overflow-hidden'>
      {/* Group Header */}
      <div className='flex items-center justify-between p-6 border-b border-[var(--border-color)] bg-[var(--glass-bg)] backdrop-blur-xl z-20'>
        <div className='flex items-center gap-4'>
          <button onClick={onBack} className='lg:hidden p-2 -ml-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-hover)] rounded-xl'>
            <ChevronLeft size={24} />
          </button>
          <div className='relative'>
             <Avatar user={{ image: group.image, prenom: group.nom }} size='w-12 h-12' className='rounded-[1.2rem] shadow-lg ring-2 ring-[var(--border-color)]' />
             <div className='absolute -bottom-1 -right-1 p-1 bg-purple-500 rounded-full border-2 border-[var(--bg-secondary)]'>
                <Users size={8} className='text-white' />
             </div>
          </div>
          <div>
            <h3 className='text-[var(--text-primary)] font-black text-lg tracking-tight'>{group.nom}</h3>
            <p className='text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] mt-0.5'>{group.members?.length || group.member_count} membres</p>
          </div>
        </div>
        
        <div className='flex items-center gap-2'>
           <button 
             className={`p-3 rounded-xl transition-all ${showInfo ? 'bg-[var(--bg-input)] text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'}`}
             onClick={() => setShowInfo(!showInfo)}
           >
             <Info size={18} />
           </button>
           <div className='relative' ref={actionsRef}>
              <button 
                className={`p-3 rounded-xl transition-all ${showActions ? 'bg-[var(--bg-input)] text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'}`}
                onClick={() => setShowActions(!showActions)}
              >
                <MoreVertical size={18} />
              </button>
              {showActions && (
                <div className='absolute right-0 mt-2 w-56 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[1.5rem] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-200'>
                   {isAdmin && (
                     <button onClick={() => onUpdate({ type: 'settings', group })} className='w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm font-bold transition-all'>
                       <Shield size={16} className='text-purple-400' /> Gérer le groupe
                     </button>
                   )}
                   <button onClick={() => onUpdate({ type: 'leave', group })} className='w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm font-bold transition-all'>
                     <LogOut size={16} className='text-orange-400' /> Quitter le groupe
                   </button>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Group Messages */}
      <div className='flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6'>
          {hasMore && (
            <div ref={sentinelRef} className='py-4 flex justify-center'>
              <Loader2 size={20} className='animate-spin text-purple-500' />
            </div>
          )}
          {messages.map((msg, index) => {
            const isMe = msg.utilisateur_id === authUser.id
            return (
              <div key={msg.id || index} className={`flex flex-col w-full mb-6 ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`flex flex-row gap-3 ${isMe ? 'flex-row-reverse' : ''} max-w-[85%] md:max-w-[70%]`}>
                  {!isMe && (
                    <div onClick={() => setSelectedProfileId(msg.utilisateur.id)} className='cursor-pointer'>
                      <Avatar user={msg.utilisateur} size='w-8 h-8' className='rounded-xl mt-1 hover:opacity-80 transition-opacity' />
                    </div>
                  )}
                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    {!isMe && (
                      <button onClick={() => setSelectedProfileId(msg.utilisateur.id)} className='text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-1 ml-1 hover:text-purple-400 text-left'>
                        {msg.utilisateur.prenom} {msg.utilisateur.nom}
                      </button>
                    )}
                    <div className={`p-4 rounded-[1.5rem] shadow-xl relative ${isMe ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-tr-sm' : 'bg-[var(--msg-received-bg)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-tl-sm'}`}>
                        {msg.image && (
                          <img src={getImageUrl(msg.image)} alt='Attachment' className='max-w-full rounded-xl mb-2 cursor-pointer' onClick={() => window.open(getImageUrl(msg.image), '_blank')} />
                        )}
                        {msg.texte && <div className='text-sm font-bold leading-relaxed'>{msg.texte}</div>}
                    </div>
                    <span className='text-[8px] font-black uppercase text-[var(--text-secondary)] mt-1 px-2'>{formatDate(msg.created_at)}</span>
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className='p-4 border-t border-[var(--border-color)] bg-[var(--glass-bg)] backdrop-blur-xl z-20'>
          {imagePreview && (
            <div className='absolute bottom-full left-0 p-4 w-full bg-[var(--bg-primary)]/90 backdrop-blur-xl border-t border-[var(--border-color)]'>
               <div className='relative inline-block'>
                  <img src={imagePreview} alt='Preview' className='h-24 rounded-xl border border-[var(--border-color)]' />
                  <button onClick={() => { setSelectedImage(null); setImagePreview(null); }} className='absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full transition-all'><X size={12} /></button>
               </div>
            </div>
          )}
          
          {showEmojiPicker && (
            <div className='absolute bottom-full right-4 mb-4 z-50'>
              <EmojiPicker 
                onEmojiClick={(emojiData) => { setNewMessage(prev => prev + emojiData.emoji); setShowEmojiPicker(false); }}
                theme="dark"
                width={300}
                height={400}
              />
            </div>
          )}

          <form onSubmit={handleSendMessage} className='flex items-end gap-3 max-w-4xl mx-auto w-full'>
              {group.is_locked && !isAdmin ? (
                <div className='flex-1 bg-[var(--bg-hover)] border border-[var(--border-color)] rounded-[2rem] p-4 text-center text-[var(--text-secondary)] text-xs font-bold uppercase tracking-widest'>
                  <Lock size={14} className='inline mr-2' /> Seuls les administrateurs peuvent envoyer des messages
                </div>
              ) : (
                <>
                  <div className='flex items-center gap-2 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[2.5rem] px-2 py-2 flex-1'>
                    <button type='button' onClick={() => fileInputRef.current?.click()} className='p-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-hover)] rounded-full hover:scale-105 transition-all'>
                      <ImageIcon size={20} />
                    </button>
                    <input type='file' ref={fileInputRef} onChange={handleImageSelect} accept='image/*' className='hidden' />
                    <input 
                      type='text' 
                      placeholder='Écrivez un message collectif...' 
                      className='bg-transparent border-none outline-none text-[var(--text-primary)] w-full px-2 py-3 text-sm font-bold placeholder-gray-500'
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button type='button' className='p-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-hover)] rounded-full' onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                      <Smile size={20} />
                    </button>
                  </div>
                  <button type='submit' className='w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all'>
                    {sending ? <Loader2 size={20} className='animate-spin' /> : <Send size={20} />}
                  </button>
                </>
              )}
          </form>
      </div>

      {/* Info Sidebar Overlay */}
      {showInfo && (
        <div className='absolute border-l border-[var(--border-color)] inset-y-0 right-0 w-80 bg-[var(--bg-secondary)] z-50 animate-in slide-in-from-right duration-300 shadow-2xl flex flex-col'>
           <div className='p-6 border-b border-[var(--border-color)] flex items-center justify-between'>
              <h4 className='text-[var(--text-primary)] font-black uppercase tracking-widest text-sm'>Détails du groupe</h4>
              <button onClick={() => setShowInfo(false)} className='p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-xl'><X size={20} /></button>
           </div>
           
           <div className='flex-1 overflow-y-auto custom-scrollbar p-6'>
              <div className='flex flex-col items-center mb-8'>
                 <Avatar user={{ image: group.image, prenom: group.nom }} size='w-24 h-24' className='mb-4 rounded-[2rem]' />
                 <h4 className='text-lg font-black text-[var(--text-primary)]'>{group.nom}</h4>
                 <p className='text-xs text-[var(--text-secondary)] text-center mt-2'>{group.description || 'Pas de description'}</p>
              </div>

              <div className='space-y-6'>
                 <div>
                    <h5 className='text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-4'>Membres ({group.members?.length})</h5>
                    <div className='space-y-3'>
                       {group.members?.map(member => (
                         <div key={member.id} className='flex items-center justify-between group'>
                            <div className='flex items-center gap-3'>
                               <div onClick={() => member.id !== authUser.id && setSelectedProfileId(member.id)} className={member.id !== authUser.id ? 'cursor-pointer' : ''}>
                                 <Avatar user={member} size='w-10 h-10' className='rounded-xl hover:opacity-80 transition-opacity' />
                               </div>
                               <div>
                                  <button 
                                    onClick={() => member.id !== authUser.id && setSelectedProfileId(member.id)} 
                                    className={`text-[var(--text-primary)] text-xs font-bold transition-colors text-left ${member.id !== authUser.id ? 'hover:text-purple-400 cursor-pointer' : ''}`}
                                  >
                                    {member.prenom} {member.nom}
                                  </button>
                                  <p className='text-[8px] font-black uppercase tracking-widest text-purple-400'>{member.role}</p>
                               </div>
                            </div>
                            <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                               {isAdmin && member.id !== authUser.id && member.role !== 'owner' && (
                                 <button onClick={() => onUpdate({ type: 'remove', group, member })} className='p-2 text-[var(--text-secondary)] hover:text-red-400 hover:bg-[var(--bg-hover)] rounded-lg'><UserX size={14} /></button>
                               )}
                            </div>
                         </div>
                       ))}
                       {(isAdmin || group.allow_member_invite) && (
                         <button onClick={() => onUpdate({ type: 'invite', group })} className='w-full flex items-center justify-center gap-2 p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl hover:bg-purple-500/20 transition-all font-bold text-xs'>
                           <UserPlus size={14} /> Ajouter des membres
                         </button>
                       )}
                    </div>
                 </div>
                 
                 <div>
                    <h5 className='text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-4'>Paramètres rapides</h5>
                    <div className='space-y-2'>
                       <div className='flex items-center justify-between p-3 bg-[var(--bg-input)] rounded-xl border border-[var(--border-color)]'>
                          <span className='text-xs text-[var(--text-secondary)] font-bold'>Chat fermé</span>
                          {isAdmin ? (
                            <button onClick={() => onUpdate({ type: 'lock', group })} className={`p-1.5 rounded-lg transition-all ${group.is_locked ? 'bg-red-500/20 text-red-400' : 'bg-[var(--bg-hover)] text-[var(--text-secondary)]'}`}>
                               {group.is_locked ? <Lock size={16} /> : <Unlock size={16} />}
                            </button>
                          ) : (
                            <span className='text-[var(--text-secondary)]'>{group.is_locked ? 'Oui' : 'Non'}</span>
                          )}
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {selectedProfileId && (
        <QuickProfileModal
          userId={selectedProfileId}
          currentUserId={authUser.id}
          onClose={() => setSelectedProfileId(null)}
        />
      )}
    </div>
  )
}

export default GroupChat
