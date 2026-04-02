import React, { useState, useEffect } from 'react'
import { 
  X, 
  Camera, 
  Users, 
  UserPlus, 
  Settings, 
  LogOut, 
  UserX, 
  Shield, 
  ShieldCheck, 
  Lock, 
  Unlock,
  Check,
  Search,
  Loader2
} from 'lucide-react'
import api from '../../utils/api'
import Avatar from '../common/Avatar'
import { getImageUrl } from '../../utils/imageUrls'

const GroupModal = ({ type, data, onClose, onRefresh }) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nom: data?.group?.nom || '',
    description: data?.group?.description || '',
    image: null,
    imagePreview: data?.group?.image || null
  })
  
  // Selection for invites
  const [friends, setFriends] = useState([])
  const [selectedFriends, setSelectedFriends] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (type === 'invite') {
      fetchFriends()
    }
  }, [type])

  const fetchFriends = async () => {
    setLoading(true)
    try {
      const response = await api.get('/friends')
      if (response.data.success) {
        setFriends(response.data.friends.data || [])
      }
    } catch (error) {
      console.error('Error fetching friends:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, image: file, imagePreview: URL.createObjectURL(file) })
    }
  }

  const handleCreateGroup = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payLoad = new FormData()
      payLoad.append('nom', formData.nom)
      if (formData.description) {
        payLoad.append('description', formData.description)
      }
      if (formData.image) payLoad.append('image', formData.image)

      const response = await api.post('/groups', payLoad)
      if (response.data.success) {
        onRefresh()
        onClose()
      }
    } catch (error) {
      console.error('Error creating group:', error)
      const errorMsg = error.response?.data?.errors 
        ? Object.values(error.response.data.errors).flat().join(', ')
        : error.response?.data?.message || error.message
      alert(`Erreur: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  const handleInvite = async () => {
    if (selectedFriends.length === 0) return
    setLoading(true)
    try {
      const response = await api.post(`/groups/${data.group.id}/invite`, {
        user_ids: selectedFriends
      })
      if (response.data.success) {
        onRefresh(data.group.id)
        onClose()
      }
    } catch (error) {
      console.error('Error inviting users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLeave = async () => {
    setLoading(true)
    try {
      const response = await api.post(`/groups/${data.group.id}/leave`)
      if (response.data.success) {
        onRefresh()
        onClose()
      }
    } catch (error) {
      console.error('Error leaving group:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleKick = async () => {
    setLoading(true)
    try {
      const response = await api.delete(`/groups/${data.group.id}/members/${data.member.id}`)
      if (response.data.success) {
        onRefresh(data.group.id)
        onClose()
      }
    } catch (error) {
      console.error('Error kicking member:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleSetting = async (field, value) => {
    setLoading(true)
    try {
      const response = await api.patch(`/groups/${data.group.id}/settings`, {
        [field]: value
      })
      if (response.data.success) {
        onRefresh(data.group.id)
        onClose()
      }
    } catch (error) {
      console.error('Error updating settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFriend = (id) => {
    if (selectedFriends.includes(id)) {
      setSelectedFriends(selectedFriends.filter(f => f !== id))
    } else {
      setSelectedFriends([...selectedFriends, id])
    }
  }

  const filteredFriends = friends.filter(f => 
    `${f.prenom} ${f.nom}`.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const renderContent = () => {
    switch (type) {
      case 'create':
        return (
          <form onSubmit={handleCreateGroup} className='space-y-6'>
            <div className='flex flex-col items-center gap-4'>
              <div className='relative group'>
                <div className='w-24 h-24 bg-[var(--bg-input)] rounded-[2rem] border border-[var(--border-color)] flex items-center justify-center overflow-hidden shadow-2xl transition-all group-hover:border-purple-500/50'>
                   {formData.imagePreview ? (
                     <img src={formData.imagePreview} alt='Preview' className='w-full h-full object-cover' />
                   ) : (
                     <Camera size={32} className='text-gray-600' />
                   )}
                </div>
                <label className='absolute -bottom-2 -right-2 p-2 bg-purple-600 text-white rounded-xl cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-xl'>
                  <Camera size={16} />
                  <input type='file' className='hidden' accept='image/*' onChange={handleImageChange} />
                </label>
              </div>
              <p className='text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]'>Image du groupe</p>
            </div>

            <div className='space-y-4'>
               <div className='space-y-2'>
                  <label className='text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-4'>Nom du groupe</label>
                  <input 
                    type='text' 
                    required 
                    placeholder='ex: Amis de Tulk'
                    className='w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[1.5rem] p-4 text-[var(--text-primary)] font-bold placeholder-gray-500 focus:border-purple-500/50 outline-none transition-all'
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  />
               </div>
               <div className='space-y-2'>
                  <label className='text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-4'>Description (Optionnel)</label>
                  <textarea 
                    placeholder='De quoi traite ce groupe ?'
                    className='w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[1.5rem] p-4 text-[var(--text-primary)] font-bold placeholder-gray-500 focus:border-purple-500/50 outline-none transition-all min-h-[100px]'
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
               </div>
            </div>

            <button 
              type='submit' 
              disabled={loading || !formData.nom} 
              className='w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-[1.5rem] shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50'
            >
              {loading ? <Loader2 className='animate-spin mx-auto' size={18} /> : 'Créer le groupe'}
            </button>
          </form>
        )

      case 'invite':
        return (
          <div className='space-y-6'>
             <div className='flex items-center gap-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[1.5rem] px-5 py-3'>
                <Search size={16} className='text-gray-500' />
                <input 
                  type='text' 
                  placeholder='Rechercher un ami...' 
                  className='bg-transparent border-none outline-none text-[var(--text-primary)] w-full text-xs font-bold placeholder-gray-500'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>

             <div className='max-h-64 overflow-y-auto custom-scrollbar space-y-2 pr-2'>
                {loading ? (
                  <div className='flex justify-center py-8'><Loader2 size={24} className='animate-spin text-purple-500' /></div>
                ) : filteredFriends.length === 0 ? (
                  <p className='text-center text-gray-500 py-10 uppercase text-[10px] font-black tracking-widest'>Aucun ami à inviter</p>
                ) : (
                  filteredFriends.map(friend => (
                    <div 
                      key={friend.id} 
                      onClick={() => toggleFriend(friend.id)}
                      className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border ${selectedFriends.includes(friend.id) ? 'bg-purple-500/10 border-purple-500/30' : 'bg-[var(--bg-input)] border-transparent hover:border-[var(--border-color)]'}`}
                    >
                       <div className='flex items-center gap-3'>
                          <Avatar user={friend} size='w-10 h-10' className='rounded-xl' />
                          <span className='text-[var(--text-primary)] text-xs font-bold'>{friend.prenom} {friend.nom}</span>
                       </div>
                       <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedFriends.includes(friend.id) ? 'bg-purple-500 border-purple-500 text-white' : 'border-[var(--border-color)]'}`}>
                          {selectedFriends.includes(friend.id) && <Check size={14} />}
                       </div>
                    </div>
                  ))
                )}
             </div>

             <button 
               onClick={handleInvite} 
               disabled={loading || selectedFriends.length === 0} 
               className='w-full py-4 bg-purple-600 text-white font-black uppercase tracking-widest text-[10px] rounded-[1.5rem] shadow-xl hover:bg-purple-700 transition-all disabled:opacity-50'
             >
               {loading ? <Loader2 className='animate-spin mx-auto' size={18} /> : `Ajouter ${selectedFriends.length} membre(s)`}
             </button>
          </div>
        )

      case 'leave':
        return (
          <div className='text-center space-y-6'>
             <div className='w-20 h-20 bg-orange-500/10 border border-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4'>
                <LogOut size={32} className='text-orange-500' />
             </div>
             <div>
                <h4 className='text-[var(--text-primary)] font-black text-xl mb-2'>Quitter le groupe ?</h4>
                <p className='text-gray-400 text-xs leading-relaxed'>
                   Êtes-vous sûr de vouloir quitter <strong>{data.group.nom}</strong> ? 
                   {data.group.role === 'owner' && " En tant que propriétaire, la responsabilité sera transférée à un autre administrateur ou membre."}
                </p>
             </div>
             <div className='flex gap-3'>
                <button onClick={onClose} className='flex-1 py-4 bg-[var(--bg-input)] text-[var(--text-secondary)] font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-[var(--bg-hover)] transition-all'>Annuler</button>
                <button onClick={handleLeave} className='flex-1 py-4 bg-orange-600 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-orange-700 transition-all shadow-xl'>Confirmer</button>
             </div>
          </div>
        )

      case 'remove':
        return (
          <div className='text-center space-y-6'>
             <div className='w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4'>
                <UserX size={32} className='text-red-500' />
             </div>
             <div>
                <h4 className='text-[var(--text-primary)] font-black text-xl mb-2'>Retirer le membre ?</h4>
                <p className='text-gray-400 text-xs leading-relaxed'>
                   Voulez-vous vraiment retirer <strong>{data.member.prenom}</strong> de ce groupe ?
                </p>
             </div>
             <div className='flex gap-3'>
                <button onClick={onClose} className='flex-1 py-4 bg-[var(--bg-input)] text-[var(--text-secondary)] font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-[var(--bg-hover)] transition-all'>Annuler</button>
                <button onClick={handleKick} className='flex-1 py-4 bg-red-600 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-red-700 transition-all shadow-xl'>Retirer</button>
             </div>
          </div>
        )
      
      case 'settings':
        return (
          <div className='space-y-6'>
             <div className='p-6 bg-[var(--bg-input)] rounded-[2rem] border border-[var(--border-color)] shadow-inner'>
                <h5 className='text-[10px] font-black uppercase tracking-widest text-purple-400 mb-6 flex items-center gap-2'>
                  <Settings size={12} /> Contrôle du groupe
                </h5>
                
                <div className='space-y-4'>
                   <div className='flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] group hover:border-purple-500/30 transition-all'>
                      <div className='flex items-center gap-4'>
                         <div className={`p-3 rounded-xl ${data.group.is_locked ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                            {data.group.is_locked ? <Lock size={18} /> : <Unlock size={18} />}
                         </div>
                         <div>
                            <p className='text-[var(--text-primary)] text-xs font-black'>Fermer le chat</p>
                            <p className='text-[9px] text-gray-500 uppercase tracking-tighter'>Seuls les admins peuvent écrire</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => handleToggleSetting('is_locked', !data.group.is_locked)} 
                        className={`w-12 h-6 rounded-full relative transition-all ${data.group.is_locked ? 'bg-purple-600' : 'bg-gray-700'}`}
                      >
                         <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${data.group.is_locked ? 'right-1' : 'left-1'}`}></div>
                      </button>
                   </div>

                   <div className='flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] group hover:border-purple-500/30 transition-all'>
                      <div className='flex items-center gap-4'>
                         <div className='p-3 bg-blue-500/10 text-blue-400 rounded-xl'>
                            <UserPlus size={18} />
                         </div>
                         <div>
                            <p className='text-[var(--text-primary)] text-xs font-black'>Invitations membres</p>
                            <p className='text-[9px] text-gray-500 uppercase tracking-tighter'>Permettre aux membres d'inviter</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => handleToggleSetting('allow_member_invite', !data.group.allow_member_invite)} 
                        className={`w-12 h-6 rounded-full relative transition-all ${data.group.allow_member_invite ? 'bg-purple-600' : 'bg-gray-700'}`}
                      >
                         <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${data.group.allow_member_invite ? 'right-1' : 'left-1'}`}></div>
                      </button>
                   </div>
                </div>
             </div>
             
             <button onClick={onClose} className='w-full py-4 border border-[var(--border-color)] text-[var(--text-primary)] font-black uppercase text-[10px] tracking-widest rounded-[1.5rem] hover:bg-[var(--bg-hover)] transition-all'>Fermer</button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300'>
       <div className='bg-[var(--bg-secondary)] w-full max-w-md rounded-[3rem] border border-[var(--border-color)] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300'>
          <div className='absolute -top-24 -right-24 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]'></div>
          <div className='absolute -bottom-24 -left-24 w-64 h-64 bg-pink-500/10 rounded-full blur-[80px]'></div>
          
          <div className='p-8 relative'>
             <div className='flex items-center justify-between mb-8'>
                <div className='flex items-center gap-3'>
                   <div className='p-3 bg-[var(--bg-input)] rounded-2xl border border-[var(--border-color)]'>
                      {type === 'create' && <Users size={20} className='text-purple-400' />}
                      {type === 'invite' && <UserPlus size={20} className='text-blue-400' />}
                      {(type === 'leave' || type === 'remove') && <LogOut size={20} className='text-orange-400' />}
                      {type === 'settings' && <Settings size={20} className='text-gray-400' />}
                   </div>
                   <h3 className='text-xl font-black text-[var(--text-primary)] uppercase tracking-widest'>
                      {type === 'create' && 'Nouveau Groupe'}
                      {type === 'invite' && 'Ajouter des Membres'}
                      {type === 'leave' && 'Quitter'}
                      {type === 'remove' && 'Retirer'}
                      {type === 'settings' && 'Paramètres'}
                   </h3>
                </div>
                <button onClick={onClose} className='p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-hover)] rounded-xl transition-all'><X size={24} /></button>
             </div>

             {renderContent()}
          </div>
       </div>
    </div>
  )
}

export default GroupModal
