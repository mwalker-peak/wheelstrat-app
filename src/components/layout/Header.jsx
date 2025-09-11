// FILE: src/components/layout/Header.jsx
import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Menu, X, User, LogOut, Settings } from 'lucide-react'
import { logout } from '../../store/slices/authSlice'
import { ROUTES } from '../../constants'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate(ROUTES.LOGIN)
  }

  const navigationItems = [
    { name: 'Dashboard', path: ROUTES.DASHBOARD },
    { name: 'Ideas', path: ROUTES.IDEAS },
    { name: 'Profile', path: ROUTES.PROFILE },
    { name: 'Security', path: ROUTES.SECURITY },
  ]

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12 md:h-16">
          {/* Mobile Menu Button - Left Side */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-50 -ml-2"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Desktop Logo - Hidden on mobile */}
          <Link to={ROUTES.DASHBOARD} className="hidden md:flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="text-xl font-bold text-primary">WheelStrat</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-accent bg-accent/10'
                    : 'text-muted hover:text-primary'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Menu - Right Side */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 p-1 md:p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-6 h-6 md:w-8 md:h-8 bg-accent rounded-full flex items-center justify-center">
                <User size={14} className="md:hidden text-white" />
                <User size={16} className="hidden md:block text-white" />
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700">
                {user?.name || 'User'}
              </span>
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                <Link
                  to={ROUTES.PROFILE}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <Settings size={16} className="mr-2" />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation - Left Aligned */}
        {isMenuOpen && (
          <nav className="md:hidden py-3 border-t border-gray-200">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-accent bg-accent/10'
                      : 'text-muted hover:text-primary hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile-only user actions */}
              <div className="pt-3 mt-3 border-t border-gray-200">
                <Link
                  to={ROUTES.PROFILE}
                  className="flex items-center px-3 py-2 text-base font-medium text-muted hover:text-primary hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings size={18} className="mr-3" />
                  Settings
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center w-full px-3 py-2 text-base font-medium text-muted hover:text-primary hover:bg-gray-50 rounded-md"
                >
                  <LogOut size={18} className="mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header