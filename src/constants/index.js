export const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
}

export const MARKET_SECTORS = [
  'Technology',
  'Healthcare',
  'Financial Services',
  'Consumer Discretionary',
  'Communication Services',
  'Industrials',
  'Consumer Staples',
  'Energy',
  'Utilities',
  'Real Estate',
  'Materials',
]

export const DELTA_RANGES = {
  [RISK_LEVELS.LOW]: { min: 0.15, max: 0.25 },
  [RISK_LEVELS.MEDIUM]: { min: 0.26, max: 0.35 },
  [RISK_LEVELS.HIGH]: { min: 0.36, max: 1.0 },
}

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SETUP: '/setup',
  DASHBOARD: '/dashboard',
  IDEAS: '/ideas',
  PROFILE: '/profile',
  SECURITY: '/security',
}