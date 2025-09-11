import React from 'react'

const Input = ({ 
  label, 
  error, 
  className = '', 
  required = false,
  rightElement = null,
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
        <input
          className={`
            w-full px-3 py-2 border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-accent/20 focus:border-accent
            disabled:bg-gray-50 disabled:cursor-not-allowed
            min-h-[44px] text-base
            ${error ? 'border-danger focus:border-danger focus:ring-danger/20' : ''}
            ${className}
          `}
          {...props}
        />

        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-danger">{error}</p>
      )}
    </div>
  )
}

export default Input