import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, TrendingUp, User, Shield, Bell } from 'lucide-react'
import { ROUTES } from '../../constants'

const Sidebar = () => {
  const location = useLocation()

  const navigationItems = [
    { name: 'Dashboard', path: ROUTES.DASHBOARD, icon: Home },
  { name: 'Ideas', path: ROUTES.IDEAS, icon: TrendingUp },
    { name: 'Profile', path: ROUTES.PROFILE, icon: User },
    { name: 'Security', path: ROUTES.SECURITY, icon: Shield },
  ]

  return (
    <aside className="hidden md:block w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const IconComponent = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-accent bg-accent/10 font-medium'
                  : 'text-muted hover:text-primary hover:bg-gray-50'
              }`}
            >
              <IconComponent size={20} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar