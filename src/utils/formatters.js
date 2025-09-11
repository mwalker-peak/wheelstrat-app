export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export const formatPercentage = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value)
}

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export const calculateDTE = (expirationDate) => {
  const now = new Date()
  const expiry = new Date(expirationDate)
  const diffTime = expiry - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export const getRiskColor = (riskLevel) => {
  switch (riskLevel) {
    case RISK_LEVELS.LOW:
      return 'text-green-600 bg-green-50'
    case RISK_LEVELS.MEDIUM:
      return 'text-yellow-600 bg-yellow-50'
    case RISK_LEVELS.HIGH:
      return 'text-red-600 bg-red-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}
