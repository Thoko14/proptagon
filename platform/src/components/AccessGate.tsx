import React, { ReactNode } from 'react'
import { useAuth } from '../context/useAuth'
import AccessUpsell from './AccessUpsell'

interface AccessGateProps {
  required?: 'visitor' | 'free' | 'paying'
  children: ReactNode
}

const AccessGate: React.FC<AccessGateProps> = ({ 
  required = 'free', 
  children 
}) => {
  const { isAuthenticated, isPaying, loading } = useAuth()

  // Show nothing while loading
  if (loading) {
    return null
  }

  // Check access level
  const hasAccess = (() => {
    switch (required) {
      case 'visitor':
        return true // Everyone can access
      case 'free':
        return isAuthenticated // Must be logged in
      case 'paying':
        return isAuthenticated && isPaying // Must be logged in and paying
      default:
        return false
    }
  })()

  if (!hasAccess) {
    // Determine what level of access is needed for the upsell
    const upsellRequired = required === 'paying' ? 'paying' : 'free'
    return <AccessUpsell required={upsellRequired} />
  }

  return <>{children}</>
}

export default AccessGate 