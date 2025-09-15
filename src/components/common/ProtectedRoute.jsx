import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { ROUTES } from '../../constants'
import { loadUserProfile, clearUserData } from '../../store/slices/userSlice'
import LoadingSpinner from './LoadingSpinner'

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const { profileLoaded, loading } = useSelector(state => state.user)

  // Load user profile when user is authenticated but profile not loaded
  useEffect(() => {
    if (isAuthenticated && user && !profileLoaded) {
      console.log('👤 Loading user profile for:', user.uid)
      dispatch(loadUserProfile(user.uid))
    } else if (!isAuthenticated) {
      // Clear user data when not authenticated
      dispatch(clearUserData())
    }
  }, [isAuthenticated, user, profileLoaded, dispatch])

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  // Authenticated but profile still loading
  if (!profileLoaded && loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size={48} />
          <p className="text-muted mt-4">Loading your profile...</p>
        </div>
      </div>
    )
  }

  // Authenticated - show content (setup flow handled by SetupGate)
  return children
}

export default ProtectedRoute