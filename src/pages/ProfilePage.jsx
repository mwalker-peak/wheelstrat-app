import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { User, DollarSign, Target, Shield, Edit3, Save, X } from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Select from '../components/common/Select'
import Badge from '../components/common/Badge'
import { updateProfile } from '../store/slices/userSlice'
import { MARKET_SECTORS, RISK_LEVELS } from '../constants'
import { formatCurrency } from '../utils/formatters'

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({})
  
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { profile } = useSelector(state => state.user)

  // Initialize form data when profile loads
  React.useEffect(() => {
    if (profile) {
      setFormData(profile)
    }
  }, [profile])

  const handleEdit = () => {
    setFormData(current => ({
      ...current,
      name: user?.displayName || profile?.name || '',
      ...profile
    }))
    setIsEditing(true)
  }

  const handleCancel = () => {
    setFormData(profile || {})
    setIsEditing(false)
  }

  const handleSave = () => {
    dispatch(updateProfile(formData))
    setIsEditing(false)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleSector = (sector) => {
    const currentSectors = formData.favoriteMarketSectors || []
    const newSectors = currentSectors.includes(sector)
      ? currentSectors.filter(s => s !== sector)
      : [...currentSectors, sector]
    
    handleChange('favoriteMarketSectors', newSectors)
  }

  const riskLevelOptions = [
    { value: RISK_LEVELS.LOW, label: 'Conservative (Low Risk)' },
    { value: RISK_LEVELS.MEDIUM, label: 'Balanced (Medium Risk)' },
    { value: RISK_LEVELS.HIGH, label: 'Aggressive (High Risk)' },
  ]

  const billingPlans = [
    {
      name: 'Basic',
      price: 'Free',
  features: ['5 ideas per week', 'Basic alerts', 'Email support'],
      current: true
    },
    {
      name: 'Pro',
      price: '$29/month',
  features: ['Unlimited ideas', 'Real-time alerts', 'Priority support', 'Advanced analytics'],
      current: false
    },
    {
      name: 'Premium',
      price: '$59/month',
      features: ['Everything in Pro', 'Custom screening', 'API access', 'Phone support'],
      current: false
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary mb-2">Profile Settings</h1>
          <p className="text-muted">Manage your investment preferences and account settings</p>
        </div>
        
        {!isEditing ? (
          <Button onClick={handleEdit} className="flex items-center space-x-2">
            <Edit3 size={16} />
            Edit Profile
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleCancel} className="flex items-center space-x-2">
              <X size={16} />
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex items-center space-x-2">
              <Save size={16} />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Account Information */}
      <Card>
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
            <User size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary">Account Information</h3>
            <p className="text-sm text-muted">Your basic account details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            {isEditing ? (
              <Input
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter your name"
              />
            ) : (
              <p className="text-primary font-medium">
                {user?.displayName || profile?.name || 'Not provided'}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <p className="text-primary font-medium">{user?.email || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
            <Badge variant="info">Paper Trading Account</Badge>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
            <p className="text-primary font-medium">September 2025</p>
          </div>
        </div>
      </Card>

      {/* Investment Profile */}
      <Card>
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
            <DollarSign size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary">Investment Profile</h3>
            <p className="text-sm text-muted">Your trading preferences and capital allocation</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Investment Capital */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Investment Capital</label>
            {isEditing ? (
              <Input
                type="number"
                value={formData.investmentCapital || ''}
                onChange={(e) => handleChange('investmentCapital', parseInt(e.target.value) || 0)}
                placeholder="Enter investment amount"
                min="1000"
                step="1000"
              />
            ) : (
              <p className="text-2xl font-bold text-primary">{formatCurrency(profile.investmentCapital)}</p>
            )}
          </div>

          {/* Risk Tolerance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Risk Tolerance</label>
            {isEditing ? (
              <Select
                value={formData.riskTolerance || ''}
                onChange={(e) => handleChange('riskTolerance', e.target.value)}
                options={riskLevelOptions}
              />
            ) : (
              <div className="flex items-center space-x-2">
                <Badge variant={profile.riskTolerance}>{profile.riskTolerance?.toUpperCase()}</Badge>
                <span className="text-sm text-muted">
                  {riskLevelOptions.find(opt => opt.value === profile.riskTolerance)?.label}
                </span>
              </div>
            )}
          </div>

          {/* Favorite Market Sectors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Favorite Market Sectors</label>
            {isEditing ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {MARKET_SECTORS.map(sector => (
                  <Button
                    key={sector}
                    variant={(formData.favoriteMarketSectors || []).includes(sector) ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => toggleSector(sector)}
                    className="text-xs"
                  >
                    {sector}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.favoriteMarketSectors?.length > 0 ? (
                  profile.favoriteMarketSectors.map(sector => (
                    <Badge key={sector} variant="default">{sector}</Badge>
                  ))
                ) : (
                  <span className="text-muted">All sectors</span>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Billing Plan */}
      <Card>
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
            <Target size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary">Billing Plan</h3>
            <p className="text-sm text-muted">Choose the plan that fits your trading needs</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {billingPlans.map((plan, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${
                plan.current 
                  ? 'border-accent bg-accent/5' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center mb-4">
                <h4 className="text-lg font-semibold text-primary">{plan.name}</h4>
                <p className="text-2xl font-bold text-accent">{plan.price}</p>
              </div>
              
              <ul className="space-y-2 mb-4">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="text-sm text-muted flex items-center">
                    <span className="w-2 h-2 bg-accent rounded-full mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.current ? 'outline' : 'primary'}
                className="w-full"
                disabled={plan.current}
              >
                {plan.current ? 'Current Plan' : 'Upgrade'}
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default ProfilePage