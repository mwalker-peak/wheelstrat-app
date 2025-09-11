import React, { useState } from 'react'
import { BarChart3 } from 'lucide-react'
import Card from '../common/Card'
import Button from '../common/Button'

const ProfitChart = () => {
  const [timeframe, setTimeframe] = useState('7d')

  // Mock chart data
  const chartData = {
    '7d': [
      { date: 'Mon', profit: 150 },
      { date: 'Tue', profit: 230 },
      { date: 'Wed', profit: -80 },
      { date: 'Thu', profit: 340 },
      { date: 'Fri', profit: 180 },
      { date: 'Sat', profit: 290 },
      { date: 'Sun', profit: 210 },
    ],
    '30d': [
      { date: 'Week 1', profit: 1200 },
      { date: 'Week 2', profit: 980 },
      { date: 'Week 3', profit: 1450 },
      { date: 'Week 4', profit: 1100 },
    ],
    '90d': [
      { date: 'Month 1', profit: 4200 },
      { date: 'Month 2', profit: 3800 },
      { date: 'Month 3', profit: 5100 },
    ],
  }

  const data = chartData[timeframe]
  const maxValue = Math.max(...data.map(d => Math.abs(d.profit)))

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <BarChart3 size={20} className="text-accent" />
          <h3 className="text-lg font-semibold text-primary">Profit Over Time</h3>
        </div>
        <div className="flex space-x-1">
          {[
            { key: '7d', label: '7D' },
            { key: '30d', label: '30D' },
            { key: '90d', label: '90D' },
          ].map(option => (
            <Button
              key={option.key}
              variant={timeframe === option.key ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setTimeframe(option.key)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Simple Bar Chart */}
      <div className="h-64 flex items-end justify-between space-x-2">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="w-full flex items-end justify-center mb-2" style={{ height: '200px' }}>
              <div
                className={`w-full max-w-12 rounded-t ${
                  item.profit >= 0 ? 'bg-success' : 'bg-danger'
                }`}
                style={{
                  height: `${(Math.abs(item.profit) / maxValue) * 180}px`,
                  minHeight: '4px',
                }}
              />
            </div>
            <span className="text-xs text-muted text-center">{item.date}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default ProfitChart