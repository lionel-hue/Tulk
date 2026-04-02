import React, { useState, useEffect } from 'react';
import { Loader2, UserPlus, UserX, Clock, Users, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import Avatar from '../common/Avatar';

const QuickProfileModal = ({ userId, onClose, currentUserId }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (userId) fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/profile/${userId}`);
      if (response.data.success) {
        setProfile(response.data.profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFriendAction = async () => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      if (profile.is_friend) {
        await api.post('/friends/remove', { user_id: userId });
        setProfile(prev => ({ ...prev, is_friend: false }));
      } else if (!profile.has_pending_request) {
        await api.post('/friends/request', { user_id: userId });
        setProfile(prev => ({ ...prev, has_pending_request: true }));
      }
    } catch (error) {
      console.error('Error with friend action:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleFollowAction = async () => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      if (profile.is_following) {
        await api.delete(`/profile/${userId}/follow`);
        setProfile(prev => ({ 
          ...prev, 
          is_following: false, 
          stats: { ...prev.stats, followers: Math.max(0, prev.stats.followers - 1) } 
        }));
      } else {
        await api.post(`/profile/${userId}/follow`);
        setProfile(prev => ({ 
          ...prev, 
          is_following: true, 
          stats: { ...prev.stats, followers: prev.stats.followers + 1 } 
        }));
      }
    } catch (error) {
      console.error('Error with follow action:', error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
         <Loader2 size={32} className="animate-spin text-purple-500" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className='fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300' onClick={onClose}>
       <div 
         className='bg-[var(--bg-secondary)] w-full max-w-sm rounded-[3rem] border border-[var(--border-color)] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300'
         onClick={(e) => e.stopPropagation()}
       >
          {/* Banner */}
          <div className='h-24 bg-gradient-to-r from-purple-600 to-pink-600 relative'>
             {profile.banner && <img src={profile.banner} alt="banner" className='w-full h-full object-cover opacity-80' />}
             <button onClick={onClose} className='absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all'>
                <X size={20} />
             </button>
          </div>

          <div className='px-6 pb-6 relative'>
              {/* Avatar moved up */}
              <div className='flex justify-between items-end -mt-12 mb-4'>
                 <Avatar user={{ image: profile.image, prenom: profile.prenom, nom: profile.nom }} size='w-24 h-24' className='border-4 border-[var(--bg-secondary)] shadow-xl' />
              </div>

              {/* Info */}
              <div className='mb-4'>
                 <h3 className='text-xl font-black text-[var(--text-primary)]'>{profile.prenom} {profile.nom}</h3>
                 <p className='text-xs font-bold text-purple-400 capitalize'>{profile.role || 'Membre'}</p>
              </div>

              {profile.bio && (
                <p className='text-sm text-[var(--text-secondary)] mb-4 leading-relaxed'>
                   {profile.bio}
                </p>
              )}

              {/* Stats & Mutuals */}
              <div className='flex items-center gap-4 text-xs font-bold text-[var(--text-secondary)] mb-6 bg-[var(--bg-input)] p-3 rounded-2xl border border-[var(--border-color)]'>
                 <div className='flex items-center gap-1.5'>
                    <Users size={14} className='text-blue-400' />
                    <span>{profile.mutual_friends_count} ami(s) en commun</span>
                 </div>
              </div>

              {/* Actions */}
              {profile.id !== currentUserId && (
                <div className='flex flex-col gap-3 mb-6'>
                   <button 
                     onClick={handleFriendAction}
                     disabled={actionLoading || profile.has_pending_request}
                     className={`w-full py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all ${
                       profile.is_friend 
                         ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' 
                         : profile.has_pending_request 
                           ? 'bg-orange-500/10 text-orange-500 cursor-not-allowed'
                           : 'bg-purple-600 text-white shadow-xl hover:bg-purple-700'
                     }`}
                   >
                      {actionLoading ? <Loader2 size={16} className='animate-spin' /> : profile.is_friend ? <><UserX size={16} /> Retirer l'ami</> : profile.has_pending_request ? <><Clock size={16} /> Demande envoyée</> : <><UserPlus size={16} /> Ajouter en ami</>}
                   </button>
                   
                   <button 
                     onClick={handleFollowAction}
                     disabled={actionLoading}
                     className={`w-full py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all ${
                       profile.is_following 
                         ? 'bg-[var(--bg-input)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:bg-[var(--bg-hover)]' 
                         : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:from-blue-600 hover:to-blue-700'
                     }`}
                   >
                      {actionLoading ? <Loader2 size={16} className='animate-spin' /> : profile.is_following ? 'Ne plus suivre' : 'Suivre'}
                   </button>
                </div>
              )}

              {/* View Profile */}
              <Link 
                to={`/profile/${profile.id}`}
                className='block w-full text-center py-3 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors'
              >
                Voir le profil complet
              </Link>
          </div>
       </div>
    </div>
  );
};

export default QuickProfileModal;
