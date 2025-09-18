import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <Navbar />
      <div className="border-b-2 border-sky-100"></div>
      <main className="flex-1 w-full pt-16 relative z-0 overflow-hidden min-h-0">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout 