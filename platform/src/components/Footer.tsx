import React from 'react'

const Footer: React.FC = () => {
  return (
      <footer className="bg-slate-800 text-white py-4">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Brand + Social Icons */}
            <div className="flex items-center gap-4">
              <h3 className="text-base font-bold text-white">Proptagon</h3>
              <div className="flex space-x-3">
                {/* Social Icons */}
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">...</svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">...</svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">...</svg>
                </a>
              </div>
            </div>

            {/* Horizontal Links */}
            <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm">
              <a href="/about" className="text-gray-300 hover:text-white">About</a>
              <a href="/contact" className="text-gray-300 hover:text-white">Contact</a>
              <a href="/legal" className="text-gray-300 hover:text-white">Legal</a>
              <a href="/privacy" className="text-gray-300 hover:text-white">Privacy</a>
            </div>
          </div>

          {/* Bottom Line */}
          <div className="mt-4 text-center text-xs text-gray-400">
            © 2025 Proptagon. All rights reserved.
          </div>
        </div>
      </footer>
  )
}

export default Footer 