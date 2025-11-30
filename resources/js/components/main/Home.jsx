// components/Home.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../Header';
import SideMenuNav from '../SideMenuNav';
import {
    Heart,
    Share,
    Camera,
    MessageCircle,
    Users,
    Bell,
    Settings,
    Image,
    Send,
    X
} from 'lucide-react';
import { api } from '../../utils/api';
import Modal, { useModal } from '../Modal';
import { getImageUrl } from '../../utils/imageUrls';

const Home = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { modal, setModal, confirm } = useModal();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('feed');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [posting, setPosting] = useState(false);
    const [newPostDescription, setNewPostDescription] = useState('');
    const [postImage, setPostImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Get user avatar component
    const getUserAvatar = (userData, size = 'w-10 h-10') => {
        if (userData?.image) {
            const imageUrl = getImageUrl(userData.image);
            return (
                <div className={`${size} rounded-full overflow-hidden`}>
                    <img
                        src={imageUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            console.error('Image failed to load:', e.target.src);
                            e.target.style.display = 'none';
                        }}
                    />
                </div>
            );
        }
        return (
            <div className={`${size} rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm`}>
                {userData?.prenom?.[0]}{userData?.nom?.[0]}
            </div>
        );
    };

    // Determine active section from URL
    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/friends')) setActiveSection('friends');
        else if (path.includes('/messages')) setActiveSection('messages');
        else if (path.includes('/notifications')) setActiveSection('notifications');
        else if (path.includes('/profile')) setActiveSection('profile');
        else if (path.includes('/dashboard')) setActiveSection('dashboard');
        else setActiveSection('feed');
    }, [location.pathname]);

    // Load posts from API
    const loadPosts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/posts/feed');
            if (response.data.success) {
                setPosts(response.data.posts);
            } else {
                setModal({
                    show: true,
                    type: 'error',
                    title: 'Erreur',
                    message: response.data.message || 'Impossible de charger les posts'
                });
            }
        } catch (error) {
            console.error('Error loading posts:', error);

            if (error.response?.status === 401) {
                logout();
                navigate('/login');
                return;
            }

            // More specific error message
            const errorMessage = error.response?.data?.message ||
                error.message ||
                'Impossible de charger les posts';

            setModal({
                show: true,
                type: 'error',
                title: 'Erreur',
                message: errorMessage
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeSection === 'feed') {
            loadPosts();
        }
    }, [activeSection]);

    // Handle post image selection
    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setModal({
                    show: true,
                    type: 'error',
                    title: 'Erreur',
                    message: 'Veuillez sélectionner une image valide'
                });
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setModal({
                    show: true,
                    type: 'error',
                    title: 'Erreur',
                    message: 'L\'image ne doit pas dépasser 5MB'
                });
                return;
            }
            setPostImage(file);
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    // Remove selected image
    const removeImage = () => {
        setPostImage(null);
        setImagePreview(null);
    };

    // Create new post with image
    const handleCreatePost = async () => {
        if (!newPostDescription.trim() && !postImage) {
            setModal({
                show: true,
                type: 'warning',
                title: 'Attention',
                message: 'Veuillez écrire quelque chose ou ajouter une image avant de poster'
            });
            return;
        }

        try {
            setPosting(true);

            const formData = new FormData();
            formData.append('description', newPostDescription);
            if (postImage) {
                formData.append('image', postImage);
            }

            const response = await api.post('/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                setNewPostDescription('');
                setPostImage(null);
                setImagePreview(null);

                // Add new post to the beginning of the list
                setPosts(prevPosts => [response.data.post, ...prevPosts]);
                setModal({
                    show: true,
                    type: 'success',
                    title: 'Succès',
                    message: 'Post publié avec succès!'
                });
            }
        } catch (error) {
            console.error('Error creating post:', error);

            if (error.response?.status === 401) {
                logout();
                navigate('/login');
                return;
            }

            setModal({
                show: true,
                type: 'error',
                title: 'Erreur',
                message: 'Impossible de publier le post'
            });
        } finally {
            setPosting(false);
        }
    };

    const renderFeedSection = () => (
        <div className="section-content active">
            {/* Add Post Section */}
            <div className="add-post-card">
                <div className="add-post-header">
                    {getUserAvatar(user)}
                    <div className="flex-1">
                        <textarea
                            value={newPostDescription}
                            onChange={(e) => setNewPostDescription(e.target.value)}
                            placeholder="Quoi de neuf ?"
                            className="w-full p-3 bg-[#262626] border border-[#262626] rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:border-gray-500"
                            rows="3"
                            disabled={posting}
                        />

                        {/* Image Preview */}
                        {imagePreview && (
                            <div className="relative mt-2">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full max-h-64 object-cover rounded-lg"
                                />
                                <button
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-70 transition-all"
                                >
                                    <X size={16} className="text-white" />
                                </button>
                            </div>
                        )}

                        <div className="flex justify-between items-center mt-2">
                            <div className="flex gap-2">
                                <label className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer">
                                    <Image size={20} />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                        className="hidden"
                                        disabled={posting}
                                    />
                                </label>
                                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                                    <Camera size={20} />
                                </button>
                            </div>
                            <button
                                onClick={handleCreatePost}
                                disabled={posting || (!newPostDescription.trim() && !postImage)}
                                className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {posting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                        Publication...
                                    </>
                                ) : (
                                    <>
                                        <Send size={16} />
                                        Publier
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Posts Feed */}
            <div className="posts-feed">
                {loading ? (
                    <div className="text-center py-8">
                        <div className="text-gray-400">Chargement des posts...</div>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="text-gray-400">Aucun post à afficher. Commencez à suivre des amis ou créez votre premier post!</div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {posts.map((post) => (
                            <div key={post.id} className="post-card">
                                <div className="post-header">
                                    <div className="post-user-info">
                                        {getUserAvatar(post.user)}
                                        <div className="post-user-details">
                                            <div className="post-user-name">
                                                {post.user.prenom} {post.user.nom}
                                            </div>
                                            <div className="post-date">
                                                {new Date(post.date).toLocaleDateString('fr-FR', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="post-content">
                                    <p>{post.description}</p>
                                </div>

                                {post.image && (
                                    <img
                                        src={getImageUrl(post.image)}
                                        alt="Post"
                                        className="post-image"
                                    />
                                )}

                                <div className="post-actions">
                                    <button className="post-action-btn">
                                        <Heart size={18} />
                                        <span>{post.likes_count}</span>
                                    </button>
                                    <button className="post-action-btn">
                                        <MessageCircle size={18} />
                                        <span>{post.comments_count}</span>
                                    </button>
                                    <button className="post-action-btn">
                                        <Share size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    // Update Profile Section to show user image
    const renderProfileSection = () => (
        <div className="section-content">
            <div className="profile-container">
                <div className="profile-header-card">
                    <div className="profile-banner"></div>
                    <div className="profile-info">
                        <div className="profile-avatar-wrapper">
                            <div className="profile-avatar">
                                {user?.image ? (
                                    <img
                                        src={getImageUrl(user.image)}
                                        alt="Profile"
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <span>{user.prenom?.[0]}{user.nom?.[0]}</span>
                                )}
                            </div>
                            <button className="edit-avatar-btn">
                                <Camera size={16} />
                            </button>
                        </div>
                        <div className="profile-details">
                            <h1 className="profile-name">
                                {user.prenom} {user.nom}
                            </h1>
                            <p className="profile-email">{user.email}</p>
                            <div className="profile-role-badge">
                                <span>★</span>
                                <span>
                                    {user.role === 'admin' ? 'Administrateur' :
                                        user.role === 'mod' ? 'Modérateur' : 'Utilisateur'}
                                </span>
                            </div>
                        </div>
                        <button className="btn-secondary">Modifier le profil</button>
                    </div>
                </div>

                {/* User Stats */}
                <div className="user-stats-card">
                    <h3>Mes statistiques</h3>
                    <div className="stats-grid">
                        <div className="stat-item">
                            <div className="stat-label">Mes posts</div>
                            <div className="stat-value">23</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-label">Mes amis</div>
                            <div className="stat-value">45</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-label">Likes reçus</div>
                            <div className="stat-value">328</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-label">Commentaires</div>
                            <div className="stat-value">156</div>
                        </div>
                    </div>
                </div>

                {/* My Posts */}
                <div className="profile-posts-section">
                    <h3>Mes publications</h3>
                    <div className="posts-feed">
                        {posts.filter(post => post.user && post.user.nom === user.nom && post.user.prenom === user.prenom).length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                Aucune publication pour le moment
                            </div>
                        ) : (
                            posts.filter(post => post.user && post.user.nom === user.nom && post.user.prenom === user.prenom).map(post => (
                                <div key={post.id} className="post-card">
                                    <div className="post-header">
                                        <div className="post-user-info">
                                            {getUserAvatar(post.user)}
                                            <div className="post-user-details">
                                                <div className="post-user-name">
                                                    {post.user.prenom} {post.user.nom}
                                                </div>
                                                <div className="post-date">
                                                    {new Date(post.date).toLocaleDateString('fr-FR')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="post-content">
                                        <p>{post.description}</p>
                                    </div>

                                    {post.image && (
                                        <img
                                            src={getImageUrl(post.image)}
                                            alt="Post"
                                            className="post-image"
                                        />
                                    )}

                                    <div className="post-actions">
                                        <button className="post-action-btn">
                                            <Heart size={18} />
                                            <span>{post.likes_count || 0}</span>
                                        </button>
                                        <button className="post-action-btn">
                                            <MessageCircle size={18} />
                                            <span>{post.comments_count || 0}</span>
                                        </button>
                                        <button className="post-action-btn">
                                            <Share size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderFriendsSection = () => (
        <div className="section-content">
            <div className="friends-container">
                <div className="section-header">
                    <h2>Amis</h2>
                    <button className="btn-primary">Trouver des amis</button>
                </div>

                {/* Friend Requests */}
                <div className="friends-card">
                    <h3>Demandes d'amitié</h3>
                    <div className="friend-requests-list">
                        <div className="text-center py-8 text-gray-400">
                            Aucune demande d'amitié pour le moment
                        </div>
                    </div>
                </div>

                {/* Friends List */}
                <div className="friends-card">
                    <h3>Mes amis</h3>
                    <div className="friends-list">
                        <div className="text-center py-8 text-gray-400">
                            Aucun ami pour le moment
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderMessagesSection = () => (
        <div className="section-content">
            <div className="messages-container">
                <div className="messages-sidebar">
                    <div className="messages-header">
                        <h3>Messages</h3>
                    </div>
                    <div className="conversations-list">
                        <div className="text-center py-8 text-gray-400">
                            Aucune conversation
                        </div>
                    </div>
                </div>
                <div className="messages-main">
                    <div className="messages-placeholder">
                        <MessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
                        <p>Sélectionnez une conversation pour commencer</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderNotificationsSection = () => (
        <div className="section-content">
            <div className="notifications-container">
                <div className="section-header">
                    <h2>Notifications</h2>
                    <button className="btn-text">Tout marquer comme lu</button>
                </div>
                <div className="notifications-list">
                    <div className="text-center py-8 text-gray-400">
                        Aucune notification
                    </div>
                </div>
            </div>
        </div>
    );

    const renderDashboardSection = () => (
        <div className="section-content">
            <div className="dashboard-container">
                <div className="section-header">
                    <h2>Tableau de bord</h2>
                    <select className="dashboard-select">
                        <option value="7">7 derniers jours</option>
                        <option value="30" selected>30 derniers jours</option>
                        <option value="90">90 derniers jours</option>
                    </select>
                </div>

                <div className="text-center py-8">
                    <Settings size={48} className="mx-auto text-gray-400 mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Tableau de bord</h2>
                    <p className="text-gray-400">
                        Tableau de bord réservé aux {user.role === 'admin' ? 'administrateurs' : 'modérateurs'}
                    </p>
                </div>
            </div>
        </div>
    );

    const renderSection = () => {
        switch (activeSection) {
            case 'feed':
                return renderFeedSection();
            case 'profile':
                return renderProfileSection();
            case 'friends':
                return renderFriendsSection();
            case 'messages':
                return renderMessagesSection();
            case 'notifications':
                return renderNotificationsSection();
            case 'dashboard':
                return renderDashboardSection();
            default:
                return renderFeedSection();
        }
    };

    return (
        <div className="home-page">
            <SideMenuNav
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="home-main">
                <Header
                    sidebarOpen={sidebarOpen}
                    onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
                    activeSection={activeSection}
                />

                <main className="home-main-content">
                    {renderSection()}
                </main>
            </div>

            <Modal modal={modal} setModal={setModal} />
        </div>
    );
};

export default Home;