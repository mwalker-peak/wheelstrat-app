import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import databaseService from '../../services/database'

// Async thunks for alerts operations
export const getUserAlerts = createAsyncThunk(
  'alerts/getUserAlerts',
  async (userId, { rejectWithValue }) => {
    try {
      const alerts = await databaseService.getUserAlerts(userId)
      return alerts
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createAlert = createAsyncThunk(
  'alerts/createAlert',
  async ({ userId, alertData }, { rejectWithValue }) => {
    try {
      const newAlert = await databaseService.createAlert(userId, {
        ...alertData,
        createdAt: new Date().toISOString(),
        isRead: false
      })
      return newAlert
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const markAlertAsRead = createAsyncThunk(
  'alerts/markAsRead',
  async ({ userId, alertId }, { rejectWithValue }) => {
    try {
      const updatedAlert = await databaseService.updateAlert(userId, alertId, {
        isRead: true,
        readAt: new Date().toISOString()
      })
      return updatedAlert
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const markAllAlertsAsRead = createAsyncThunk(
  'alerts/markAllAsRead',
  async (userId, { rejectWithValue }) => {
    try {
      const result = await databaseService.markAllAlertsAsRead(userId)
      return result
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteAlert = createAsyncThunk(
  'alerts/deleteAlert',
  async ({ userId, alertId }, { rejectWithValue }) => {
    try {
      await databaseService.deleteAlert(userId, alertId)
      return alertId
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  // Core data
  items: [],
  
  // Summary counts
  unreadCount: 0,
  totalCount: 0,
  
  // Filters
  filters: {
    type: 'all', // all|profit_target|dte_warning|earnings|assignment_risk
    priority: 'all', // all|low|medium|high
    isRead: 'all', // all|read|unread
    actionRequired: 'all' // all|action_required|no_action
  },
  
  // View settings
  viewMode: 'list', // list|cards
  
  // Pagination
  pagination: {
    currentPage: 1,
    itemsPerPage: 20,
    totalItems: 0
  },
  
  // Async states
  loading: false,
  creating: false,
  updating: false,
  error: null,
  lastUpdated: null
}

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    // Filter actions
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
      state.pagination.currentPage = 1 // Reset to first page
    },
    
    clearFilters: (state) => {
      state.filters = {
        type: 'all',
        priority: 'all',
        isRead: 'all',
        actionRequired: 'all'
      }
      state.pagination.currentPage = 1
    },
    
    // Pagination
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload
    },
    
    setItemsPerPage: (state, action) => {
      state.pagination.itemsPerPage = action.payload
      state.pagination.currentPage = 1
    },
    
    // View mode
    setViewMode: (state, action) => {
      state.viewMode = action.payload
    },
    
    // Local alert management (for immediate UI feedback)
    addAlertLocally: (state, action) => {
      const newAlert = {
        id: `temp_${Date.now()}`,
        ...action.payload,
        createdAt: new Date().toISOString(),
        isRead: false
      }
      state.items.unshift(newAlert)
      state.unreadCount += 1
      state.totalCount += 1
    },
    
    markAsReadLocally: (state, action) => {
      const alertId = action.payload
      const alert = state.items.find(item => item.id === alertId)
      if (alert && !alert.isRead) {
        alert.isRead = true
        alert.readAt = new Date().toISOString()
        state.unreadCount -= 1
      }
    },
    
    markAllAsReadLocally: (state) => {
      state.items.forEach(alert => {
        if (!alert.isRead) {
          alert.isRead = true
          alert.readAt = new Date().toISOString()
        }
      })
      state.unreadCount = 0
    },
    
    deleteAlertLocally: (state, action) => {
      const alertId = action.payload
      const alertIndex = state.items.findIndex(item => item.id === alertId)
      if (alertIndex !== -1) {
        const alert = state.items[alertIndex]
        if (!alert.isRead) {
          state.unreadCount -= 1
        }
        state.items.splice(alertIndex, 1)
        state.totalCount -= 1
      }
    },
    
    // Calculate counts
    calculateCounts: (state) => {
      state.totalCount = state.items.length
      state.unreadCount = state.items.filter(alert => !alert.isRead).length
    },
    
    // System-generated alerts (called from other slices)
    generatePositionAlert: (state, action) => {
      const { positionId, type, message, priority = 'medium' } = action.payload
      const alert = {
        id: `pos_${positionId}_${Date.now()}`,
        type: type, // profit_target|dte_warning|assignment_risk
        title: `Position Alert: ${type.replace('_', ' ').toUpperCase()}`,
        message,
        priority,
        isRead: false,
        actionRequired: priority === 'high',
        createdAt: new Date().toISOString(),
        relatedPosition: positionId
      }
      state.items.unshift(alert)
      state.unreadCount += 1
      state.totalCount += 1
    },
    
    generateEarningsAlert: (state, action) => {
      const { symbol, earningsDate, positions } = action.payload
      const alert = {
        id: `earnings_${symbol}_${Date.now()}`,
        type: 'earnings',
        title: `Earnings Alert: ${symbol}`,
        message: `${symbol} has earnings on ${earningsDate}. You have ${positions.length} open position(s).`,
        priority: 'medium',
        isRead: false,
        actionRequired: true,
        createdAt: new Date().toISOString(),
        relatedSymbol: symbol,
        relatedPositions: positions
      }
      state.items.unshift(alert)
      state.unreadCount += 1
      state.totalCount += 1
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null
    }
  },
  
  extraReducers: (builder) => {
    // Get User Alerts
    builder
      .addCase(getUserAlerts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getUserAlerts.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload || []
        alertsSlice.caseReducers.calculateCounts(state)
        state.lastUpdated = new Date().toISOString()
      })
      .addCase(getUserAlerts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Create Alert
    builder
      .addCase(createAlert.pending, (state) => {
        state.creating = true
        state.error = null
      })
      .addCase(createAlert.fulfilled, (state, action) => {
        state.creating = false
        // Replace temp alert if it exists, otherwise add new
        const tempIndex = state.items.findIndex(item => item.id.startsWith('temp_'))
        if (tempIndex !== -1) {
          state.items[tempIndex] = action.payload
        } else {
          state.items.unshift(action.payload)
          state.unreadCount += 1
          state.totalCount += 1
        }
      })
      .addCase(createAlert.rejected, (state, action) => {
        state.creating = false
        state.error = action.payload
        // Remove temp alert on failure
        state.items = state.items.filter(item => !item.id.startsWith('temp_'))
        alertsSlice.caseReducers.calculateCounts(state)
      })

    // Mark as Read
    builder
      .addCase(markAlertAsRead.pending, (state) => {
        state.updating = true
      })
      .addCase(markAlertAsRead.fulfilled, (state, action) => {
        state.updating = false
        const alert = state.items.find(item => item.id === action.payload.id)
        if (alert) {
          alert.isRead = true
          alert.readAt = action.payload.readAt
          state.unreadCount = Math.max(0, state.unreadCount - 1)
        }
      })
      .addCase(markAlertAsRead.rejected, (state, action) => {
        state.updating = false
        state.error = action.payload
      })

    // Mark All as Read
    builder
      .addCase(markAllAlertsAsRead.pending, (state) => {
        state.updating = true
      })
      .addCase(markAllAlertsAsRead.fulfilled, (state) => {
        state.updating = false
        state.items.forEach(alert => {
          alert.isRead = true
          alert.readAt = new Date().toISOString()
        })
        state.unreadCount = 0
      })
      .addCase(markAllAlertsAsRead.rejected, (state, action) => {
        state.updating = false
        state.error = action.payload
      })

    // Delete Alert
    builder
      .addCase(deleteAlert.fulfilled, (state, action) => {
        const alertId = action.payload
        const alertIndex = state.items.findIndex(item => item.id === alertId)
        if (alertIndex !== -1) {
          const alert = state.items[alertIndex]
          if (!alert.isRead) {
            state.unreadCount -= 1
          }
          state.items.splice(alertIndex, 1)
          state.totalCount -= 1
        }
      })
      .addCase(deleteAlert.rejected, (state, action) => {
        state.error = action.payload
      })
  }
})

export const { 
  updateFilters,
  clearFilters,
  setCurrentPage,
  setItemsPerPage,
  setViewMode,
  addAlertLocally,
  markAsReadLocally,
  markAllAsReadLocally,
  deleteAlertLocally,
  calculateCounts,
  generatePositionAlert,
  generateEarningsAlert,
  clearError
} = alertsSlice.actions

export default alertsSlice.reducer