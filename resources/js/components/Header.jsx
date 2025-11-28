// components/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
    Search, 
    Bell, 
    User, 
    LogOut,
    Menu, // Added Menu icon for sidebar toggle
    MessageCircle,
    Users,
    LayoutDashboard,
    Settings
} from 'lucide-react';
import Modal, { useModal } from './Modal';

const Header = ({ sidebarOpen, onSidebarToggle, activeSection = "feed" }) => {
    const { user, logout } = useAuth();
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const profileDropdownRef = useRef(null);
    
    const { modal, setModal, confirm } = useModal();

    const getSearchPlaceholder = () => {
        if (activeSection === 'messages') {
            return "Rechercher des messages...";
        } else if (activeSection === 'friends') {
            return "Rechercher des amis...";
        } else {
            return "Rechercher des posts...";
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const toggleProfileDropdown = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };

    const handleProfileAction = async (action) => {
        setIsProfileDropdownOpen(false);
        
        switch (action) {
            case 'profile':
                navigate('/profile');
                break;
            case 'settings':
                navigate('/settings');
                break;
            case 'logout':
                const shouldLogout = await confirm('Êtes-vous sûr de vouloir vous déconnecter?', 'Confirmer la déconnexion');
                if (shouldLogout) {
                    await logout();
                    navigate('/login');
                }
                break;
            default:
                break;
        }
    };

    const handleNavigation = (section) => {
        navigate(`/${section}`);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isProfileDropdownOpen && profileDropdownRef.current && 
                !profileDropdownRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isProfileDropdownOpen]);

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape' && isProfileDropdownOpen) {
                setIsProfileDropdownOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isProfileDropdownOpen]);

    const navItems = [
        { id: 'feed', icon: LayoutDashboard, label: 'Fil', badge: null },
        { id: 'friends', icon: Users, label: 'Amis', badge: null },
        { id: 'messages', icon: MessageCircle, label: 'Messages', badge: 0 },
        { id: 'notifications', icon: Bell, label: 'Notifications', badge: 3 },
        { id: 'profile', icon: User, label: 'Profil', badge: null },
        ...(user?.role === 'admin' || user?.role === 'mod' ? 
            [{ id: 'dashboard', icon: Settings, label: 'Tableau de bord', badge: null }] : [])
    ];

    return (
        <>
            <header className="home-header">
                <div className="header-content">
                    {/* Side Menu Toggle - ALWAYS VISIBLE NOW */}
                    <button className="menu-toggle" onClick={onSidebarToggle}>
                        <Menu size={24} />
                    </button>

                    {/* REMOVED LOGO FROM HEADER */}

                    {/* Desktop Navigation */}
                    <nav className="desktop-nav hidden lg:flex">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                className={`nav-btn ${activeSection === item.id ? 'active' : ''}`}
                                onClick={() => handleNavigation(item.id)}
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                                {item.badge !== null && item.badge > 0 && (
                                    <span className="notification-badge">{item.badge}</span>
                                )}
                            </button>
                        ))}
                    </nav>

                    {/* Search Bar */}
                    <div className="header-search">
                        <input 
                            type="text" 
                            placeholder={getSearchPlaceholder()}
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <Search size={18} />
                    </div>

                    {/* User Profile */}
                    <div className="header-profile" ref={profileDropdownRef}>
                        <div 
                            className="profile-pic cursor-pointer"
                            onClick={toggleProfileDropdown}
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white to-gray-400 flex items-center justify-center text-black text-sm font-bold">
                                {user?.prenom?.[0]}{user?.nom?.[0]}
                            </div>
                        </div>
                        
                        {/* Profile Dropdown Menu */}
                        {isProfileDropdownOpen && (
                            <div className="profile-dropdown-menu">
                                <div className="profile-dropdown-header">
                                    <div className="user-avatar">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white to-gray-400 flex items-center justify-center text-black font-bold">
                                            {user?.prenom?.[0]}{user?.nom?.[0]}
                                        </div>
                                    </div>
                                    <div className="user-info">
                                        <div className="user-name">{user?.prenom} {user?.nom}</div>
                                        <div className="user-role">
                                            {user?.role === 'admin' ? 'Administrateur' : 
                                             user?.role === 'mod' ? 'Modérateur' : 'Utilisateur'}
                                        </div>
                                    </div>
                                </div>
                                <div className="profile-dropdown-divider"></div>
                                <button 
                                    className="profile-dropdown-item"
                                    onClick={() => handleProfileAction('profile')}
                                >
                                    <User size={18} />
                                    <span>Mon Profil</span>
                                </button>
                                <button 
                                    className="profile-dropdown-item"
                                    onClick={() => handleProfileAction('settings')}
                                >
                                    <Settings size={18} />
                                    <span>Paramètres</span>
                                </button>
                                <button 
                                    className="profile-dropdown-item logout-item"
                                    onClick={() => handleProfileAction('logout')}
                                >
                                    <LogOut size={18} />
                                    <span>Déconnexion</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <Modal modal={modal} setModal={setModal} />
        </>
    );
};

export default Header;