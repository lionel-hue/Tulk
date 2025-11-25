import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    MessageCircle, 
    Users, 
    Bell, 
    User, 
    LayoutDashboard,
    Search,
    Menu,
    X,
    Heart,
    Share,
    Image,
    Send,
    LogOut,
    Settings,
    Camera
} from 'lucide-react';

const Home = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('feed');
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
    const [posts, setPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

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

    const handleLogout = async () => {
        try {
            await axios.post('/api/logout', {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            logout();
            navigate('/login');
        }
    };

    const renderHeader = () => (
        <header className="bg-[#141414] border-b border-[#262626] p-4 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center gap-4">
                {/* Mobile Menu Toggle */}
                <button 
                    className="lg:hidden p-2"
                    onClick={() => setIsSideMenuOpen(true)}
                >
                    <Menu size={24} />
                </button>

                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-gray-400 flex items-center justify-center text-black font-bold">
                        T
                    </div>
                    <h1 className="text-xl font-bold text-white hidden sm:block">Tulk</h1>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex gap-1">
                    {[
                        { id: 'feed', icon: LayoutDashboard, label: 'Fil', badge: null },
                        { id: 'friends', icon: Users, label: 'Amis', badge: null },
                        { id: 'messages', icon: MessageCircle, label: 'Messages', badge: 0 },
                        { id: 'notifications', icon: Bell, label: 'Notifications', badge: 3 },
                        { id: 'profile', icon: User, label: 'Profil', badge: null },
                        ...(user?.role === 'admin' || user?.role === 'mod' ? 
                            [{ id: 'dashboard', icon: Settings, label: 'Tableau de bord', badge: null }] : [])
                    ].map((item) => (
                        <button
                            key={item.id}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                                activeSection === item.id 
                                    ? 'bg-white text-black' 
                                    : 'text-gray-400 hover:text-white hover:bg-[#262626]'
                            }`}
                            onClick={() => setActiveSection(item.id)}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                            {item.badge !== null && (
                                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-6 text-center">
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Rechercher des posts..."
                        className="w-full pl-10 pr-4 py-2 bg-[#262626] border border-[#262626] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gray-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-4">
                    <span className="text-gray-300 hidden sm:block">
                        Bonjour, {user.prenom} {user.nom}
                    </span>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <LogOut size={18} />
                        <span className="hidden sm:block">Déconnexion</span>
                    </button>
                </div>
            </div>
        </header>
    );

    const renderSideMenu = () => (
        <div className={`fixed inset-0 z-50 lg:hidden ${
            isSideMenuOpen ? 'block' : 'hidden'
        }`}>
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={() => setIsSideMenuOpen(false)}
            />
            
            {/* Side Menu */}
            <div className="absolute left-0 top-0 w-80 h-full bg-[#141414] border-r border-[#262626] transform transition-transform">
                <div className="p-4 border-b border-[#262626] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-gray-400 flex items-center justify-center text-black font-bold">
                            T
                        </div>
                        <h2 className="text-xl font-bold text-white">Tulk</h2>
                    </div>
                    <button 
                        onClick={() => setIsSideMenuOpen(false)}
                        className="p-2 text-gray-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    {[
                        { id: 'feed', icon: LayoutDashboard, label: 'Fil', badge: null },
                        { id: 'friends', icon: Users, label: 'Amis', badge: null },
                        { id: 'messages', icon: MessageCircle, label: 'Messages', badge: 0 },
                        { id: 'notifications', icon: Bell, label: 'Notifications', badge: 3 },
                        { id: 'profile', icon: User, label: 'Profil', badge: null },
                        ...(user?.role === 'admin' || user?.role === 'mod' ? 
                            [{ id: 'dashboard', icon: Settings, label: 'Tableau de bord', badge: null }] : [])
                    ].map((item) => (
                        <button
                            key={item.id}
                            className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all ${
                                activeSection === item.id 
                                    ? 'bg-white text-black' 
                                    : 'text-gray-400 hover:text-white hover:bg-[#262626]'
                            }`}
                            onClick={() => {
                                setActiveSection(item.id);
                                setIsSideMenuOpen(false);
                            }}
                        >
                            <item.icon size={20} />
                            <span className="flex-1 text-left">{item.label}</span>
                            {item.badge !== null && (
                                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-6 text-center">
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );

    const renderFeedSection = () => (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Add Post Card */}
            <div className="bg-[#141414] border border-[#262626] rounded-lg p-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white to-gray-400 flex items-center justify-center text-black font-bold">
                        {user.prenom?.[0]}{user.nom?.[0]}
                    </div>
                    <button className="flex-1 text-left p-3 bg-[#262626] border border-[#262626] rounded-lg text-gray-400 hover:border-gray-500 transition-colors">
                        Quoi de neuf ?
                    </button>
                </div>
            </div>

            {/* Posts Feed */}
            {loading ? (
                <div className="text-center py-8">
                    <div className="text-gray-400">Chargement des posts...</div>
                </div>
            ) : (
                <div className="space-y-4">
                    {posts.map((post) => (
                        <div key={post.id} className="bg-[#141414] border border-[#262626] rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                                    {post.user.prenom?.[0]}{post.user.nom?.[0]}
                                </div>
                                <div>
                                    <div className="font-semibold text-white">
                                        {post.user.prenom} {post.user.nom}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        {new Date(post.date).toLocaleDateString('fr-FR')}
                                    </div>
                                </div>
                            </div>
                            
                            <p className="text-white mb-3">{post.description}</p>
                            
                            {post.image && (
                                <img 
                                    src={post.image} 
                                    alt="Post" 
                                    className="w-full rounded-lg mb-3"
                                />
                            )}
                            
                            <div className="flex gap-4 pt-3 border-t border-[#262626]">
                                <button className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors">
                                    <Heart size={18} />
                                    <span>{post.likes}</span>
                                </button>
                                <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors">
                                    <MessageCircle size={18} />
                                    <span>{post.comments}</span>
                                </button>
                                <button className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors">
                                    <Share size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const renderProfileSection = () => (
        <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <div className="bg-[#141414] border border-[#262626] rounded-lg overflow-hidden mb-6">
                <div className="h-32 bg-gradient-to-r from-purple-500 to-blue-500"></div>
                <div className="px-6 pb-6">
                    <div className="flex flex-col items-center -mt-16">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-white to-gray-400 flex items-center justify-center text-black text-2xl font-bold border-4 border-[#141414]">
                                {user.prenom?.[0]}{user.nom?.[0]}
                            </div>
                            <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full border-2 border-[#141414] flex items-center justify-center">
                                <Camera size={16} className="text-black" />
                            </button>
                        </div>
                        <div className="text-center mt-4">
                            <h1 className="text-2xl font-bold text-white">
                                {user.prenom} {user.nom}
                            </h1>
                            <p className="text-gray-400 mt-1">{user.email}</p>
                            <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500 rounded-full text-white text-sm mt-2">
                                <span>★</span>
                                <span>
                                    {user.role === 'admin' ? 'Administrateur' : 
                                     user.role === 'mod' ? 'Modérateur' : 'Utilisateur'}
                                </span>
                            </div>
                        </div>
                        <button className="mt-4 px-6 py-2 border border-[#262626] rounded-lg text-white hover:bg-[#262626] transition-colors">
                            Modifier le profil
                        </button>
                    </div>
                </div>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-[#141414] border border-[#262626] rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-white">23</div>
                    <div className="text-gray-400 text-sm">Posts</div>
                </div>
                <div className="bg-[#141414] border border-[#262626] rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-white">45</div>
                    <div className="text-gray-400 text-sm">Amis</div>
                </div>
                <div className="bg-[#141414] border border-[#262626] rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-white">328</div>
                    <div className="text-gray-400 text-sm">Likes</div>
                </div>
                <div className="bg-[#141414] border border-[#262626] rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-white">156</div>
                    <div className="text-gray-400 text-sm">Commentaires</div>
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
                return (
                    <div className="max-w-4xl mx-auto text-center py-8">
                        <Users size={48} className="mx-auto text-gray-400 mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">Amis</h2>
                        <p className="text-gray-400">Section amis en cours de développement</p>
                    </div>
                );
            case 'messages':
                return (
                    <div className="max-w-4xl mx-auto text-center py-8">
                        <MessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">Messages</h2>
                        <p className="text-gray-400">Section messages en cours de développement</p>
                    </div>
                );
            case 'notifications':
                return (
                    <div className="max-w-4xl mx-auto text-center py-8">
                        <Bell size={48} className="mx-auto text-gray-400 mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">Notifications</h2>
                        <p className="text-gray-400">Section notifications en cours de développement</p>
                    </div>
                );
            case 'dashboard':
                return (
                    <div className="max-w-4xl mx-auto text-center py-8">
                        <Settings size={48} className="mx-auto text-gray-400 mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">Tableau de bord</h2>
                        <p className="text-gray-400">Tableau de bord réservé aux {user.role === 'admin' ? 'administrateurs' : 'modérateurs'}</p>
                    </div>
                );
            default:
                return renderFeedSection();
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {renderHeader()}
            {renderSideMenu()}
            
            <main className="py-6 px-4">
                {renderSection()}
            </main>
        </div>
    );
};

export default Home;