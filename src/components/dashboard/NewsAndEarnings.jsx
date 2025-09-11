import React from 'react'
import { Calendar, ExternalLink } from 'lucide-react'
import Card from '../common/Card'
import Badge from '../common/Badge'
import { formatDate } from '../../utils/formatters'

const NewsAndEarnings = () => {
  // Mock news and earnings data
  const upcomingEarnings = [
    {
      symbol: 'AAPL',
      company: 'Apple Inc.',
      date: new Date(Date.now() + 86400000), // Tomorrow
      time: 'After Market Close',
    },
    {
      symbol: 'MSFT',
      company: 'Microsoft Corp.',
      date: new Date(Date.now() + 172800000), // Day after tomorrow
      time: 'After Market Close',
    },
    {
      symbol: 'GOOGL',
      company: 'Alphabet Inc.',
      date: new Date(Date.now() + 259200000), // In 3 days
      time: 'After Market Close',
    },
  ]

  const relevantNews = [
    {
      id: 1,
      headline: 'Tech Stocks Rally on Strong GDP Data',
      source: 'MarketWatch',
      time: '2 hours ago',
      url: '#',
    },
    {
      id: 2,
      headline: 'Options Volume Surges Ahead of Earnings',
      source: 'Bloomberg',
      time: '4 hours ago',
      url: '#',
    },
    {
      id: 3,
      headline: 'Federal Reserve Signals Rate Stability',
      source: 'Reuters',
      time: '6 hours ago',
      url: '#',
    },
  ]

  return (
    <Card>
      <div className="flex items-center space-x-2 mb-4">
        <Calendar size={20} className="text-accent" />
        <h3 className="text-lg font-semibold text-primary">News & Earnings</h3>
      </div>

      {/* Upcoming Earnings */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-primary mb-3">Upcoming Earnings</h4>
        <div className="space-y-2">
          {upcomingEarnings.map((earning) => (
            <div key={earning.symbol} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-primary">{earning.symbol}</span>
                  <Badge variant="info" size="sm">
                    {formatDate(earning.date)}
                  </Badge>
                </div>
                <p className="text-xs text-muted">{earning.company}</p>
              </div>
              <span className="text-xs text-muted">{earning.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Relevant News */}
      <div>
        <h4 className="text-sm font-medium text-primary mb-3">Market News</h4>
        <div className="space-y-3">
          {relevantNews.map((news) => (
            <div key={news.id} className="space-y-1">
              <a
                href={news.url}
                className="block text-sm text-primary hover:text-accent transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-start justify-between">
                  <span className="flex-1">{news.headline}</span>
                  <ExternalLink size={12} className="ml-1 mt-0.5 flex-shrink-0" />
                </div>
              </a>
              <div className="flex items-center justify-between text-xs text-muted">
                <span>{news.source}</span>
                <span>{news.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

export default NewsAndEarnings