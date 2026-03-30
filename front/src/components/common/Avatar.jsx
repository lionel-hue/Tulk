import React from 'react'
import { getImageUrl } from '../../utils/imageUrls'

const Avatar = ({ user, size = 'w-8 h-8', className = '' }) => {
  const [hasError, setHasError] = React.useState(false)
  const initials = `${user?.prenom?.[0] || ''}${
    user?.nom?.[0] || ''
  }`.toUpperCase()

  const imageUrl = React.useMemo(() => {
    if (!user?.image) return null
    return getImageUrl(user.image)
  }, [user?.image])

  if (imageUrl && !hasError) {
    return (
      <div className={`${size} rounded-full overflow-hidden relative ${className}`}>
        <img
          src={imageUrl}
          alt={`${user.prenom} ${user.nom}`}
          className='w-full h-full object-cover'
          onError={() => setHasError(true)}
        />
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
