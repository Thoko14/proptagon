import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import OTPInput from '../components/OTPInput'
import Button from '../components/Button'

const VerifyEmailPage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendCountdown, setResendCountdown] = useState(0)
  const [successMessage, setSuccessMessage] = useState('')

  // Get email from navigation state
  const email = location.state?.email || 'your email'

  useEffect(() => {
    // Start resend countdown
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCountdown])

  const validateOTP = (code: string): boolean => {
    // Check if it's exactly 6 digits
    const otpRegex = /^\d{6}$/
    return otpRegex.test(code)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateOTP(otp)) {
      setError('Please enter a valid 6-digit code')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      // Simulate backend verification
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // For demo purposes, accept any 6-digit code
      // In real implementation, this would verify against the backend
      if (otp === '123456') {
        // Simulate incorrect code
        setError('Invalid verification code. Please try again.')
      } else {
        // Success - redirect to dashboard
        setSuccessMessage('Email verified successfully! Redirecting to dashboard...')
        setTimeout(() => {
          navigate('/dashboard')
        }, 2000)
      }
    } catch (error) {
      console.error('Verification error:', error)
      setError('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendCode = async () => {
    setIsResending(true)
    setError('')

    try {
      // Simulate resend API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Start countdown (30 seconds)
      setResendCountdown(30)
      setSuccessMessage('A new verification code has been sent to your email')
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (error) {
      console.error('Resend error:', error)
      setError('Failed to resend code. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  const handleOTPChange = (value: string) => {
    setOtp(value)
    // Clear error when user starts typing
    if (error) {
      setError('')
    }
  }

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Verify your email
        </h1>
        <p className="text-gray-600">
          We've sent a 6-digit code to <span className="text-primary font-medium">{email}</span>. 
          Enter it below to confirm your account.
        </p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm">{successMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <OTPInput
          value={otp}
          onChange={handleOTPChange}
          error={error}
          disabled={isSubmitting}
          autoFocus={true}
        />

        <Button
          type="submit"
          disabled={isSubmitting || otp.length !== 6}
          className="w-full"
        >
          {isSubmitting ? 'Verifying...' : 'Verify Email'}
        </Button>
      </form>

      <div className="mt-6 text-center space-y-4">
        <div>
          {resendCountdown > 0 ? (
            <p className="text-sm text-gray-500">
              Resend code in {resendCountdown} seconds
            </p>
          ) : (
            <Button
              variant="secondary"
              onClick={handleResendCode}
              disabled={isResending}
              className="text-sm"
            >
              {isResending ? 'Sending...' : 'Resend code'}
            </Button>
          )}
        </div>

        <div>
                        <a href="#" className="text-sm text-primary hover:text-primary-hover font-medium">
                Didn't receive the code?
              </a>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmailPage 