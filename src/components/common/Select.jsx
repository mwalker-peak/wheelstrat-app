import React from 'react'
import { ChevronDown } from 'lucide-react'

const Select = ({ 
  label, 
  error, 
  options = [], 
  className = '', 
  required = false,
  ...props 
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          className={`
            w-full px-3 py-2 border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-accent/20 focus:border-accent
            disabled:bg-gray-50 disabled:cursor-not-allowed
            min-h-[44px] text-base appearance-none bg-white
            ${error ? 'border-danger focus:border-danger focus:ring-danger/20' : ''}
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown 
          size={20} 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </div>
      {error && (
        <p className="text-sm text-danger">{error}</p>
      )}
    </div>
  )
}

export default Select