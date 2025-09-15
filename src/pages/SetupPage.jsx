import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, ChevronLeft, DollarSign, Target, Shield } from 'lucide-react'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Card from '../components/common/Card'
import Alert from '../components/common/Alert'
import { completeUserSetup } from '../store/slices/userSlice'
import { ROUTES, MARKET_SECTORS, RISK_LEVELS } from '../constants'
import { formatCurrency } from '../utils/formatters'

const SetupPage = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    investmentCapital: 20000,
    riskTolerance: RISK_LEVELS.LOW,
    favoriteMarketSectors: []
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)
  const { loading, error } = useSelector(state => state.user)

  const steps = [
    {
      title: 'Investment Capital',
      subtitle: 'How much would you like to allocate for options trading?',
      icon: DollarSign,
      component: CapitalStep
    },
    {
      title: 'Risk Tolerance',
      subtitle: 'What level of risk are you comfortable with?',
      icon: Shield,
      component: RiskStep
    },
    {
      title: 'Market Sectors',
      subtitle: 'Which market sectors interest you most?',
      icon: Target,
      component: SectorsStep
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    if (!user) {
      console.error('❌ No user found for setup completion')
      return
    }

    try {
      console.log('💾 Saving user setup to Firebase:', formData)
      
      await dispatch(completeUserSetup({
        userId: user.uid,
        profileData: {
          profile: formData
        }
      })).unwrap()
      
      console.log('✅ User setup completed successfully')
      navigate(ROUTES.DASHBOARD)
    } catch (error) {
      console.error('❌ Error completing setup:', error)
      // Error is handled by Redux and displayed in the UI
    }
  }

  const updateFormData = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const CurrentStepComponent = steps[currentStep].component
  const StepIcon = steps[currentStep].icon

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">Investment Profile Setup</h1>
              <p className="text-sm text-muted">Step {currentStep + 1} of {steps.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Error Message */}
        {error && (
          <Alert type="error" className="mb-6">
            Error saving your profile: {error}
          </Alert>
        )}

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  index <= currentStep
                    ? 'bg-accent text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-accent h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-4">
              <StepIcon size={32} className="text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-muted">
              {steps[currentStep].subtitle}
            </p>
          </div>

          <CurrentStepComponent
            formData={formData}
            updateFormData={updateFormData}
          />
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0 || loading}
            className="flex items-center"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            loading={loading && currentStep === steps.length - 1}
            disabled={loading}
            className="flex items-center"
          >
            {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
            {currentStep < steps.length - 1 && <ChevronRight size={16} className="ml-1" />}
          </Button>
        </div>
      </div>
    </div>
  )
}

// Step Components (same as before, but cleaner)
function CapitalStep({ formData, updateFormData }) {
  const [customAmount, setCustomAmount] = useState('')

  const presetAmounts = [10000, 20000, 50000, 100000]

  const handlePresetClick = (amount) => {
    updateFormData({ investmentCapital: amount })
    setCustomAmount('')
  }

  const handleCustomChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, '')
    setCustomAmount(value)
    if (value) {
      updateFormData({ investmentCapital: parseInt(value) })
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        {presetAmounts.map(amount => (
          <Button
            key={amount}
            variant={formData.investmentCapital === amount ? 'primary' : 'outline'}
            onClick={() => handlePresetClick(amount)}
            className="h-16 text-lg"
          >
            {formatCurrency(amount)}
          </Button>
        ))}
      </div>

      <div className="relative">
        <Input
          label="Custom Amount"
          value={customAmount}
          onChange={handleCustomChange}
          placeholder="Enter custom amount"
          className="text-lg text-center"
        />
      </div>

      <div className="text-center p-4 bg-accent/5 rounded-lg">
        <p className="text-sm text-muted">
          Current Selection: <span className="font-semibold text-primary">
            {formatCurrency(formData.investmentCapital)}
          </span>
        </p>
      </div>
    </div>
  )
}

function RiskStep({ formData, updateFormData }) {
  const riskOptions = [
    {
      value: RISK_LEVELS.LOW,
      label: 'Conservative',
      description: 'Lower risk, steady returns. Delta 0.15-0.25',
      features: ['Large cap companies', 'Stable dividends', 'Lower volatility']
    },
    {
      value: RISK_LEVELS.MEDIUM,
      label: 'Balanced',
      description: 'Moderate risk for better returns. Delta 0.26-0.35',
      features: ['Mix of large and mid cap', 'Growth potential', 'Balanced approach']
    },
    {
      value: RISK_LEVELS.HIGH,
      label: 'Aggressive',
      description: 'Higher risk, higher potential returns. Delta 0.36+',
      features: ['All cap sizes', 'Growth stocks', 'Higher volatility']
    }
  ]

  return (
    <div className="space-y-4">
      {riskOptions.map(option => (
        <div
          key={option.value}
          onClick={() => updateFormData({ riskTolerance: option.value })}
          className={`
            p-4 border-2 rounded-lg cursor-pointer transition-all
            ${formData.riskTolerance === option.value
              ? 'border-accent bg-accent/5'
              : 'border-gray-200 hover:border-gray-300'
            }
          `}
        >
          <div className="flex items-start space-x-3">
            <div className={`
              w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center
              ${formData.riskTolerance === option.value
                ? 'border-accent bg-accent'
                : 'border-gray-300'
              }
            `}>
              {formData.riskTolerance === option.value && (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary">{option.label}</h3>
              <p className="text-sm text-muted mb-2">{option.description}</p>
              <ul className="text-xs text-muted space-y-1">
                {option.features.map((feature, index) => (
                  <li key={index}>• {feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function SectorsStep({ formData, updateFormData }) {
  const toggleSector = (sector) => {
    const currentSectors = formData.favoriteMarketSectors
    const newSectors = currentSectors.includes(sector)
      ? currentSectors.filter(s => s !== sector)
      : [...currentSectors, sector]
    
    updateFormData({ favoriteMarketSectors: newSectors })
  }

  const selectAll = () => {
    updateFormData({ favoriteMarketSectors: [...MARKET_SECTORS] })
  }

  const clearAll = () => {
    updateFormData({ favoriteMarketSectors: [] })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted">
          Select the sectors you're interested in (optional)
        </p>
        <div className="space-x-2">
          <Button variant="ghost" size="sm" onClick={selectAll}>
            Select All
          </Button>
          <Button variant="ghost" size="sm" onClick={clearAll}>
            Clear
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {MARKET_SECTORS.map(sector => (
          <Button
            key={sector}
            variant={formData.favoriteMarketSectors.includes(sector) ? 'primary' : 'outline'}
            onClick={() => toggleSector(sector)}
            size="sm"
            className="h-12 text-sm"
          >
            {sector}
          </Button>
        ))}
      </div>

      <div className="text-center p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-muted">
          {formData.favoriteMarketSectors.length === 0 
            ? 'No sectors selected - we\'ll show all sectors' 
            : `${formData.favoriteMarketSectors.length} sector${formData.favoriteMarketSectors.length === 1 ? '' : 's'} selected`
          }
        </p>
      </div>
    </div>
  )
}

export default SetupPage