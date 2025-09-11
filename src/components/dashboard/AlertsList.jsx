import React from 'react'
import { Bell, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import Card from '../common/Card'
import Button from '../common/Button'
import Badge from '../common/Badge'
import { useSelector, useDispatch } from 'react-redux'
import { dismissAlert } from '../../store/slices/positionsSlice'
import { formatCurrency, calculateDTE } from '../../utils/formatters'

const AlertsList = () => {
  const dispatch = useDispatch()
  const { alerts } = useSelector(state => state.positions)

  // Mock alerts data
  const mockAlerts = [
    {
      id: 1,
      type: 'profit_target',
      symbol: 'AAPL',
      message: 'Position reached 50% profit target',
      action: 'Close',
      priority: 'high',
      timestamp: new Date(),
    },
    {
      id: 2,
      type: 'dte_warning',
      symbol: 'MSFT',
      message: 'Position expires in 5 days',
      action: 'Roll',
      priority: 'medium',
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: 3,
      type: 'earnings',
      symbol: 'GOOGL',
      message: 'Earnings announcement tomorrow',
      action: 'Review',
      priority: 'low',
      timestamp: new Date(Date.now() - 7200000),
    },
  ]

  const getAlertIcon = (type) => {
    switch (type) {
      case 'profit_target':
        return CheckCircle
      case 'dte_warning':
        return Clock
      case 'earnings':
        return AlertTriangle
      default:
        return Bell
    }
  }

  const getAlertColor = (priority) => {
    switch (priority) {
      case 'high': return 'danger'
      case 'medium': return 'warning'
      case 'low': return 'info'
      default: return 'default'
    }
  }

  const handleAlertAction = (alertId, action) => {
    // Handle alert actions (Close, Roll, Review)
    console.log(`${action} action for alert ${alertId}`)
    dispatch(dismissAlert(alertId))
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Bell size={20} className="text-accent" />
          <h3 className="text-lg font-semibold text-primary">Alerts</h3>
        </div>
        {mockAlerts.length > 0 && (
          <Badge variant="danger" size="sm">
            {mockAlerts.length}
          </Badge>
        )}
      </div>

      {mockAlerts.length === 0 ? (
        <div className="text-center py-8">
          <Bell size={48} className="text-gray-300 mx-auto mb-2" />
          <p className="text-muted">No alerts at the moment</p>
        </div>
      ) : (
        <div className="space-y-3">
          {mockAlerts.map((alert) => {
            const IconComponent = getAlertIcon(alert.type)
            return (
              <div key={alert.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <IconComponent size={16} className={`text-${getAlertColor(alert.priority)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-primary">{alert.symbol}</span>
                      <Badge variant={getAlertColor(alert.priority)} size="sm">
                        {alert.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted mb-2">{alert.message}</p>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleAlertAction(alert.id, alert.action)}
                      >
                        {alert.action}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => dispatch(dismissAlert(alert.id))}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}

export default AlertsList