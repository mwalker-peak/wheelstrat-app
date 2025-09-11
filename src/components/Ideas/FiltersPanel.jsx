import React from 'react'
import { X } from 'lucide-react'
import Card from '../common/Card'
import Button from '../common/Button'
import Input from '../common/Input'
import Select from '../common/Select'
import { MARKET_SECTORS } from '../../constants'

const FiltersPanel = ({ filters, onUpdateFilters, onResetFilters }) => {
  const handleSectorToggle = (sector) => {
    const newSectors = filters.sectors.includes(sector)
      ? filters.sectors.filter(s => s !== sector)
      : [...filters.sectors, sector]
    
    onUpdateFilters({ sectors: newSectors })
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-primary">Filters</h3>
        <Button variant="ghost" size="sm" onClick={onResetFilters}>
          Reset All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Input
          label="Min DTE"
          type="number"
          value={filters.minDTE}
          onChange={(e) => onUpdateFilters({ minDTE: parseInt(e.target.value) || 0 })}
          min="1"
          max="365"
        />
        <Input
          label="Max DTE"
          type="number"
          value={filters.maxDTE}
          onChange={(e) => onUpdateFilters({ maxDTE: parseInt(e.target.value) || 365 })}
          min="1"
          max="365"
        />
        <Input
          label="Min Success Rate"
          type="number"
          value={Math.round(filters.minProbability * 100)}
          onChange={(e) => onUpdateFilters({ minProbability: (parseInt(e.target.value) || 0) / 100 })}
          min="0"
          max="100"
          placeholder="0-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Market Sectors
        </label>
        <div className="flex flex-wrap gap-2">
          {MARKET_SECTORS.map(sector => (
            <Button
              key={sector}
              variant={filters.sectors.includes(sector) ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleSectorToggle(sector)}
            >
              {sector}
              {filters.sectors.includes(sector) && (
                <X size={12} className="ml-1" />
              )}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  )
}

export default FiltersPanel