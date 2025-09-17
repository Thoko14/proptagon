import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import InputField from '../components/InputField'
import Button from '../components/Button'

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)
    // Clear error when user starts typing
    if (error) {
      setError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate email
    if (!email.trim()) {
      setError('Email address is required')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      // Simulate backend call to send OTP
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Redirect to reset password page with success message and email
      navigate('/reset-password', { 
        state: { 
          message: 'We\'ve sent a verification code to your email.',
          email: email
        }
      })
    } catch (error) {
      console.error('Password reset error:', error)
      setError('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Forgot your password?
        </h1>
        <p className="text-gray-600">
          Enter your email and we'll send you a 6-digit code to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Email Address"
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={handleEmailChange}
          error={error}
          required
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Sending Code...' : 'Send Code'}
        </Button>
      </form>

      <div className="mt-6 text-center">
                    <Link 
              to="/login" 
              className="text-sm text-primary hover:text-primary-hover font-medium"
            >
              Back to login
            </Link>
      </div>
    </div>
  )
}

export default ForgotPasswordPage 