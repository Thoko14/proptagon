import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import InputField from '../components/InputField'
import Button from '../components/Button'

interface FormData {
  email: string
  password: string
}

interface FormErrors {
  email?: string
  password?: string
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      newErrors.email = 'Email address is required'
    } else if (formData.email !== 'test' && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters'
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
      // Simulate login API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // For demo purposes, accept test credentials
      // In real implementation, this would authenticate against the backend
      if ((formData.email === 'test' && formData.password === 'test') || 
          (formData.email === 'demo@propbase.com' && formData.password === 'password123')) {
        // Success - login and redirect to dashboard
        login(formData.email)
        navigate('/dashboard')
      } else {
        // Simulate invalid credentials
        setErrors({
          email: 'Invalid email or password',
          password: 'Invalid email or password'
        })
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrors({
        email: 'An error occurred. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back
        </h1>
        <p className="text-gray-600">
          Log in to explore investment opportunities
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Email Address"
          type="email"
          placeholder="Enter your email address"
          value={formData.email}
          onChange={(value) => handleInputChange('email', value)}
          error={errors.email}
          required
        />

        <InputField
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(value) => handleInputChange('password', value)}
          error={errors.password}
          required
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div className="mt-6 text-center space-y-4">
        <div>
                            <Link 
                    to="/forgot-password" 
                    className="text-sm text-primary hover:text-primary-hover font-medium"
                  >
                    Forgot your password?
                  </Link>
        </div>

        <div>
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
                            <Link 
                  to="/signup" 
                  className="text-primary hover:text-primary-hover font-medium"
                >
                  Sign up
                </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage 