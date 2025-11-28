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
    Send
} from 'lucide-react';

const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('feed');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

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

    // Sample data - replace with API calls
    useEffect(() => {
        // Simulate loading posts
        setTimeout(() => {
            setPosts([
                {
                    id: 1,
                    user: {
                        nom: "Martin",
                        prenom: "Sophie",
                        image: "/woman-user.png",
                    },
                    description: "Belle journée pour coder ! 🚀",
                    image: null,
                    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
                    likes: 42,
                    comments: 8,
                },
                {
                    id: 2,
                    user: {
                        nom: "Bernard",
                        prenom: "Luc",
                        image: "/man-user.png",
                    },
                    description: "Nouveau projet en cours ! 💻",
                    image: null,
                    date: new Date(Date.now() - 5 * 60 * 60 * 1000),
                    likes: 28,
                    comments: 5,
                },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const renderFeedSection = () => (
        <div className="section-content active">
            {/* Add Post Section */}
            <div className="add-post-card">
                <div className="add-post-header">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-gray-400 flex items-center justify-center text-black font-bold text-sm">
                        {user.prenom?.[0]}{user.nom?.[0]}
                    </div>
                    <button className="add-post-trigger">Quoi de neuf ?</button>
                </div>
            </div>

            {/* Posts Feed */}
            <div className="posts-feed">
                {loading ? (
                    <div className="text-center py-8">
                        <div className="text-gray-400">Chargement des posts...</div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {posts.map((post) => (
                            <div key={post.id} className="post-card">
                                <div className="post-header">
                                    <div className="post-user-info">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                            {post.user.prenom?.[0]}{post.user.nom?.[0]}
                                        </div>
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
                                        src={post.image} 
                                        alt="Post" 
                                        className="post-image"
                                    />
                                )}
                                
                                <div className="post-actions">
                                    <button className="post-action-btn">
                                        <Heart size={18} />
                                        <span>{post.likes}</span>
                                    </button>
                                    <button className="post-action-btn">
                                        <MessageCircle size={18} />
                                        <span>{post.comments}</span>
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

    const renderProfileSection = () => (
        <div className="section-content">
            <div className="profile-container">
                <div className="profile-header-card">
                    <div className="profile-banner"></div>
                    <div className="profile-info">
                        <div className="profile-avatar-wrapper">
                            <div className="profile-avatar">
                                {user.prenom?.[0]}{user.nom?.[0]}
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
                        {posts.filter(post => post.user.nom === user.nom && post.user.prenom === user.prenom).length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                Aucune publication pour le moment
                            </div>
                        ) : (
                            posts.filter(post => post.user.nom === user.nom && post.user.prenom === user.prenom).map(post => (
                                <div key={post.id} className="post-card">
                                    <div className="post-header">
                                        <div className="post-user-info">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                                {post.user.prenom?.[0]}{post.user.nom?.[0]}
                                            </div>
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
                                    
                                    <div className="post-actions">
                                        <button className="post-action-btn">
                                            <Heart size={18} />
                                            <span>{post.likes}</span>
                                        </button>
                                        <button className="post-action-btn">
                                            <MessageCircle size={18} />
                                            <span>{post.comments}</span>
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
        </div>
    );
};

export default Home;