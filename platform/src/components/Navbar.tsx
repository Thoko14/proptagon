import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()

  const handleLoginClick = () => {
    navigate('/login')
  }

  const handleLogoutClick = () => {
    logout()
    navigate('/')
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'separator', path: '' },
    { name: 'Grow', path: '/grow' },
    { name: 'Invest', path: '/invest' },
    { name: 'Strategise', path: '/strategise' },
    { name: 'Manage', path: '/manage' },
    { name: 'Sell', path: '/sell' }
  ]

  const isActiveLink = (path: string) => location.pathname === path

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary">Proptagon</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            {navLinks.map((link) => {
              if (link.name === 'separator') {
                return (
                  <div key={link.name} className="flex items-center ml-8 mr-6">
                    <div className="w-px h-6 bg-gray-300"></div>
                    <span className="ml-3 text-xs text-gray-500 font-medium">MODULES:</span>
                  </div>
                )
              }
              
              // Different spacing for main nav vs modules
              const isMainNav = link.name === 'Home' || link.name === 'About';
              const spacingClass = isMainNav ? 'mr-8' : 'mr-5';
              
              return (
                <Link 
                  key={link.name}
                  to={link.path} 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${spacingClass} ${
                    isActiveLink(link.path)
                      ? 'text-primary bg-primary-light'
                      : 'text-gray-700 hover:text-primary'
                  }`}
                >
                  {link.name}
                </Link>
              )
            })}
            
            {/* Login/Logout Button */}
            {isAuthenticated ? (
              <button
                onClick={handleLogoutClick}
                className="ml-8 px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={handleLoginClick}
                className="ml-8 px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-dark transition-colors"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {navLinks.map((link) => {
              if (link.name === 'separator') {
                return (
                  <div key={link.name} className="px-3 py-2">
                    <div className="border-t border-gray-200 my-2"></div>
                    <span className="text-xs text-gray-500 font-medium">MODULES</span>
                  </div>
                )
              }
              return (
                <Link 
                  key={link.name}
                  to={link.path} 
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActiveLink(link.path)
                      ? 'text-primary bg-primary-light'
                      : 'text-gray-700 hover:text-primary'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              )
            })}
            
            {/* Mobile Login/Logout Button */}
            <div className="px-3 py-2">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleLogoutClick()
                    setIsMenuOpen(false)
                  }}
                  className="w-full px-4 py-2 bg-gray-600 text-white text-base font-medium rounded-md hover:bg-gray-700 transition-colors"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleLoginClick()
                    setIsMenuOpen(false)
                  }}
                  className="w-full px-4 py-2 bg-primary text-white text-base font-medium rounded-md hover:bg-primary-dark transition-colors"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar