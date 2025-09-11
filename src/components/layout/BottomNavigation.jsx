import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, TrendingUp, User, Bell } from 'lucide-react'
import { ROUTES } from '../../constants'

const BottomNavigation = () => {
  const location = useLocation()

  const navigationItems = [
    { name: 'Home', path: ROUTES.DASHBOARD, icon: Home },
  { name: 'Ideas', path: ROUTES.IDEAS, icon: TrendingUp },
    { name: 'Alerts', path: ROUTES.DASHBOARD, icon: Bell }, // Links to dashboard alerts section
    { name: 'Profile', path: ROUTES.PROFILE, icon: User },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="grid grid-cols-4">
        {navigationItems.map((item) => {
          const IconComponent = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center py-2 px-1 min-h-[60px] transition-colors ${
                isActive
                  ? 'text-accent bg-accent/5'
                  : 'text-muted hover:text-primary'
              }`}
            >
              <IconComponent size={20} className="mb-1" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNavigation