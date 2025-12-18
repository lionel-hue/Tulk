// resources/js/components/main/Amitie.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getImageUrl } from '../../utils/imageUrls';
import api from '../../utils/api'; // Corrected import
import Modal, { useModal } from '../Modal';
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
} from 'lucide-react';

const Amitie = ({ searchQuery, onSearchFocus, onSearchBlur }) => {
    const { user } = useAuth();
    const { modal, setModal, confirm } = useModal();
    
    const [friends, setFriends] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState({
        friends: false,
        suggestions: false,
        pending: false,
        search: false
    });
    const [activeTab, setActiveTab] = useState('friends');
    const [isSearching, setIsSearching] = useState(false);
    const searchTimeoutRef = useRef(null);

    // Load friends, suggestions, and pending requests on mount
    useEffect(() => {
        console.log('Amitie component mounted, isSearching:', isSearching);
        if (!isSearching) {
            loadFriends();
            loadSuggestions();
            loadPendingRequests();
        }
    }, [isSearching]);

    // Handle search query changes
    useEffect(() => {
        if (searchQuery && searchQuery.trim().length >= 2) {
            setIsSearching(true);
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
            
            searchTimeoutRef.current = setTimeout(() => {
                handleSearch(searchQuery);
            }, 500);
        } else if (searchQuery === '') {
            setIsSearching(false);
            setSearchResults([]);
        }
    }, [searchQuery]);

    const loadFriends = async () => {
        console.log('Loading friends...');
        setLoading(prev => ({ ...prev, friends: true }));
        try {
            const response = await api.get('/friends');
            console.log('Friends API response:', response.data);
            if (response.data.success) {
                setFriends(response.data.friends);
            } else {
                console.error('Friends API returned success: false');
            }
        } catch (error) {
            console.error('Error loading friends:', error);
            console.error('Error response:', error.response);
            console.error('Error status:', error.response?.status);
            console.error('Error data:', error.response?.data);
            
            setModal({
                show: true,
                type: 'error',
                title: 'Erreur',
                message: 'Impossible de charger la liste d\'amis.'
            });
        } finally {
            setLoading(prev => ({ ...prev, friends: false }));
        }
    };

    const loadSuggestions = async () => {
        console.log('Loading suggestions...');
        setLoading(prev => ({ ...prev, suggestions: true }));
        try {
            const response = await api.get('/friends/suggestions');
            console.log('Suggestions API response:', response.data);
            if (response.data.success) {
                setSuggestions(response.data.suggestions);
            }
        } catch (error) {
            console.error('Error loading suggestions:', error);
            console.error('Error response:', error.response);
            console.error('Error status:', error.response?.status);
            console.error('Error data:', error.response?.data);
            setModal({
                show: true,
                type: 'error',
                title: 'Erreur',
                message: 'Impossible de charger les suggestions d\'amis.'
            });
        } finally {
            setLoading(prev => ({ ...prev, suggestions: false }));
        }
    };

    const loadPendingRequests = async () => {
        console.log('Loading pending requests...');
        setLoading(prev => ({ ...prev, pending: true }));
        try {
            const response = await api.get('/friends/pending');
            console.log('Pending requests API response:', response.data);
            if (response.data.success) {
                setPendingRequests(response.data.pending_requests);
            }
        } catch (error) {
            console.error('Error loading pending requests:', error);
            console.error('Error response:', error.response);
            console.error('Error status:', error.response?.status);
            console.error('Error data:', error.response?.data);
            setModal({
                show: true,
                type: 'error',
                title: 'Erreur',
                message: 'Impossible de charger les demandes en attente.'
            });
        } finally {
            setLoading(prev => ({ ...prev, pending: false }));
        }
    };

    const handleSearch = async (query) => {
        console.log('Searching for:', query);
        setLoading(prev => ({ ...prev, search: true }));
        try {
            const response = await api.get(`/friends/search?query=${encodeURIComponent(query)}`);
            console.log('Search API response:', response.data);
            if (response.data.success) {
                setSearchResults(response.data.users);
            }
        } catch (error) {
            console.error('Error searching friends:', error);
            console.error('Error response:', error.response);
            console.error('Error status:', error.response?.status);
            console.error('Error data:', error.response?.data);
            setModal({
                show: true,
                type: 'error',
                title: 'Erreur',
                message: 'Impossible d\'effectuer la recherche.'
            });
        } finally {
            setLoading(prev => ({ ...prev, search: false }));
        }
    };

    const handleSendRequest = async (userId) => {
        try {
            const response = await api.post('/friends/request', { user_id: userId });
            if (response.data.success) {
                setModal({
                    show: true,
                    type: 'success',
                    title: 'Succès',
                    message: 'Demande d\'amitié envoyée avec succès.'
                });
                
                // Update search results
                if (isSearching) {
                    handleSearch(searchQuery);
                }
            }
        } catch (error) {
            console.error('Error sending friend request:', error);
            const message = error.response?.data?.message || 'Impossible d\'envoyer la demande d\'amitié.';
            setModal({
                show: true,
                type: 'error',
                title: 'Erreur',
                message: message
            });
        }
    };

    const handleAcceptRequest = async (userId) => {
        try {
            const response = await api.post('/friends/accept', { user_id: userId });
            if (response.data.success) {
                setModal({
                    show: true,
                    type: 'success',
                    title: 'Succès',
                    message: 'Demande d\'amitié acceptée.'
                });
                
                // Reload data
                loadFriends();
                loadPendingRequests();
                if (isSearching) {
                    handleSearch(searchQuery);
                }
            }
        } catch (error) {
            console.error('Error accepting friend request:', error);
            setModal({
                show: true,
                type: 'error',
                title: 'Erreur',
                message: 'Impossible d\'accepter la demande d\'amitié.'
            });
        }
    };

    const handleRemoveFriend = async (userId, userName) => {
        const shouldRemove = await confirm(
            `Êtes-vous sûr de vouloir supprimer ${userName} de vos amis ?`,
            'Confirmer la suppression'
        );
        
        if (shouldRemove) {
            try {
                const response = await api.post('/friends/remove', { user_id: userId });
                if (response.data.success) {
                    setModal({
                        show: true,
                        type: 'success',
                        title: 'Succès',
                        message: 'Ami supprimé avec succès.'
                    });
                    
                    // Update state
                    setFriends(friends.filter(friend => friend.id !== userId));
                    loadSuggestions();
                    if (isSearching) {
                        handleSearch(searchQuery);
                    }
                }
            } catch (error) {
                console.error('Error removing friend:', error);
                setModal({
                    show: true,
                    type: 'error',
                    title: 'Erreur',
                    message: 'Impossible de supprimer l\'ami.'
                });
            }
        }
    };

    const handleCancelRequest = async (userId) => {
        const shouldCancel = await confirm(
            'Êtes-vous sûr de vouloir annuler cette demande d\'amitié ?',
            'Confirmer l\'annulation'
        );
        
        if (shouldCancel) {
            try {
                const response = await api.post('/friends/remove', { user_id: userId });
                if (response.data.success) {
                    setModal({
                        show: true,
                        type: 'success',
                        title: 'Succès',
                        message: 'Demande d\'amitié annulée.'
                    });
                    
                    // Update state
                    if (isSearching) {
                        handleSearch(searchQuery);
                    }
                }
            } catch (error) {
                console.error('Error canceling friend request:', error);
                setModal({
                    show: true,
                    type: 'error',
                    title: 'Erreur',
                    message: 'Impossible d\'annuler la demande d\'amitié.'
                });
            }
        }
    };

    const getUserAvatar = (user) => {
        if (user?.image) {
            const imageUrl = getImageUrl(user.image);
            return (
                <img
                    src={imageUrl}
                    alt={`${user.prenom} ${user.nom}`}
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                        console.error('Image failed to load:', e.target.src);
                        e.target.style.display = 'none';
                    }}
                />
            );
        }
        return (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-white to-gray-400 flex items-center justify-center text-black text-sm font-bold">
                {user?.prenom?.[0]}{user?.nom?.[0]}
            </div>
        );
    };

    const renderUserCard = (user, type = 'friend') => {
        return (
            <div key={user.id} className="bg-[#141414] border border-[#262626] rounded-lg p-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                            {getUserAvatar(user)}
                        </div>
                        <div>
                            <h4 className="text-white font-medium">
                                {user.prenom} {user.nom}
                            </h4>
                            <p className="text-gray-400 text-sm">{user.email}</p>
                            {type === 'suggestion' && user.mutual_friends > 0 && (
                                <p className="text-gray-500 text-xs mt-1">
                                    {user.mutual_friends} ami{user.mutual_friends > 1 ? 's' : ''} mutuel{user.mutual_friends > 1 ? 's' : ''}
                                </p>
                            )}
                            {type === 'search' && user.mutual_friends > 0 && (
                                <p className="text-gray-500 text-xs mt-1">
                                    {user.mutual_friends} ami{user.mutual_friends > 1 ? 's' : ''} mutuel{user.mutual_friends > 1 ? 's' : ''}
                                </p>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                        {type === 'friend' && (
                            <>
                                <button
                                    className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-[#262626]"
                                    title="Envoyer un message"
                                >
                                    <MessageCircle size={18} />
                                </button>
                                <button
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-[#262626]"
                                    onClick={() => handleRemoveFriend(user.id, `${user.prenom} ${user.nom}`)}
                                    title="Supprimer l'ami"
                                >
                                    <UserX size={18} />
                                </button>
                            </>
                        )}
                        
                        {type === 'suggestion' && (
                            <button
                                className="px-3 py-1 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                                onClick={() => handleSendRequest(user.id)}
                            >
                                <UserPlus size={16} />
                                Ajouter
                            </button>
                        )}
                        
                        {type === 'pending' && (
                            <div className="flex gap-2">
                                <button
                                    className="p-2 text-gray-400 hover:text-green-500 transition-colors rounded-lg hover:bg-[#262626]"
                                    onClick={() => handleAcceptRequest(user.id)}
                                    title="Accepter"
                                >
                                    <Check size={18} />
                                </button>
                                <button
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-[#262626]"
                                    onClick={() => handleCancelRequest(user.id)}
                                    title="Refuser"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        )}
                        
                        {type === 'search' && (
                            <>
                                {user.is_friend ? (
                                    <div className="flex items-center gap-2 text-green-500 text-sm">
                                        <UserCheck size={16} />
                                        <span>Ami</span>
                                    </div>
                                ) : user.has_pending_request ? (
                                    <div className="flex items-center gap-2 text-yellow-500 text-sm">
                                        <Clock size={16} />
                                        <span>En attente</span>
                                    </div>
                                ) : (
                                    <button
                                        className="px-3 py-1 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                                        onClick={() => handleSendRequest(user.id)}
                                    >
                                        <UserPlus size={16} />
                                        Ajouter
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="section-content active">
            <div className="friends-container">
                {/* Header */}
                <div className="section-header">
                    <h2>Amis</h2>
                    <div className="flex items-center gap-2">
                        {!isSearching && (
                            <button
                                className="btn-primary flex items-center gap-2"
                                onClick={() => {
                                    if (onSearchFocus) onSearchFocus();
                                    // Focus on search input in parent
                                }}
                            >
                                <Search size={18} />
                                Rechercher des amis
                            </button>
                        )}
                    </div>
                </div>

                {/* Search Results */}
                {isSearching && (
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">
                                Résultats de recherche pour "{searchQuery}"
                            </h3>
                            <button
                                className="text-gray-400 hover:text-white transition-colors"
                                onClick={() => {
                                    setIsSearching(false);
                                    if (onSearchBlur) onSearchBlur();
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        {loading.search ? (
                            <div className="text-center py-8">
                                <div className="text-gray-400">Recherche en cours...</div>
                            </div>
                        ) : searchResults.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {searchResults.map(user => renderUserCard(user, 'search'))}
                            </div>
                        ) : (
                            <div className="text-center py-8 bg-[#141414] border border-[#262626] rounded-lg">
                                <div className="text-gray-400">Aucun utilisateur trouvé.</div>
                            </div>
                        )}
                    </div>
                )}

                {/* Main Content - Only show when not searching */}
                {!isSearching && (
                    <>
                        {/* Tabs */}
                        <div className="flex border-b border-[#262626] mb-6">
                            <button
                                className={`px-4 py-2 font-medium ${activeTab === 'friends' ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-white'}`}
                                onClick={() => setActiveTab('friends')}
                            >
                                Amis ({friends.length})
                            </button>
                            <button
                                className={`px-4 py-2 font-medium ${activeTab === 'suggestions' ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-white'}`}
                                onClick={() => setActiveTab('suggestions')}
                            >
                                Suggestions ({suggestions.length})
                            </button>
                            <button
                                className={`px-4 py-2 font-medium ${activeTab === 'pending' ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-white'}`}
                                onClick={() => setActiveTab('pending')}
                            >
                                Demandes ({pendingRequests.length})
                            </button>
                        </div>

                        {/* Friends Tab */}
                        {activeTab === 'friends' && (
                            <div>
                                {loading.friends ? (
                                    <div className="text-center py-8">
                                        <div className="text-gray-400">Chargement des amis...</div>
                                    </div>
                                ) : friends.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {friends.map(friend => renderUserCard(friend, 'friend'))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-[#141414] border border-[#262626] rounded-lg">
                                        <Users size={48} className="mx-auto text-gray-400 mb-4" />
                                        <h3 className="text-lg font-semibold text-white mb-2">Aucun ami pour le moment</h3>
                                        <p className="text-gray-400 mb-4">Ajoutez des amis pour voir leur activité ici.</p>
                                        <button
                                            className="btn-primary"
                                            onClick={() => setActiveTab('suggestions')}
                                        >
                                            Voir les suggestions
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Suggestions Tab */}
                        {activeTab === 'suggestions' && (
                            <div>
                                {loading.suggestions ? (
                                    <div className="text-center py-8">
                                        <div className="text-gray-400">Chargement des suggestions...</div>
                                    </div>
                                ) : suggestions.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {suggestions.map(suggestion => renderUserCard(suggestion, 'suggestion'))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-[#141414] border border-[#262626] rounded-lg">
                                        <UserCog size={48} className="mx-auto text-gray-400 mb-4" />
                                        <h3 className="text-lg font-semibold text-white mb-2">Aucune suggestion</h3>
                                        <p className="text-gray-400">Nous n'avons pas de suggestions d'amis pour le moment.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Pending Requests Tab */}
                        {activeTab === 'pending' && (
                            <div>
                                {loading.pending ? (
                                    <div className="text-center py-8">
                                        <div className="text-gray-400">Chargement des demandes...</div>
                                    </div>
                                ) : pendingRequests.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {pendingRequests.map(request => renderUserCard(request, 'pending'))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-[#141414] border border-[#262626] rounded-lg">
                                        <Clock size={48} className="mx-auto text-gray-400 mb-4" />
                                        <h3 className="text-lg font-semibold text-white mb-2">Aucune demande en attente</h3>
                                        <p className="text-gray-400">Vous n'avez pas de demandes d'amitié en attente.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
            <Modal modal={modal} setModal={setModal} />
        </div>
    );
};

export default Amitie;