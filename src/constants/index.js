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
  SIGNUP: '/signup',
  SETUP: '/setup',
  DASHBOARD: '/dashboard',
  IDEAS: '/ideas',
  PROFILE: '/profile',
  SECURITY: '/security',
}

// Options trading constants
export const OPTION_TYPES = {
  CALL: 'call',
  PUT: 'put',
}

export const POSITION_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
  ASSIGNED: 'assigned',
  EXPIRED: 'expired',
}

export const ALERT_TYPES = {
  PROFIT_TARGET: 'profit_target',
  DTE_WARNING: 'dte_warning',
  EARNINGS: 'earnings',
  ASSIGNMENT_RISK: 'assignment_risk',
  ROLL_SUGGESTION: 'roll_suggestion',
}

export const ALERT_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
}

// UI constants
export const VIEW_MODES = {
  CARDS: 'cards',
  TABLE: 'table',
}

export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
}

// API constants
export const API_ENDPOINTS = {
  ALPHA_VANTAGE: 'https://www.alphavantage.co/query',
}

export const CACHE_TIMEOUTS = {
  STOCK_QUOTE: 5 * 60 * 1000, // 5 minutes
  OPTIONS_DATA: 10 * 60 * 1000, // 10 minutes
  COMPANY_INFO: 24 * 60 * 60 * 1000, // 24 hours
}

// Validation constants
export const VALIDATION_RULES = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 128,
  MIN_INVESTMENT_CAPITAL: 1000,
  MAX_INVESTMENT_CAPITAL: 10000000,
  MIN_DTE: 1,
  MAX_DTE: 365,
}

// Default values
export const DEFAULTS = {
  INVESTMENT_CAPITAL: 20000,
  RISK_TOLERANCE: RISK_LEVELS.LOW,
  FAVORITE_SECTORS: [],
  MIN_DTE: 15,
  MAX_DTE: 45,
  MIN_PROBABILITY: 0.5,
  VIEW_MODE: VIEW_MODES.TABLE,
}

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'Your session has expired. Please sign in again.',
  API_RATE_LIMIT: 'API rate limit reached. Please try again later.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  USER_NOT_FOUND: 'No account found with this email address.',
  EMAIL_ALREADY_IN_USE: 'An account with this email already exists.',
  WEAK_PASSWORD: 'Password should be at least 6 characters long.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
}