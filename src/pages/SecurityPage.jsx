import React, { useState } from 'react'
import { Shield, Lock, Smartphone, Eye, EyeOff, CheckCircle, AlertTriangle } from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Alert from '../components/common/Alert'

const SecurityPage = () => {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handlePasswordChange = (field, value) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }))
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match')
      return
    }
    
    if (passwordForm.newPassword.length < 8) {
      alert('Password must be at least 8 characters long')
      return
    }

    // Simulate password update
    console.log('Password updated')
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const toggle2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const securityStatus = {
    strongPassword: passwordForm.newPassword.length >= 8,
    twoFactor: twoFactorEnabled,
    recentLogin: true,
  }

  const securityScore = Object.values(securityStatus).filter(Boolean).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary mb-2">Security Settings</h1>
        <p className="text-muted">Manage your account security and privacy settings</p>
      </div>

      {/* Success Alert */}
      {showSuccess && (
        <Alert type="success" title="Settings Updated">
          Your security settings have been updated successfully.
        </Alert>
      )}

      {/* Security Status */}
      <Card>
        <div className="flex items-center space-x-3 mb-6">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            securityScore === 3 ? 'bg-success' : securityScore === 2 ? 'bg-yellow-500' : 'bg-danger'
          }`}>
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary">Account Security Status</h3>
            <p className="text-sm text-muted">
              {securityScore === 3 ? 'Your account is well protected 🔒' : 
               securityScore === 2 ? 'Your account security is good, but can be improved' :
               'Your account needs better security measures'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <CheckCircle size={20} className={securityStatus.strongPassword ? 'text-success' : 'text-gray-400'} />
            <div>
              <p className="text-sm font-medium text-primary">Strong Password</p>
              <p className="text-xs text-muted">8+ characters recommended</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Smartphone size={20} className={securityStatus.twoFactor ? 'text-success' : 'text-gray-400'} />
            <div>
              <p className="text-sm font-medium text-primary">Two-Factor Authentication</p>
              <p className="text-xs text-muted">Extra layer of security</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <CheckCircle size={20} className={securityStatus.recentLogin ? 'text-success' : 'text-gray-400'} />
            <div>
              <p className="text-sm font-medium text-primary">Recent Activity</p>
              <p className="text-xs text-muted">Last login: Today</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Change Password */}
      <Card>
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
            <Lock size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary">Change Password</h3>
            <p className="text-sm text-muted">Update your account password for better security</p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
          <div>
            <Input
              label="Current Password"
              type={showPasswords.current ? 'text' : 'password'}
              value={passwordForm.currentPassword}
              onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
              required
              rightElement={(
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              )}
            />
          </div>

          <div>
            <Input
              label="New Password"
              type={showPasswords.new ? 'text' : 'password'}
              value={passwordForm.newPassword}
              onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
              required
              minLength="8"
              rightElement={(
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              )}
            />
          </div>

          <div>
            <Input
              label="Confirm New Password"
              type={showPasswords.confirm ? 'text' : 'password'}
              value={passwordForm.confirmPassword}
              onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
              required
              minLength="8"
              rightElement={(
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              )}
            />
          </div>

          {/* Password Requirements */}
          <div className="text-sm text-muted">
            <p className="mb-1">Password requirements:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li className={passwordForm.newPassword.length >= 8 ? 'text-success' : ''}>
                At least 8 characters long
              </li>
              <li className={/[A-Z]/.test(passwordForm.newPassword) ? 'text-success' : ''}>
                Contains uppercase letter
              </li>
              <li className={/[a-z]/.test(passwordForm.newPassword) ? 'text-success' : ''}>
                Contains lowercase letter
              </li>
              <li className={/\d/.test(passwordForm.newPassword) ? 'text-success' : ''}>
                Contains number
              </li>
            </ul>
          </div>

          <Button type="submit" className="w-full">
            Update Password
          </Button>
        </form>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
            <Smartphone size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary">Two-Factor Authentication</h3>
            <p className="text-sm text-muted">Add an extra layer of security to your account</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              twoFactorEnabled ? 'bg-success' : 'bg-gray-400'
            }`}>
              {twoFactorEnabled ? (
                <CheckCircle size={16} className="text-white" />
              ) : (
                <AlertTriangle size={16} className="text-white" />
              )}
            </div>
            <div>
              <p className="font-medium text-primary">
                Two-Factor Authentication is {twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </p>
              <p className="text-sm text-muted">
                {twoFactorEnabled 
                  ? 'Your account is protected with 2FA'
                  : 'Enable 2FA for better security'
                }
              </p>
            </div>
          </div>
          
          <Button
            variant={twoFactorEnabled ? 'danger' : 'primary'}
            onClick={toggle2FA}
          >
            {twoFactorEnabled ? 'Disable' : 'Enable'}
          </Button>
        </div>

        {!twoFactorEnabled && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <Smartphone size={16} className="text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-800 mb-1">How it works:</p>
                <ul className="text-blue-700 space-y-1">
                  <li>1. Download an authenticator app (Google Authenticator, Authy)</li>
                  <li>2. Scan the QR code we provide</li>
                  <li>3. Enter the 6-digit code from your app</li>
                  <li>4. You'll need this code every time you log in</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Login Activity */}
      <Card>
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
            <Eye size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary">Recent Login Activity</h3>
            <p className="text-sm text-muted">Monitor your account access history</p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { location: 'Sandy, Utah', device: 'Chrome on Windows', time: '2 hours ago', current: true },
            { location: 'Sandy, Utah', device: 'iPhone Safari', time: 'Yesterday', current: false },
            { location: 'Salt Lake City, Utah', device: 'Chrome on Windows', time: '3 days ago', current: false },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${activity.current ? 'bg-green-500' : 'bg-gray-400'}`} />
                <div>
                  <p className="text-sm font-medium text-primary">
                    {activity.location}
                    {activity.current && <span className="text-success ml-2">(Current)</span>}
                  </p>
                  <p className="text-xs text-muted">{activity.device}</p>
                </div>
              </div>
              <span className="text-xs text-muted">{activity.time}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <Button variant="ghost" size="sm">
            View All Activity
          </Button>
        </div>
      </Card>

      {/* Account Actions */}
      <Card>
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle size={20} className="text-danger" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary">Account Actions</h3>
            <p className="text-sm text-muted">Manage your account data and access</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-primary">Export Account Data</p>
              <p className="text-sm text-muted">Download a copy of your trading history and settings</p>
            </div>
            <Button variant="outline">Export Data</Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
            <div>
              <p className="font-medium text-danger">Delete Account</p>
              <p className="text-sm text-red-600">Permanently delete your account and all data</p>
            </div>
            <Button variant="danger">Delete Account</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default SecurityPage