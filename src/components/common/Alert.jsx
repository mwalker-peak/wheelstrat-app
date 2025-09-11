import React from 'react'
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

const Alert = ({ 
  type = 'info', 
  title, 
  children, 
  onClose, 
  className = '' 
}) => {
  const types = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: Info,
      iconColor: 'text-blue-600',
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: CheckCircle,
      iconColor: 'text-green-600',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: AlertTriangle,
      iconColor: 'text-yellow-600',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: AlertCircle,
      iconColor: 'text-red-600',
    },
  }

  const config = types[type]
  const IconComponent = config.icon

  return (
    <div className={`
      ${config.bg} ${config.border} ${config.text} border rounded-lg p-4
      ${className}
    `}>
      <div className="flex">
        <IconComponent size={20} className={`${config.iconColor} mt-0.5 mr-3 flex-shrink-0`} />
        <div className="flex-1">
          {title && (
            <h3 className="text-sm font-medium mb-1">{title}</h3>
          )}
          {children && (
            <div className="text-sm">{children}</div>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`${config.iconColor} hover:opacity-75 ml-3 flex-shrink-0`}
          >
            <X size={20} />
          </button>
        )}
      </div>
    </div>
  )
}

export default Alert