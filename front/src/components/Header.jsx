import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
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
} from 'lucide-react'
import Modal, { useModal } from './Modal'
import Avatar from './common/Avatar'
import { useNotificationCounts } from '../hooks/useNotificationCounts'

const Header = ({
  sidebarOpen,
  onSidebarToggle,
  activeSection = 'feed',
  searchQuery,
  onSearchChange
}) => {
  const { user, logout } = useAuth()
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || '')
  const navigate = useNavigate()
  const location = useLocation()
  const profileDropdownRef = useRef(null)
  const searchInputRef = useRef(null)
  const { modal, setModal, confirm } = useModal()
  const { messages, notifications, friends, home } = useNotificationCounts()

  // Sync local search query with parent
  useEffect(() => {
    setLocalSearchQuery(searchQuery || '')
  }, [searchQuery])

  const handleSearchChange = e => {
    const value = e.target.value
    setLocalSearchQuery(value)
    if (onSearchChange) {
      onSearchChange(value)
    }
  }

  const handleSearchBlur = () => {
    if (localSearchQuery.trim() === '') {
      setLocalSearchQuery('')
      if (onSearchChange) {
        onSearchChange('')
      }
    }
  }

  const clearSearch = () => {
    setLocalSearchQuery('')
    if (onSearchChange) {
      onSearchChange('')
    }
    
    // If on search page, go back to previous section (home by default)
    if (location.pathname === '/search') {
      // If we have history, go back, otherwise go to home
      if (window.history.length > 2) {
        navigate(-1)
      } else {
        navigate('/home')
      }
    } else if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  // Handle search form submission - navigate to search results page
  const handleSearchSubmit = e => {
    e.preventDefault()
    if (localSearchQuery.trim().length >= 2) {
      navigate(`/search?q=${encodeURIComponent(localSearchQuery)}`)
    }
  }

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen)
  }

  const handleProfileAction = async action => {
    setIsProfileDropdownOpen(false)
    switch (action) {
      case 'profile':
        navigate('/profile')
        break
      case 'settings':
        navigate('/settings')
        break
      case 'logout':
        const shouldLogout = await confirm(
          'Êtes-vous sûr de vouloir vous déconnecter?',
          'Confirmer la déconnexion'
        )
        if (shouldLogout) {
          await logout()
          navigate('/login')
        }
        break
      default:
        break
    }
  }

  const handleNavigation = section => {
    if (section !== activeSection) {
      setLocalSearchQuery('')
      if (onSearchChange) {
        onSearchChange('')
      }
    }
    navigate(section === 'feed' ? '/home' : `/${section}`)
  }

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        isProfileDropdownOpen &&
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isProfileDropdownOpen])

  useEffect(() => {
    const handleEscape = event => {
      if (event.key === 'Escape' && isProfileDropdownOpen) {
        setIsProfileDropdownOpen(false)
      } else if (event.key === 'Escape' && localSearchQuery) {
        clearSearch()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isProfileDropdownOpen, localSearchQuery])

  const navItems = [
    { id: 'feed', icon: LayoutDashboard, label: 'Fil', badge: home },
    { id: 'friends', icon: Users, label: 'Amis', badge: friends },
    { id: 'messages', icon: MessageCircle, label: 'Messages', badge: messages },
    { id: 'notifications', icon: Bell, label: 'Notifications', badge: notifications },
    { id: 'profile', icon: User, label: 'Profil', badge: null },
    ...(user?.role === 'admin' || user?.role === 'mod'
      ? [
          {
            id: 'dashboard',
            icon: Settings,
            label: 'Tableau de bord',
            badge: null
          }
        ]
      : [])
  ]

  return (
    <>
      <header className='home-header'>
        <div className='header-content'>
          {/* Side Menu Toggle */}
          <button className='menu-toggle' onClick={onSidebarToggle}>
            <Menu size={24} />
          </button>

          {/* Desktop Navigation */}
          <nav className='desktop-nav hidden lg:flex'>
            {navItems.map(item => (
              <button
                key={item.id}
                className={`nav-btn ${
                  activeSection === item.id ? 'active' : ''
                }`}
                onClick={() => handleNavigation(item.id)}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
                {item.badge !== null && item.badge > 0 && (
                  <span className='notification-badge'>{item.badge}</span>
                )}
              </button>
            ))}
          </nav>

          {/* Search Bar - with form submission */}
          <div className='header-search'>
            <form onSubmit={handleSearchSubmit} className='w-full'>
              <input
                ref={searchInputRef}
                type='text'
                placeholder='Rechercher sur Tulk...'
                value={localSearchQuery}
                onChange={handleSearchChange}
                onBlur={handleSearchBlur}
              />
            </form>
            {localSearchQuery ? (
              <button
                onClick={clearSearch}
                className='absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all hover:scale-110 active:scale-95 group/x'
                type='button'
              >
                <X size={14} className='group-hover:rotate-90 transition-transform duration-300' />
              </button>
            ) : (
              <div className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'>
                <Search size={18} />
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className='header-profile' ref={profileDropdownRef}>
            <div className='profile-pic'>
              <Avatar user={user} size='w-8 h-8' isLink={true} />
            </div>

            {/* Profile Dropdown Menu */}
            {isProfileDropdownOpen && (
              <div className='profile-dropdown-menu'>
                <div className='profile-dropdown-header'>
                  <div className='user-avatar'>
                    <Avatar user={user} size='w-12 h-12' isLink={true} />
                  </div>
                  <div className='user-info'>
                    <div className='user-name'>
                      {user?.prenom} {user?.nom}
                    </div>
                    <div className='user-role'>
                      {user?.role === 'admin'
                        ? 'Administrateur'
                        : user?.role === 'mod'
                        ? 'Modérateur'
                        : 'Utilisateur'}
                    </div>
                  </div>
                </div>
                <div className='profile-dropdown-divider'></div>
                <button
                  className='profile-dropdown-item'
                  onClick={() => handleProfileAction('profile')}
                >
                  <User size={18} />
                  <span>Mon Profil</span>
                </button>
                <button
                  className='profile-dropdown-item'
                  onClick={() => handleProfileAction('settings')}
                >
                  <Settings size={18} />
                  <span>Paramètres</span>
                </button>
                <button
                  className='profile-dropdown-item logout-item'
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
  )
}

export default Header
