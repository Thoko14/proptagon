import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import OTPInput from '../components/OTPInput'
import InputField from '../components/InputField'
import Button from '../components/Button'

interface FormData {
  otp: string
  newPassword: string
  confirmPassword: string
}

interface FormErrors {
  otp?: string
  newPassword?: string
  confirmPassword?: string
}

const ResetPasswordPage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>({
    otp: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Get email from navigation state
  const email = location.state?.email || 'your email'

  const validateOTP = (code: string): boolean => {
    const otpRegex = /^\d{6}$/
    return otpRegex.test(code)
  }

  const validatePassword = (password: string): boolean => {
    return password.length >= 8 && /\d/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password)
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // OTP validation
    if (!validateOTP(formData.otp)) {
      newErrors.otp = 'Please enter a valid 6-digit code'
    }

    // New password validation
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters'
    } else if (!validatePassword(formData.newPassword)) {
      newErrors.newPassword = 'Password must include a number and special character'
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate backend password reset
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // For demo purposes, accept any valid 6-digit OTP
      // In real implementation, this would verify against the backend
      if (formData.otp === '123456') {
        // Simulate incorrect OTP
        setErrors({
          otp: 'Invalid verification code. Please try again.'
        })
      } else {
        // Success - show success message and redirect to login
        setSuccessMessage('Password reset successfully! Redirecting to login...')
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Your password has been reset successfully. Please log in with your new password.'
            }
          })
        }, 2000)
      }
    } catch (error) {
      console.error('Password reset error:', error)
      setErrors({
        otp: 'An error occurred. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Reset your password
        </h1>
        <p className="text-gray-600">
          Enter the 6-digit code we sent to <span className="text-primary font-medium">{email}</span> and choose a new password.
        </p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm">{successMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Verification Code
          </label>
          <OTPInput
            value={formData.otp}
            onChange={(value) => handleInputChange('otp', value)}
            error={errors.otp}
            disabled={isSubmitting}
            autoFocus={true}
          />
        </div>

        <InputField
          label="New Password"
          type="password"
          placeholder="Enter your new password"
          value={formData.newPassword}
          onChange={(value) => handleInputChange('newPassword', value)}
          error={errors.newPassword}
          required
        />

        <InputField
          label="Confirm Password"
          type="password"
          placeholder="Confirm your new password"
          value={formData.confirmPassword}
          onChange={(value) => handleInputChange('confirmPassword', value)}
          error={errors.confirmPassword}
          required
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Setting New Password...' : 'Set New Password'}
        </Button>
      </form>

      <div className="mt-6 text-center">
                    <Link 
              to="/login" 
              className="text-sm text-primary hover:text-primary-hover font-medium"
            >
              Remembered your password? Log in
            </Link>
      </div>
    </div>
  )
}

export default ResetPasswordPage 