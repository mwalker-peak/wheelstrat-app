import React from 'react'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'
import Button from '../common/Button'
import Badge from '../common/Badge'
import { formatCurrency, formatPercentage } from '../../utils/formatters'

const IdeaTable = ({ ideas, onTakePosition, maxInvestment }) => {
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
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Strike</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Premium</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DTE</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prob.</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {ideas.map((rec) => {
            const requiredCapital = rec.strikePrice * 100
            const maxPossibleContracts = Math.floor(maxInvestment / requiredCapital)
            const isAffordable = maxPossibleContracts >= 1

            return (
              <tr key={rec.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium text-primary">{rec.symbol}</span>
                        <span className="ml-2">{getTrendIcon(rec.trend)}</span>
                      </div>
                      <div className="text-xs text-muted">{rec.sector}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="font-medium">{formatCurrency(rec.strikePrice)}</span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="font-medium text-accent">{formatCurrency(rec.premium)}</span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="font-medium">{rec.dte}</span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="font-medium text-success">{formatPercentage(rec.probability)}</span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="font-medium">{rec.volume.toLocaleString()}</span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <Badge variant={getRiskColor(rec.riskLevel)}>{rec.riskLevel.toUpperCase()}</Badge>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div>
                    <div className="font-medium">{formatCurrency(requiredCapital)}</div>
                    <div className="text-xs text-muted">Max: {maxPossibleContracts}</div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onTakePosition(rec)}
                    disabled={!isAffordable}
                  >
                    {isAffordable ? 'Take Position' : 'Insufficient'}
                  </Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default IdeaTable
