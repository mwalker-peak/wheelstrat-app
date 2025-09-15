import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { store } from './store/store'
import { ROUTES } from './constants'
import { setAuthState } from './store/slices/authSlice'
import databaseService from './services/database'

// Import pages
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import SetupPage from './pages/SetupPage'
import DashboardPage from './pages/DashboardPage'
import IdeasPage from './pages/IdeasPage'
import ProfilePage from './pages/ProfilePage'
import SecurityPage from './pages/SecurityPage'

// Import layout
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/common/ProtectedRoute'
import LoadingSpinner from './components/common/LoadingSpinner'

// Auth state listener component
function AuthStateListener() {
  const dispatch = useDispatch()

  useEffect(() => {
    console.log('🔐 Setting up auth state listener...')
    
    const unsubscribe = databaseService.onAuthStateChanged((user) => {
      console.log('🔄 Auth state changed:', user ? 'User signed in' : 'User signed out')
      dispatch(setAuthState(user))
    })

    return () => {
      console.log('🔐 Cleaning up auth state listener')
      unsubscribe()
    }
  }, [dispatch])

  return null
}

// Setup check component - determines if user needs to complete setup
function SetupGate({ children }) {
  const { profile, profileLoaded } = useSelector(state => state.user)
  
  // Still loading profile
  if (!profileLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size={48} />
          <p className="text-muted mt-4">Loading your profile...</p>
        </div>
      </div>
    )
  }
  
  // Profile loaded but setup not completed - redirect to setup
  if (profileLoaded && !profile.setupCompleted) {
    console.log('🔄 User needs to complete setup, redirecting...')
    return <Navigate to={ROUTES.SETUP} replace />
  }
  
  // Setup completed - show protected content
  return children
}

// Main app content
function AppContent() {
  const { isAuthenticated, loading } = useSelector(state => state.auth)

  // Show loading spinner while auth state is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size={48} />
          <p className="text-muted mt-4">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="App min-h-screen bg-background">
        <AuthStateListener />
        
        <Routes>
          {/* Public routes */}
          <Route 
            path={ROUTES.LOGIN} 
            element={
              isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} replace /> : <LoginPage />
            } 
          />
          <Route 
            path={ROUTES.SIGNUP} 
            element={
              isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} replace /> : <SignUpPage />
            } 
          />
          
          {/* Root redirect */}
          <Route 
            path={ROUTES.HOME} 
            element={
              <Navigate to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN} replace />
            } 
          />
          
          {/* Setup page - accessible when authenticated but setup not completed */}
          <Route 
            path={ROUTES.SETUP} 
            element={
              <ProtectedRoute>
                <SetupPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected routes - require authentication AND completed setup */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <SetupGate>
                  <Layout />
                </SetupGate>
              </ProtectedRoute>
            }
          >
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
            <Route path={ROUTES.IDEAS} element={<IdeasPage />} />
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
            <Route path={ROUTES.SECURITY} element={<SecurityPage />} />
          </Route>
          
          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
        </Routes>
      </div>
    </Router>
  )
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}

export default App