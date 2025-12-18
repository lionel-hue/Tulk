// components/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    Search,
    Bell,
    User,
    LogOut,
    Menu,
    MessageCircle,
    Users,
    LayoutDashboard,
    Settings,
    X
} from 'lucide-react';
import Modal, { useModal } from './Modal';
import { getImageUrl } from '../utils/imageUrls';

const Header = ({ 
    sidebarOpen, 
    onSidebarToggle, 
    activeSection = "feed",
    searchQuery,
    onSearchChange 
}) => {
    const { user, logout } = useAuth();
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || '');
    const navigate = useNavigate();
    const location = useLocation();
    const profileDropdownRef = useRef(null);
    const searchInputRef = useRef(null);

    const { modal, setModal, confirm } = useModal();

    // Sync local search query with parent
    useEffect(() => {
        setLocalSearchQuery(searchQuery || '');
    }, [searchQuery]);

    // Get the user's profile image URL or fallback to initials
    const getUserAvatar = () => {
        if (user?.image) {
            const imageUrl = getImageUrl(user.image);
            return (
                <img
                    src={imageUrl}
                    alt="Profile"
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
        const value = e.target.value;
        setLocalSearchQuery(value);
        if (onSearchChange) {
            onSearchChange(value);
        }
    };

    const handleSearchFocus = () => {
        if (activeSection === 'friends' && onSearchChange) {
            // Notify parent about search focus for friends section
            onSearchChange(localSearchQuery);
        }
    };

    const handleSearchBlur = () => {
        // If search is empty, clear it
        if (localSearchQuery.trim() === '') {
            setLocalSearchQuery('');
            if (onSearchChange) {
                onSearchChange('');
            }
        }
    };

    const clearSearch = () => {
        setLocalSearchQuery('');
        if (onSearchChange) {
            onSearchChange('');
        }
        // Focus the search input after clearing
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
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
        // Clear search when navigating to a different section
        if (section !== activeSection) {
            setLocalSearchQuery('');
            if (onSearchChange) {
                onSearchChange('');
            }
        }
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
            } else if (event.key === 'Escape' && localSearchQuery) {
                clearSearch();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isProfileDropdownOpen, localSearchQuery]);

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
                    {/* Side Menu Toggle */}
                    <button className="menu-toggle" onClick={onSidebarToggle}>
                        <Menu size={24} />
                    </button>

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
                            ref={searchInputRef}
                            type="text"
                            placeholder={getSearchPlaceholder()}
                            value={localSearchQuery}
                            onChange={handleSearchChange}
                            onFocus={handleSearchFocus}
                            onBlur={handleSearchBlur}
                        />
                        {localSearchQuery ? (
                            <button 
                                onClick={clearSearch}
                                className="absolute right-8 text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        ) : (
                            <Search size={18} className="absolute right-3" />
                        )}
                    </div>

                    {/* User Profile */}
                    <div className="header-profile" ref={profileDropdownRef}>
                        <div
                            className="profile-pic cursor-pointer"
                            onClick={toggleProfileDropdown}
                        >
                            <div className="w-8 h-8 rounded-full overflow-hidden">
                                {getUserAvatar()}
                            </div>
                        </div>

                        {/* Profile Dropdown Menu */}
                        {isProfileDropdownOpen && (
                            <div className="profile-dropdown-menu">
                                <div className="profile-dropdown-header">
                                    <div className="user-avatar">
                                        <div className="w-12 h-12 rounded-full overflow-hidden">
                                            {getUserAvatar()}
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