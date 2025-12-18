// components/SideMenuNav.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    LayoutDashboard,
    Users,
    MessageCircle,
    Bell,
    User,
    Settings,
    X,
    LogOut
} from 'lucide-react';
import { getImageUrl } from '../utils/imageUrls';

const SideMenuNav = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const sidebarRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    const handleNavigation = (section) => {
        navigate(`/${section}`);
        onClose();
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { id: 'feed', icon: LayoutDashboard, label: 'Fil d\'actualité', badge: null },
        { id: 'friends', icon: Users, label: 'Amis', badge: null },
        { id: 'messages', icon: MessageCircle, label: 'Messages', badge: 0 },
        { id: 'notifications', icon: Bell, label: 'Notifications', badge: 3 },
        { id: 'profile', icon: User, label: 'Profil', badge: null },
        ...(user?.role === 'admin' || user?.role === 'mod' ? 
            [{ id: 'dashboard', icon: Settings, label: 'Tableau de bord', badge: null }] : [])
    ];

    return (
        <>
            {/* Overlay */}
            <div className={`side-menu-overlay ${isOpen ? 'active' : ''}`} onClick={onClose} />

            {/* Side Menu - NOW COVERS ENTIRE VIEWPORT FROM TOP */}
            <div 
                ref={sidebarRef} 
                className={`side-menu ${isOpen ? 'active' : ''}`}
                style={{ top: 0, height: '100%' }}
            >
                {/* Side Menu Header with Logo */}
                <div className="side-menu-header">
                    <div className="flex items-center gap-3">
                        {/* Logo in Side Menu */}
                        <div className="logo-circle">T</div>
                        <div>
                            <h2 className="text-white font-bold text-lg">Tulk</h2>
                            <p className="text-gray-400 text-xs">Connectez-vous avec le monde</p>
                        </div>
                    </div>
                    <button className="close-menu" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                {/* User Info Section */}
                <div className="px-4 py-3 border-b border-[#262626]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                            {user?.image ? (
                                <img 
                                    src={getImageUrl(user.image)}
                                    alt="Profile" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        console.error('Image failed to load in side menu:', e.target.src);
                                        e.target.style.display = 'none';
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-white to-gray-400 flex items-center justify-center text-black font-bold text-sm">
                                    {user?.prenom?.[0]}{user?.nom?.[0]}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-medium text-sm truncate">
                                {user?.prenom} {user?.nom}
                            </p>
                            <p className="text-gray-400 text-xs truncate">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                </div>

                <nav className="mobile-nav">
                    {/* Navigation Items */}
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            className={`nav-btn ${location.pathname.includes(item.id) ? 'active' : ''}`}
                            onClick={() => handleNavigation(item.id)}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                            {item.badge !== null && item.badge > 0 && (
                                <span className="notification-badge">{item.badge}</span>
                            )}
                        </button>
                    ))}
                    
                    {/* Logout button */}
                    <button className="nav-btn logout-btn" onClick={handleLogout}>
                        <LogOut size={20} />
                        <span>Déconnexion</span>
                    </button>
                </nav>
            </div>
        </>
    );
};

export default SideMenuNav;