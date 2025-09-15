import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import databaseService from '../../services/database'

// Async thunks for position operations
export const getUserPositions = createAsyncThunk(
  'positions/getUserPositions',
  async (userId, { rejectWithValue }) => {
    try {
      const positions = await databaseService.getUserPositions(userId)
      return positions
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createPosition = createAsyncThunk(
  'positions/createPosition',
  async ({ userId, positionData }, { rejectWithValue }) => {
    try {
      const newPosition = await databaseService.createPosition(userId, {
        ...positionData,
        dateOpened: new Date().toISOString(),
        status: 'open',
      })
      return newPosition
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updatePosition = createAsyncThunk(
  'positions/updatePosition',
  async ({ userId, positionId, updates }, { rejectWithValue }) => {
    try {
      const updatedPosition = await databaseService.updatePosition(userId, positionId, updates)
      return updatedPosition
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const closePosition = createAsyncThunk(
  'positions/closePosition',
  async ({ userId, positionId, finalPnL }, { rejectWithValue }) => {
    try {
      const closedPosition = await databaseService.updatePosition(userId, positionId, {
        status: 'closed',
        dateClosed: new Date().toISOString(),
        finalPnL
      })
      return closedPosition
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  // Core data
  positions: [],
  
  // Summary calculations
  summary: {
    totalValue: 0,
    totalReturn: 0,
    returnPercentage: 0,
    openPositions: 0,
    todaysPL: 0
  },
  
  // Filters
  filters: {
    status: 'all', // all|open|closed|assigned
    symbol: '',
    dateRange: {
      start: null,
      end: null
    }
  },
  
  // View settings
  viewMode: 'cards', // cards|table
  
  // Legacy fields (maintaining backward compatibility)
  totalPnL: 0,
  totalRevenue: 0,
  alerts: [],
  
  // Async states
  loading: false,
  error: null,
}

const positionsSlice = createSlice({
  name: 'positions',
  initialState,
  reducers: {
    // Legacy actions (maintaining backward compatibility)
    addPosition: (state, action) => {
      state.positions.push({
        id: Date.now(),
        ...action.payload,
        dateOpened: new Date().toISOString(),
        status: 'open',
      })
      // Recalculate summaries
      positionsSlice.caseReducers.calculateSummaries(state)
    },
    
    // Filter actions
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    
    clearFilters: (state) => {
      state.filters = {
        status: 'all',
        symbol: '',
        dateRange: { start: null, end: null }
      }
    },
    
    // View mode
    setViewMode: (state, action) => {
      state.viewMode = action.payload
    },
    
    // Summary calculations
    calculateSummaries: (state) => {
      const positions = state.positions
      const openPositions = positions.filter(p => p.status === 'open')
      const today = new Date().toDateString()
      
      // Calculate summary values
      state.summary.openPositions = openPositions.length
      state.summary.totalValue = positions.reduce((sum, pos) => {
        return sum + (pos.currentValue || pos.totalPremium || 0)
      }, 0)
      
      state.summary.totalReturn = positions.reduce((sum, pos) => {
        return sum + (pos.finalPnL || pos.currentPnL || 0)
      }, 0)
      
      state.summary.returnPercentage = state.summary.totalValue > 0 
        ? (state.summary.totalReturn / state.summary.totalValue) * 100 
        : 0
      
      state.summary.todaysPL = positions.reduce((sum, pos) => {
        // Calculate today's P&L based on positions opened today or current market movement
        const positionDate = new Date(pos.dateOpened).toDateString()
        if (positionDate === today) {
          return sum + (pos.currentPnL || 0)
        }
        // For existing positions, include any intraday changes
        return sum + (pos.todayChange || 0)
      }, 0)
      
      // Update legacy fields for backward compatibility
      state.totalPnL = state.summary.totalReturn
      state.totalRevenue = positions.reduce((sum, pos) => sum + (pos.premium || 0), 0)
    },
    
    // Alert actions (maintaining backward compatibility)
    addAlert: (state, action) => {
      state.alerts.push({
        id: Date.now(),
        ...action.payload,
        timestamp: new Date().toISOString(),
      })
    },
    
    dismissAlert: (state, action) => {
      state.alerts = state.alerts.filter(alert => alert.id !== action.payload)
    },
    
    // Legacy action (maintaining backward compatibility)
    calculateTotals: (state) => {
      // Redirect to new calculateSummaries
      positionsSlice.caseReducers.calculateSummaries(state)
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null
    }
  },
  
  extraReducers: (builder) => {
    // Get User Positions
    builder
      .addCase(getUserPositions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getUserPositions.fulfilled, (state, action) => {
        state.loading = false
        state.positions = action.payload || []
        // Recalculate summaries with new data
        positionsSlice.caseReducers.calculateSummaries(state)
      })
      .addCase(getUserPositions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Create Position
    builder
      .addCase(createPosition.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createPosition.fulfilled, (state, action) => {
        state.loading = false
        state.positions.push(action.payload)
        positionsSlice.caseReducers.calculateSummaries(state)
      })
      .addCase(createPosition.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Update Position
    builder
      .addCase(updatePosition.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updatePosition.fulfilled, (state, action) => {
        state.loading = false
        const index = state.positions.findIndex(p => p.id === action.payload.id)
        if (index !== -1) {
          state.positions[index] = action.payload
        }
        positionsSlice.caseReducers.calculateSummaries(state)
      })
      .addCase(updatePosition.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Close Position
    builder
      .addCase(closePosition.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(closePosition.fulfilled, (state, action) => {
        state.loading = false
        const index = state.positions.findIndex(p => p.id === action.payload.id)
        if (index !== -1) {
          state.positions[index] = action.payload
        }
        positionsSlice.caseReducers.calculateSummaries(state)
      })
      .addCase(closePosition.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { 
  // New enhanced actions
  updateFilters,
  clearFilters,
  setViewMode,
  calculateSummaries,
  clearError,
  
  // Legacy actions (maintaining backward compatibility)
  addPosition, 
  addAlert, 
  dismissAlert, 
  calculateTotals 
} = positionsSlice.actions

export default positionsSlice.reducer