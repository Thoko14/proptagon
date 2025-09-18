import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { AuthProvider } from './context/useAuth'
import LandingPage from './pages/LandingPage'
import AboutPage from './pages/AboutPage'
import PrivacyPage from './pages/PrivacyPage'
import UnsubscribedPage from './pages/UnsubscribedPage'
import ConfirmedPage from './pages/ConfirmedPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import DashboardPage from './pages/dashboard'
import AuthModal from './components/AuthModal'
import GrowLandingPage from '../../modules/grow/frontend/GrowLandingPage'
import GrowPage from './pages/GrowPage'
import InvestPage from '../../modules/invest/frontend/App'
import StrategisePage from '../../modules/strategise/frontend/App'
import ManagePage from '../../modules/manage/frontend/App'
import SellPage from '../../modules/sell/frontend/App'
import { useAuth } from './context/useAuth'

// Component to handle Grow routing based on authentication status
function GrowRoute() {
  const { isAuthenticated, user } = useAuth()
  
  // Debug logging
  console.log('GrowRoute - isAuthenticated:', isAuthenticated, 'user:', user)
  
  // If authenticated, show the full Grow application
  // If not authenticated, show the landing page
  return isAuthenticated ? <GrowPage /> : <GrowLandingPage />
}

function AppContent() {
  const location = useLocation()
  const navigate = useNavigate()
  const [modalType, setModalType] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // Check if current route is an auth route
    const authRoutes = ['/login', '/signup', '/verify-email', '/forgot-password', '/reset-password']
    const isAuthRoute = authRoutes.includes(location.pathname)
    
    if (isAuthRoute) {
      setModalType(location.pathname)
      setIsModalOpen(true)
    } else {
      setModalType(null)
      setIsModalOpen(false)
    }
  }, [location.pathname])

  const handleCloseModal = () => {
    setIsModalOpen(false)
    navigate('/')
  }

  const renderModalContent = () => {
    switch (modalType) {
      case '/login':
        return <LoginPage />
      case '/signup':
        return <SignUpPage />
      case '/verify-email':
        return <VerifyEmailPage />
      case '/forgot-password':
        return <ForgotPasswordPage />
      case '/reset-password':
        return <ResetPasswordPage />
      default:
        return null
    }
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <Routes>
        {/* Landing and public pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/waitlist-confirmed" element={<ConfirmedPage />} />
        <Route path="/waitlist-unsubscribed" element={<UnsubscribedPage />} />
        
        {/* Module landing pages (for non-logged-in users) */}
        <Route path="/grow" element={<GrowRoute />} />
        <Route path="/invest" element={<InvestPage />} />
        <Route path="/strategise" element={<StrategisePage />} />
        <Route path="/manage" element={<ManagePage />} />
        <Route path="/sell" element={<SellPage />} />
        
        {/* Authenticated routes */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/grow/app" element={<GrowPage />} />
        
        {/* Auth routes are handled by modal */}
        <Route path="/login" element={<LandingPage />} />
        <Route path="/signup" element={<LandingPage />} />
        <Route path="/verify-email" element={<LandingPage />} />
        <Route path="/forgot-password" element={<LandingPage />} />
        <Route path="/reset-password" element={<LandingPage />} />
      </Routes>

      <AuthModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      >
        {renderModalContent()}
      </AuthModal>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App