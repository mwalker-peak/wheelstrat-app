import React from 'react'
import { Loader2 } from 'lucide-react'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false, 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-accent text-white hover:bg-accent/90 focus:ring-2 focus:ring-accent/20',
    secondary: 'bg-white text-primary border border-primary hover:bg-primary/5 focus:ring-2 focus:ring-primary/20',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray/20',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-gray/20',
    danger: 'bg-danger text-white hover:bg-danger/90 focus:ring-2 focus:ring-danger/20',
  }
  
  const sizes = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-4 py-2 text-sm min-h-[44px]',
    lg: 'px-6 py-3 text-base min-h-[48px]',
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`
  
  return (
    <button 
      className={classes} 
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={16} className="mr-2 animate-spin" />}
      {children}
    </button>
  )
}

export default Button