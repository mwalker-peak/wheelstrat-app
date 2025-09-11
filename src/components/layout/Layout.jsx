import React from 'react'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Header from './Header'
import BottomNavigation from './BottomNavigation'
import Sidebar from './Sidebar'

const Layout = () => {
  const { profile } = useSelector(state => state.user)

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Compact on mobile */}
      <Header />
      
      <div className="flex">
        {/* Desktop Sidebar - Hidden on mobile */}
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 pb-16 md:pb-0 md:ml-0">
          <div className="container mx-auto px-3 md:px-4 py-4 md:py-6 max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}

export default Layout