import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Alert from '../components/common/Alert'
import { signInUser, signInWithGoogle, sendPasswordReset, clearError } from '../store/slices/authSlice'
import { ROUTES } from '../constants'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, passwordResetSent } = useSelector(state => state.auth)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    
    // Clear Redux error
    if (error) {
      dispatch(clearError())
    }
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    if (!formData.password) {
      errors.password = 'Password is required'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      const result = await dispatch(signInUser(formData)).unwrap()
      console.log('✅ User signed in successfully:', result)
      navigate(ROUTES.DASHBOARD)
    } catch (error) {
      console.error('❌ Sign in failed:', error)
      // Error is handled by Redux
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const result = await dispatch(signInWithGoogle()).unwrap()
      console.log('✅ Google sign in successful:', result)
      navigate(ROUTES.DASHBOARD)
    } catch (error) {
      console.error('❌ Google sign in failed:', error)
      // Error is handled by Redux
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    
    if (!formData.email) {
      setValidationErrors({ email: 'Please enter your email address' })
      return
    }

    try {
      await dispatch(sendPasswordReset(formData.email)).unwrap()
      console.log('✅ Password reset email sent')
    } catch (error) {
      console.error('❌ Password reset failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">P</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to PeakDraft</h1>
          <p className="text-gray-300">Professional options trading made simple</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          {/* Success Message for Password Reset */}
          {passwordResetSent && (
            <Alert type="success" className="mb-6">
              Password reset email sent! Check your inbox.
            </Alert>
          )}

          {/* Error Message */}
          {error && (
            <Alert type="error" className="mb-6">
              {error}
            </Alert>
          )}

          {!showForgotPassword ? (
            // Sign In Form
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={validationErrors.email}
                placeholder="Enter your email"
                required
                autoComplete="email"
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={validationErrors.password}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-accent hover:text-accent/80 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                className="w-full"
                loading={loading}
                size="lg"
              >
                Sign In
              </Button>
            </form>
          ) : (
            // Forgot Password Form
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div className="text-center mb-4">
                <h2 className="text-xl font-semibold text-primary">Reset Password</h2>
                <p className="text-sm text-muted mt-1">
                  Enter your email address and we'll send you a reset link
                </p>
              </div>

              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={validationErrors.email}
                placeholder="Enter your email"
                required
                autoComplete="email"
              />

              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full"
                  loading={loading}
                  size="lg"
                >
                  Send Reset Email
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setShowForgotPassword(false)
                    dispatch(clearError())
                  }}
                  size="lg"
                >
                  Back to Sign In
                </Button>
              </div>
            </form>
          )}

          {!showForgotPassword && (
            <>
              {/* Divider */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                {/* Google Sign In */}
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  size="lg"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>
              </div>

              {/* Sign Up Link */}
              <div className="mt-8 text-center text-sm text-gray-600">
                <p>
                  Don't have an account?{' '}
                  <Link to={ROUTES.SIGNUP} className="text-accent hover:text-accent/80 font-medium">
                    Sign up
                  </Link>
                </p>
              </div>
            </>
          )}

          <div className="mt-8 text-center text-sm text-gray-600">
            <p>Secure. Encrypted. Trusted by investors.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage