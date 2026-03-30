import React from 'react'
import { getImageUrl } from '../../utils/imageUrls'

const Avatar = ({ user, size = 'w-8 h-8', className = '' }) => {
  const initials = `${user?.prenom?.[0] || ''}${
    user?.nom?.[0] || ''
  }`.toUpperCase()

  const handleImageError = e => {
    e.target.style.display = 'none'
    e.target.nextElementSibling.style.display = 'flex'
  }

  if (user?.image) {
    return (
      <div className={`${size} rounded-full overflow-hidden relative ${className}`}>
        <img
          src={getImageUrl(user.image)}
          alt={`${user.prenom} ${user.nom}`}
          className='w-full h-full object-cover'
          onError={handleImageError}
        />
        <div 
          className='hidden w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold'
          style={{ fontSize: 'calc(var(--size) / 2.5)' }} // Dynamic font size could be complex here, keeping it simple
        >
          {initials || '?'}
        </div>
      </div>
    )
  }

  return (
    <div className={`${size} rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold ${className}`}>
      {initials || '?'}
    </div>
  )
}

export default Avatar
