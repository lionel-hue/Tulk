// components/SideMenuNav.jsx
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  LayoutDashboard,
  Users,
  MessageCircle,
  Bell,
  User,
  Settings,
  X,
  LogOut
} from 'lucide-react'
import { getImageUrl } from '../utils/imageUrls'
import Avatar from './common/Avatar'
import { useNotificationCounts } from '../hooks/useNotificationCounts'

const SideMenuNav = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth()
  const sidebarRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { messages, notifications, friends, home } = useNotificationCounts()

  useEffect(() => {
    const handleClickOutside = event => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  useEffect(() => {
    const handleEscape = event => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const handleNavigation = section => {
    navigate(section === 'feed' ? '/home' : `/${section}`)
    onClose()
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems = [
    {
      id: 'feed',
      icon: LayoutDashboard,
      label: "Fil d'actualité",
      badge: home
    },
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
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Side Menu - Glass Panel */}
      <div
        ref={sidebarRef}
        className={`fixed left-0 top-0 h-full w-80 bg-[#0f0f0f]/90 backdrop-blur-3xl border-r border-white/5 z-[70] transition-all duration-700 ease-out flex flex-col ${isOpen ? 'translate-x-0 opacity-100 shadow-[20px_0_50px_rgba(0,0,0,0.5)]' : '-translate-x-full opacity-0 invisible pointer-events-none'}`}
      >
        {/* Side Menu Header with Logo */}
        <div className='p-8 flex items-center justify-between'>
          <div className='flex items-center gap-4 group/logo'>
            <div className='w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center font-black text-2xl shadow-2xl group-hover/logo:rotate-12 group-hover/logo:scale-110 transition-all duration-500'>T</div>
            <div>
              <h2 className='text-white font-black text-xl tracking-tighter leading-none'>Tulk</h2>
              <p className='text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1'>Univers Connecté</p>
            </div>
          </div>
          <button 
            className='w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all group/x' 
            onClick={onClose}
          >
            <X size={20} className='group-hover:rotate-90 transition-transform duration-300' />
          </button>
        </div>

        {/* User Identity Card */}
        <div className='px-8 py-6 mb-4'>
          <button 
            onClick={() => handleNavigation('profile')}
            className='w-full text-left bg-white/5 border border-white/5 rounded-[2rem] p-6 hover:border-white/20 hover:bg-white/10 transition-all group/user'
          >
            <div className='flex items-center gap-4'>
              <div className='relative'>
                 <Avatar user={user} size='w-12 h-12' className='rounded-2xl border-2 border-white/10 group-hover/user:scale-110 transition-transform duration-500' />
                 <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#0f0f0f] rounded-full'></div>
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-white font-black text-sm tracking-tight truncate'>
                  {user?.prenom} {user?.nom}
                </p>
                <p className='text-gray-500 text-[10px] font-black uppercase tracking-widest truncate opacity-60'>
                   {user?.role === 'admin' ? 'Administrator' : 'Premium Member'}
                </p>
              </div>
            </div>
          </button>
        </div>

        <nav className='flex-1 px-6 space-y-2 overflow-y-auto no-scrollbar'>
          {/* Navigation Items */}
          {menuItems.map(item => {
            const isActive = location.pathname.includes(item.id) || (item.id === 'feed' && location.pathname === '/home');
            return (
              <button
                key={item.id}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] transition-all duration-500 relative group ${
                  isActive ? 'bg-white text-black shadow-2xl scale-105' : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => handleNavigation(item.id)}
              >
                <item.icon size={18} className={`${isActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-100 group-hover:scale-125'} transition-all`} />
                <span>{item.label}</span>
                {item.badge !== null && item.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-black border ${
                    isActive ? 'bg-black text-white border-white/20' : 'bg-red-500 text-white border-red-400 shadow-lg shadow-red-500/20'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout section */}
        <div className='p-8 mt-auto border-t border-white/5'>
          <button 
            className='w-full flex items-center justify-center gap-4 py-4 bg-red-500/10 text-red-500 rounded-2xl font-black text-[10px] tracking-[0.3em] uppercase hover:bg-red-500 hover:text-white transition-all duration-500 group shadow-lg overflow-hidden relative' 
            onClick={handleLogout}
          >
            <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000'></div>
            <LogOut size={20} className='group-hover:-translate-x-1 transition-transform' />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </>
  )
}

export default SideMenuNav
