import React, { useState } from 'react'
import Button from './Button'
import { Turnstile } from '@marsidev/react-turnstile'

interface WaitlistModalProps {
  isOpen: boolean
  onClose: () => void
}

const WaitlistModal: React.FC<WaitlistModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [submittedEmail, setSubmittedEmail] = useState('') // Store email for success message
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)

  // Enhanced email validation with security measures
  const validateEmail = (email: string): { isValid: boolean; error?: string } => {
    const trimmedEmail = email.trim().toLowerCase()
    
    // Basic format validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    
    if (!trimmedEmail) {
      return { isValid: false, error: 'Email address is required' }
    }
    
    if (trimmedEmail.length > 254) {
      return { isValid: false, error: 'Email address is too long' }
    }
    
    if (!emailRegex.test(trimmedEmail)) {
      return { isValid: false, error: 'Please enter a valid email address' }
    }
    
    // Security: Check for suspicious patterns
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /data:/i,
      /vbscript:/i
    ]
    
    if (suspiciousPatterns.some(pattern => pattern.test(trimmedEmail))) {
      return { isValid: false, error: 'Invalid email format detected' }
    }
    
    // Check for common disposable email domains (basic list)
    const disposableDomains = [
      '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 
      'mailinator.com', 'throwaway.email', 'temp-mail.org'
    ]
    
    const domain = trimmedEmail.split('@')[1]
    if (disposableDomains.includes(domain)) {
      return { isValid: false, error: 'Please use a permanent email address' }
    }
    
    return { isValid: true }
  }

  // Sanitize input to prevent XSS
  const sanitizeInput = (input: string): string => {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim()
      .slice(0, 100) // Limit length
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    // Validate and sanitize inputs
    const sanitizedEmail = sanitizeInput(email)
    const sanitizedName = sanitizeInput(name)
    
    const emailValidation = validateEmail(sanitizedEmail)
    if (!emailValidation.isValid) {
      setError(emailValidation.error || 'Invalid email address')
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('https://rs00fugmrh.execute-api.eu-north-1.amazonaws.com/dev/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: sanitizedEmail,
          name: sanitizedName,
          source: 'hero-modal',
          utm: window.location.search, // Include UTM parameters for tracking
          turnstileToken: turnstileToken // Include Turnstile token for bot protection
        }),
      })

      if (response.ok) {
        const responseData = await response.json()
        setSubmittedEmail(sanitizedEmail) // Store email for success message
        
        // Handle different response statuses
        if (responseData.status === 'already_confirmed') {
          setError('You\'re already on our waitlist! Check your email for updates.')
        } else if (responseData.status === 'already_pending') {
          setError('Please check your email for the confirmation link we sent earlier.')
        } else {
          setIsSuccess(true)
          setEmail('')
          setName('')
        }
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Something went wrong. Please try again.')
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setEmail('')
    setName('')
    setError('')
    setIsSuccess(false)
    setSubmittedEmail('')
    setTurnstileToken(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {!isSuccess ? (
            <>
              {/* Header */}
              <div className="px-6 pt-6 pb-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Join the Proptagon Waitlist
                </h2>
                <p className="text-gray-600">
                  Be the first to experience smarter property investing when we launch.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-6 pb-6">
                <div className="space-y-4">
                  {/* Name field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name (optional)
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                      placeholder="Your name"
                    />
                  </div>

                  {/* Email field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setError('') // Clear error when user types
                      }}
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors ${
                        email && !validateEmail(email).isValid 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-300'
                      }`}
                      placeholder="your@email.com"
                    />
                    {email && !validateEmail(email).isValid && (
                      <p className="mt-1 text-sm text-red-600">
                        {validateEmail(email).error}
                      </p>
                    )}
                  </div>

                  {/* Error/Info message */}
                  {error && (
                    <div className={`text-sm p-3 rounded-lg ${
                      error.includes('already') || error.includes('check your email')
                        ? 'text-blue-600 bg-blue-50 border border-blue-200'
                        : 'text-red-600 bg-red-50 border border-red-200'
                    }`}>
                      {error}
                    </div>
                  )}

                  {/* Turnstile widget */}
                  <div className="flex justify-center">
                    <Turnstile
                      siteKey="0x4AAAAAABz9j_2o-p61UTMt" // Your real Turnstile site key
                      onSuccess={(token) => setTurnstileToken(token)}
                      onError={() => setTurnstileToken(null)}
                      onExpire={() => setTurnstileToken(null)}
                    />
                  </div>

                  {/* Submit button */}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting || !email.trim() || !validateEmail(email).isValid || !turnstileToken}
                    className="w-full bg-sky-500 text-white hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Joining...' : 'Join Waitlist'}
                  </Button>
                </div>
              </form>
            </>
          ) : (
            /* Success state */
            <div className="px-6 py-8 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                You're on the list!
              </h3>
              <p className="text-gray-600 mb-6">
                We've sent a confirmation email to <strong>{submittedEmail}</strong>. 
                Please check your inbox and click the confirmation link.
              </p>
              <Button
                onClick={handleClose}
                size="lg"
                className="bg-sky-500 text-white hover:bg-sky-600"
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WaitlistModal
