import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { ROUTES } from './constants'

// Import pages (we'll create these next)
import LoginPage from './pages/LoginPage'
import SetupPage from './pages/SetupPage'
import DashboardPage from './pages/DashboardPage'
import IdeasPage from './pages/IdeasPage'
import ProfilePage from './pages/ProfilePage'
import SecurityPage from './pages/SecurityPage'

// Import layout component
import Layout from './components/layout/Layout'
import ScrollToTop from './components/common/ScrollToTop'

// Protected Route component
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <ScrollToTop />
        <div className="App min-h-screen bg-background">
          <Routes>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
            
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path={ROUTES.SETUP} element={<SetupPage />} />
              <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
              <Route path={ROUTES.IDEAS} element={<IdeasPage />} />
              <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
              <Route path={ROUTES.SECURITY} element={<SecurityPage />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </Provider>
  )
}

export default App