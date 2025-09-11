import React from 'react'
import { Clock, TrendingUp, TrendingDown } from 'lucide-react'
import Card from '../common/Card'
import Badge from '../common/Badge'
import Button from '../common/Button'
import { useSelector } from 'react-redux'
import { formatCurrency, formatDate } from '../../utils/formatters'

const RecentActivity = () => {
  const { positions } = useSelector(state => state.positions)

  // Mock recent activities
  const recentActivities = [
    {
      id: 1,
      type: 'open',
      symbol: 'AAPL',
      strike: 225,
      premium: 2.50,
      date: new Date(Date.now() - 86400000), // Yesterday
      status: 'success'
    },
    {
      id: 2,
      type: 'close',
      symbol: 'MSFT',
      strike: 380,
      premium: 1.80,
      date: new Date(Date.now() - 172800000), // 2 days ago
      status: 'success'
    },
    {
      id: 3,
      type: 'roll',
      symbol: 'GOOGL',
      strike: 165,
      premium: 3.20,
      date: new Date(Date.now() - 259200000), // 3 days ago
      status: 'warning'
    },
    {
      id: 4,
      type: 'assigned',
      symbol: 'TSLA',
      strike: 250,
      premium: 4.50,
      date: new Date(Date.now() - 345600000), // 4 days ago
      status: 'info'
    },
  ]

  const getActivityIcon = (type) => {
    switch (type) {
      case 'open':
      case 'close':
        return TrendingUp
      case 'roll':
      case 'assigned':
        return TrendingDown
      default:
        return Clock
    }
  }

  const getActivityColor = (status) => {
    switch (status) {
      case 'success': return 'success'
      case 'warning': return 'warning'
      case 'info': return 'info'
      default: return 'default'
    }
  }

  return (
    <Card>
      <div className="flex items-center space-x-2 mb-4">
        <Clock size={20} className="text-accent" />
        <h3 className="text-lg font-semibold text-primary">Recent Activity</h3>
      </div>

      <div className="space-y-3">
        {recentActivities.map((activity) => {
          const IconComponent = getActivityIcon(activity.type)
          return (
            <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <IconComponent size={16} className="text-muted" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-primary">{activity.symbol}</span>
                  <Badge variant={getActivityColor(activity.status)} size="sm">
                    {activity.type.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-muted">
                  Strike: ${activity.strike} • Premium: {formatCurrency(activity.premium)}
                </p>
                <p className="text-xs text-muted">{formatDate(activity.date)}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 text-center">
        <Button variant="ghost" size="sm">
          View All Activity
        </Button>
      </div>
    </Card>
  )
}

export default RecentActivity