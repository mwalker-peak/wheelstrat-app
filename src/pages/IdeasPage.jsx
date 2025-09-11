import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Filter, RotateCcw, Grid, List, TrendingUp } from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Badge from '../components/common/Badge'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Select from '../components/common/Select'
import Input from '../components/common/Input'
import IdeaCard from '../components/Ideas/IdeasCard'
import IdeaTable from '../components/Ideas/IdeasTable'
import FiltersPanel from '../components/Ideas/FiltersPanel'
import { setIdeas, updateFilters, setLoading } from '../store/slices/ideasSlice'
import { addPosition } from '../store/slices/positionsSlice'
import { MARKET_SECTORS, DELTA_RANGES } from '../constants'
import { formatCurrency, formatPercentage } from '../utils/formatters'

const IdeasPage = () => {
  const [viewMode, setViewMode] = useState('cards') // 'cards' or 'table'
  const [showFilters, setShowFilters] = useState(false)

  const dispatch = useDispatch()
  const { profile } = useSelector(state => state.user)
  const { ideas: ideas, filters, loading, error } = useSelector(state => state.ideas)

  // Generate mock ideas based on user profile
  useEffect(() => {
    generateIdeas()
  }, [profile, filters])

  const generateIdeas = async () => {
    dispatch(setLoading(true))

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))

  // Mock ideas data
    const mockIdeas = [
      {
        id: 1,
        symbol: 'AAPL',
        companyName: 'Apple Inc.',
        sector: 'Technology',
        currentPrice: 225.50,
        strikePrice: 220,
        premium: 2.85,
        dte: 32,
        delta: 0.22,
        probability: 0.78,
        ivRank: 35,
        volume: 15420,
        openInterest: 8950,
        riskLevel: 'low',
        maxContracts: Math.floor(profile.investmentCapital / 22000),
        marketCap: '3.2T',
        peRatio: 28.5,
        dividend: 0.24,
        trend: 'bullish'
      },
      {
        id: 2,
        symbol: 'MSFT',
        companyName: 'Microsoft Corporation',
        sector: 'Technology',
        currentPrice: 378.20,
        strikePrice: 370,
        premium: 4.20,
        dte: 28,
        delta: 0.28,
        probability: 0.72,
        ivRank: 42,
        volume: 12850,
        openInterest: 6240,
        riskLevel: 'medium',
        maxContracts: Math.floor(profile.investmentCapital / 37000),
        marketCap: '2.8T',
        peRatio: 32.1,
        dividend: 0.68,
        trend: 'bullish'
      },
      {
        id: 3,
        symbol: 'GOOGL',
        companyName: 'Alphabet Inc.',
        sector: 'Communication Services',
        currentPrice: 165.80,
        strikePrice: 160,
        premium: 3.15,
        dte: 35,
        delta: 0.25,
        probability: 0.75,
        ivRank: 38,
        volume: 9650,
        openInterest: 4820,
        riskLevel: 'low',
        maxContracts: Math.floor(profile.investmentCapital / 16000),
        marketCap: '2.1T',
        peRatio: 25.8,
        dividend: 0.00,
        trend: 'neutral'
      },
      {
        id: 4,
        symbol: 'TSLA',
        companyName: 'Tesla, Inc.',
        sector: 'Consumer Discretionary',
        currentPrice: 248.90,
        strikePrice: 240,
        premium: 5.80,
        dte: 25,
        delta: 0.38,
        probability: 0.62,
        ivRank: 68,
        volume: 22100,
        openInterest: 12400,
        riskLevel: 'high',
        maxContracts: Math.floor(profile.investmentCapital / 24000),
        marketCap: '850B',
        peRatio: 58.2,
        dividend: 0.00,
        trend: 'volatile'
      },
      {
        id: 5,
        symbol: 'JNJ',
        companyName: 'Johnson & Johnson',
        sector: 'Healthcare',
        currentPrice: 162.40,
        strikePrice: 160,
        premium: 1.95,
        dte: 42,
        delta: 0.18,
        probability: 0.82,
        ivRank: 28,
        volume: 4280,
        openInterest: 8960,
        riskLevel: 'low',
        maxContracts: Math.floor(profile.investmentCapital / 16000),
        marketCap: '425B',
        peRatio: 15.2,
        dividend: 1.13,
        trend: 'stable'
      }
    ]

  // Filter ideas based on user preferences
  let filteredIdeas = mockIdeas.filter(rec => {
      // Filter by DTE
      if (rec.dte < filters.minDTE || rec.dte > filters.maxDTE) return false
      
      // Filter by sectors if specified
      if (filters.sectors.length > 0 && !filters.sectors.includes(rec.sector)) return false
      
      // Filter by probability
      if (rec.probability < filters.minProbability) return false
      
      // Filter by risk level based on user profile
      const userDeltaRange = DELTA_RANGES[profile.riskTolerance]
      if (rec.delta < userDeltaRange.min || rec.delta > userDeltaRange.max) return false
      
      return true
    })

    // Sort by probability descending
    filteredIdeas.sort((a, b) => b.probability - a.probability)

  dispatch(setIdeas(filteredIdeas))
    dispatch(setLoading(false))
  }

  const handleTakePosition = (ideas) => {
    const position = {
      symbol: ideas.symbol,
      companyName: ideas.companyName,
      sector: ideas.sector,
      strikePrice: ideas.strikePrice,
      premium: ideas.premium,
      dte: ideas.dte,
      delta: ideas.delta,
      probability: ideas.probability,
      contracts: 1, // Default to 1 contract
      type: 'cash_secured_put',
      currentPnL: 0,
    }

    dispatch(addPosition(position))
    
    // Show success message or redirect
    alert(`Position opened: ${ideas.symbol} $${ideas.strikePrice} Put`)
  }

  const resetFilters = () => {
    dispatch(updateFilters({
      minDTE: 15,
      maxDTE: 45,
      sectors: [],
      minProbability: 0.5,
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary mb-2">
            Options Ideas
          </h1>
          <p className="text-muted">
            Personalized cash-secured put opportunities based on your profile
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'cards' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('cards')}
              className="px-3"
            >
              <Grid size={16} />
            </Button>
            <Button
              variant={viewMode === 'table' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="px-3"
            >
              <List size={16} />
            </Button>
          </div>

          {/* Filters Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2"
          >
            <Filter size={16} />
            <span>Filters</span>
            {(filters.sectors.length > 0 || filters.minProbability > 0.5) && (
              <Badge variant="accent" size="sm">
                Active
              </Badge>
            )}
          </Button>

          {/* Refresh Button */}
          <Button
            variant="outline"
            onClick={generateIdeas}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <RotateCcw size={16} className={loading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <FiltersPanel
          filters={filters}
          onUpdateFilters={(newFilters) => dispatch(updateFilters(newFilters))}
          onResetFilters={resetFilters}
        />
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{ideas.length}</div>
            <div className="text-sm text-muted">Available</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-success">
              {ideas.length > 0 
                ? formatPercentage(ideas.reduce((sum, r) => sum + r.probability, 0) / ideas.length)
                : '0%'
              }
            </div>
            <div className="text-sm text-muted">Avg Success</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">
              {ideas.length > 0 
                ? formatCurrency(ideas.reduce((sum, r) => sum + r.premium, 0) / ideas.length)
                : '$0'
              }
            </div>
            <div className="text-sm text-muted">Avg Premium</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(profile.investmentCapital)}
            </div>
            <div className="text-sm text-muted">Available</div>
          </div>
        </Card>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size={48} />
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="p-8 text-center">
          <div className="text-danger mb-4">⚠️ Error loading ideas</div>
          <p className="text-muted mb-4">{error}</p>
          <Button onClick={generateIdeas}>Try Again</Button>
        </Card>
      )}

      {/* Ideas Display */}
      {!loading && !error && (
        <>
          {ideas.length === 0 ? (
            <Card className="p-8 text-center">
              <TrendingUp size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-primary mb-2">
                No ideas found
              </h3>
                <p className="text-muted mb-4">
                Try adjusting your filters or risk tolerance to see more options.
              </p>
              <Button variant="outline" onClick={resetFilters}>
                Reset Filters
              </Button>
            </Card>
          ) : (
            <>
              {viewMode === 'cards' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ideas.map((idea) => (
                    <IdeaCard
                      key={idea.id}
                      idea={idea}
                      onTakePosition={handleTakePosition}
                      maxInvestment={profile.investmentCapital}
                    />
                  ))}
                </div>
              ) : (
                <IdeaTable
                  ideas={ideas}
                  onTakePosition={handleTakePosition}
                  maxInvestment={profile.investmentCapital}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}

export default IdeasPage