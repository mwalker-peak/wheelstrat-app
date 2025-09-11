import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle, Bell, Calendar } from 'lucide-react'
import Card from '../components/common/Card'
import Badge from '../components/common/Badge'
import Button from '../components/common/Button'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { calculateTotals } from '../store/slices/positionsSlice'
import { formatCurrency, formatPercentage, formatDate, calculateDTE } from '../utils/formatters'
import ProfitChart from '../components/dashboard/ProfitChart'
import SectorAllocation from '../components/dashboard/SectorAllocation'
import RecentActivity from '../components/dashboard/RecentActivity'
import AlertsList from '../components/dashboard/AlertsList'
import NewsAndEarnings from '../components/dashboard/NewsAndEarnings'
import { useLocation } from 'react-router-dom';


const DashboardPage = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { profile } = useSelector(state => state.user)
  const { positions, totalPnL, totalRevenue, alerts } = useSelector(state => state.positions)
  const location = useLocation();

  useEffect(() => {
    dispatch(calculateTotals())
  }, [dispatch, positions])

  // Mock data for demonstration
  const openPositions = positions.filter(p => p.status === 'open').length
  const weeklyProjection = 485
  const annualProjection = totalRevenue * 26 // Rough weekly calculation

  const stats = [
    {
      title: 'Total P&L',
      value: formatCurrency(totalPnL),
      change: totalPnL >= 0 ? '+12.5%' : '-5.2%',
      isPositive: totalPnL >= 0,
      icon: totalPnL >= 0 ? TrendingUp : TrendingDown,
    },
    {
      title: 'Weekly Projection',
      value: formatCurrency(weeklyProjection),
      change: '+8.3%',
      isPositive: true,
      icon: DollarSign,
    },
    {
      title: 'Open Positions',
      value: openPositions.toString(),
      change: openPositions > 0 ? 'Active' : 'None',
      isPositive: openPositions > 0,
      icon: TrendingUp,
    },
    {
      title: 'Available Cash',
      value: formatCurrency(profile.investmentCapital - (totalRevenue * 100)), // Mock calculation
      change: 'Ready to invest',
      isPositive: true,
      icon: DollarSign,
    },
  ]

  if (!profile.setupCompleted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size={48} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary mb-2">
          Welcome back, {user?.name || 'Trader'}!
        </h1>
        <p className="text-muted">
          Here's your trading overview for today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                <p className={`text-sm font-medium ${
                  stat.isPositive ? 'text-success' : 'text-danger'
                }`}>
                  {stat.change}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${
                stat.isPositive ? 'bg-success/10' : 'bg-danger/10'
              }`}>
                <stat.icon size={24} className={
                  stat.isPositive ? 'text-success' : 'text-danger'
                } />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProfitChart />
        </div>
        <div>
          <SectorAllocation />
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div>
          <RecentActivity />
        </div>

        {/* Alerts */}
        <div>
          <AlertsList />
        </div>

        {/* News & Earnings */}
        <div>
          <NewsAndEarnings />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage