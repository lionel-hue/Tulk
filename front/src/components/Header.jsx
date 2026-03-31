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
      <header className='sticky top-0 z-40 bg-[#060606]/80 backdrop-blur-xl border-b border-white/5 transition-all duration-500'>
        <div className='max-w-full mx-auto px-4 md:px-8 flex items-center justify-between h-20 gap-6'>
          {/* Side Menu Toggle */}
          <button 
            className='w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-white hover:bg-white/10 transition-all hover:scale-110 active:scale-95 group shadow-xl' 
            onClick={onSidebarToggle}
          >
            <Menu size={22} className='group-hover:rotate-12 transition-transform duration-300' />
          </button>

          {/* Desktop Navigation */}
          <nav className='hidden lg:flex items-center gap-2'>
            {navItems.map(item => (
              <button
                key={item.id}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 relative group ${
                  activeSection === item.id 
                    ? 'bg-white text-black shadow-2xl scale-105' 
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => handleNavigation(item.id)}
              >
                <item.icon size={16} className={`${activeSection === item.id ? 'opacity-100' : 'opacity-40 group-hover:opacity-100 group-hover:scale-125'} transition-all`} />
                <span>{item.label}</span>
                {item.badge !== null && item.badge > 0 && (
                  <span className={`absolute -top-1 -right-1 px-2 py-0.5 rounded-full text-[8px] font-black border animate-pulse ${
                    activeSection === item.id ? 'bg-black text-white border-white/20' : 'bg-red-500 text-white border-red-400 shadow-xl shadow-red-500/20'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Search Bar - with form submission */}
          <div className='relative flex-1 max-w-2xl group/search'>
            <form onSubmit={handleSearchSubmit} className='w-full relative'>
              <input
                ref={searchInputRef}
                type='text'
                placeholder='Exploration Tulk...'
                className='w-full px-6 py-3.5 bg-white/5 border border-white/5 rounded-2xl text-white text-sm font-bold tracking-tight outline-none focus:ring-4 focus:ring-purple-500/20 focus:bg-white/10 focus:border-purple-500/30 transition-all placeholder:text-gray-600'
                value={localSearchQuery}
                onChange={handleSearchChange}
                onBlur={handleSearchBlur}
              />
              <div className='absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 group-focus-within/search:opacity-100 transition-opacity'>
                <Search size={18} className='text-purple-400' />
              </div>
            </form>
            {localSearchQuery && (
              <button
                onClick={clearSearch}
                className='absolute right-12 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all hover:scale-110 active:scale-95 group/x'
                type='button'
              >
                <X size={14} className='group-hover:rotate-90 transition-transform duration-300' />
              </button>
            )}
          </div>

          {/* User Profile */}
          <div className='relative' ref={profileDropdownRef}>
            <button 
              onClick={toggleProfileDropdown}
              className='p-1 bg-white/5 rounded-2xl border border-white/5 hover:border-white/20 transition-all hover:scale-105 active:scale-95'
            >
              <Avatar user={user} size='w-10 h-10' className='rounded-xl' />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileDropdownOpen && (
              <div className='absolute right-0 top-full mt-4 w-72 bg-[#0f0f0f]/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-300 z-50'>
                <div className='p-8'>
                  <div className='flex items-center gap-4 mb-8'>
                    <Avatar user={user} size='w-14 h-14' className='rounded-2xl border-2 border-white/10' />
                    <div className='min-w-0'>
                      <div className='text-white font-black text-lg tracking-tight truncate'>
                        {user?.prenom} {user?.nom}
                      </div>
                      <div className='text-[10px] font-black uppercase tracking-widest text-purple-400 mt-1'>
                        {user?.role === 'admin' ? 'Administrator' : 'Premium Member'}
                      </div>
                    </div>
                  </div>
                  
                  <div className='space-y-2'>
                    <button
                      className='w-full flex items-center gap-4 p-4 rounded-2xl text-gray-400 hover:text-white hover:bg-white/5 transition-all group/item'
                      onClick={() => handleProfileAction('profile')}
                    >
                      <User size={18} className='group-hover/item:scale-125 transition-transform' />
                      <span className='font-bold text-sm'>Mon Profil</span>
                    </button>
                    <button
                      className='w-full flex items-center gap-4 p-4 rounded-2xl text-gray-400 hover:text-white hover:bg-white/5 transition-all group/item'
                      onClick={() => handleProfileAction('settings')}
                    >
                      <Settings size={18} className='group-hover/item:scale-125 transition-transform' />
                      <span className='font-bold text-sm'>Paramètres</span>
                    </button>
                    <div className='h-px bg-white/5 my-4 mx-2'></div>
                    <button
                      className='w-full flex items-center gap-4 p-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all group/item'
                      onClick={() => handleProfileAction('logout')}
                    >
                      <LogOut size={18} className='group-hover/item:translate-x-1 transition-transform' />
                      <span className='font-black text-xs tracking-widest uppercase'>Déconnexion</span>
                    </button>
                  </div>
                </div>
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
