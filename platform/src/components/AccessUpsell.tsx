import React from 'react'
import { Link } from 'react-router-dom'
import Card from './Card'
import Button from './Button'

interface AccessUpsellProps {
  required: 'free' | 'paying'
}

const AccessUpsell: React.FC<AccessUpsellProps> = ({ required }) => {
  const getMessage = () => {
    switch (required) {
      case 'free':
        return 'Create a free account to unlock this feature.'
      case 'paying':
        return 'Upgrade to a paid plan to unlock this feature.'
      default:
        return 'Access required to view this content.'
    }
  }

  const getCTAText = () => {
    switch (required) {
      case 'free':
        return 'Sign Up Free'
      case 'paying':
        return 'View Pricing'
      default:
        return 'Learn More'
    }
  }

  const getCTALink = () => {
    switch (required) {
      case 'free':
        return '/signup'
      case 'paying':
        return '/pricing'
      default:
        return '/'
    }
  }

  return (
    <Card padding="md" className="text-center">
      <div className="mb-4">
        <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {required === 'free' ? 'Sign Up Required' : 'Premium Feature'}
        </h3>
        <p className="text-gray-600">
          {getMessage()}
        </p>
      </div>
      
      <Link to={getCTALink()}>
        <Button className="w-full">
          {getCTAText()}
        </Button>
      </Link>
    </Card>
  )
}

export default AccessUpsell 