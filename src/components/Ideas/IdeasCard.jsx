import React from 'react'
import { TrendingUp, TrendingDown, DollarSign, Clock, Activity } from 'lucide-react'
import Card from '../common/Card'
import Button from '../common/Button'
import Badge from '../common/Badge'
import { formatCurrency, formatPercentage } from '../../utils/formatters'

const IdeaCard = ({ idea, onTakePosition, maxInvestment }) => {
  const {
    symbol,
    companyName,
    sector,
    currentPrice,
    strikePrice,
    premium,
    dte,
    delta,
    probability,
    ivRank,
    volume,
    openInterest,
    riskLevel,
    maxContracts,
    marketCap,
    peRatio,
    dividend,
    trend
  } = idea

  const requiredCapital = strikePrice * 100 // Per contract
  const maxPossibleContracts = Math.floor(maxInvestment / requiredCapital)
  const isAffordable = maxPossibleContracts >= 1

  const getRiskColor = (level) => {
    switch (level) {
      case 'low': return 'success'
      case 'medium': return 'warning'
      case 'high': return 'danger'
      default: return 'default'
    }
  }

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'bullish': return <TrendingUp size={16} className="text-success" />
      case 'bearish': return <TrendingDown size={16} className="text-danger" />
      case 'neutral': return <Activity size={16} className="text-muted" />
      case 'volatile': return <Activity size={16} className="text-warning" />
      case 'stable': return <Activity size={16} className="text-success" />
      default: return null
    }
  }

  return (
    <Card>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-xl font-bold text-primary">{symbol}</h3>
            {getTrendIcon(trend)}
          </div>
          <p className="text-sm text-muted">{companyName}</p>
        </div>
        <Badge variant={getRiskColor(riskLevel)}>{riskLevel.toUpperCase()}</Badge>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-muted mb-1">Strike Price</p>
          <p className="text-lg font-semibold text-primary">
            {formatCurrency(strikePrice)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted mb-1">Premium</p>
          <p className="text-lg font-semibold text-accent">
            {formatCurrency(premium)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted mb-1">Probability</p>
          <p className="text-lg font-semibold text-success">
            {formatPercentage(probability)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted mb-1">DTE</p>
          <div className="flex items-center">
            <Clock size={16} className="text-muted mr-1" />
            <span className="text-lg font-semibold text-primary">{dte}</span>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-2 gap-2 text-sm mb-4">
        <div className="flex items-center space-x-1">
          <span className="text-muted">Sector:</span>
          <span className="font-medium">{sector}</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-muted">IV Rank:</span>
          <span className="font-medium">{ivRank}%</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-muted">Volume:</span>
          <span className="font-medium">{volume.toLocaleString()}</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-muted">OI:</span>
          <span className="font-medium">{openInterest.toLocaleString()}</span>
        </div>
      </div>

      {/* Required Capital */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
        <div>
          <p className="text-sm text-muted">Required Capital</p>
          <p className="text-lg font-semibold text-primary">
            {formatCurrency(requiredCapital)}
            <span className="text-sm text-muted ml-1">per contract</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted">Max Contracts</p>
          <p className="text-lg font-semibold text-primary">{maxPossibleContracts}</p>
        </div>
      </div>

      {/* Action Button */}
      <Button
        variant="primary"
        className="w-full"
        onClick={() => onTakePosition(idea)}
        disabled={!isAffordable}
      >
        {isAffordable ? 'Take Position' : 'Insufficient Funds'}
      </Button>
    </Card>
  )
}

export default IdeaCard
