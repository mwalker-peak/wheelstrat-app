import React from 'react'
import { PieChart } from 'lucide-react'
import Card from '../common/Card'
import { useSelector } from 'react-redux'

const SectorAllocation = () => {
  const { positions } = useSelector(state => state.positions)

  // Mock sector data
  const sectorData = [
    { name: 'Technology', value: 35, color: 'bg-blue-500' },
    { name: 'Healthcare', value: 25, color: 'bg-green-500' },
    { name: 'Financial', value: 20, color: 'bg-yellow-500' },
    { name: 'Energy', value: 15, color: 'bg-red-500' },
    { name: 'Other', value: 5, color: 'bg-gray-500' },
  ]

  return (
    <Card>
      <div className="flex items-center space-x-2 mb-4">
        <PieChart size={20} className="text-accent" />
        <h3 className="text-lg font-semibold text-primary">Sector Allocation</h3>
      </div>

      {/* Simple Pie Chart Representation */}
      <div className="space-y-3">
        {sectorData.map((sector, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${sector.color}`} />
              <span className="text-sm text-primary">{sector.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-20 h-2 bg-gray-200 rounded-full">
                <div
                  className={`h-2 rounded-full ${sector.color}`}
                  style={{ width: `${sector.value}%` }}
                />
              </div>
              <span className="text-sm text-muted min-w-[30px]">{sector.value}%</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default SectorAllocation