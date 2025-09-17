import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  email: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isPaying: boolean
  loading: boolean
  login: (email: string) => void
  logout: () => void
  upgradeToPaying: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isPaying, setIsPaying] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load user data from localStorage on mount
    const userEmail = localStorage.getItem('user')
    const payingStatus = localStorage.getItem('paying') === 'true'
    
    if (userEmail) {
      setUser({ email: userEmail })
    }
    setIsPaying(payingStatus)
    setLoading(false)
  }, [])

  const login = (email: string) => {
    setUser({ email })
    localStorage.setItem('user', email)
  }

  const logout = () => {
    setUser(null)
    setIsPaying(false)
    localStorage.removeItem('user')
    localStorage.removeItem('paying')
  }

  const upgradeToPaying = () => {
    setIsPaying(true)
    localStorage.setItem('paying', 'true')
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isPaying,
    loading,
    login,
    logout,
    upgradeToPaying
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 