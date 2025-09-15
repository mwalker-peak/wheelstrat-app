import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import databaseService from '../../services/database'

// Async thunks for ideas operations
export const getStockIdeas = createAsyncThunk(
  'ideas/getStockIdeas',
  async ({ filters, pagination, sorting }, { rejectWithValue }) => {
    try {
      const response = await databaseService.getStockIdeas({
        filters,
        pagination,
        sorting
      })
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const refreshStockIdeas = createAsyncThunk(
  'ideas/refreshStockIdeas',
  async ({ filters, pagination, sorting }, { rejectWithValue }) => {
    try {
      // This would trigger a fresh scan/calculation of stock ideas
      const response = await databaseService.refreshStockIdeas({
        filters,
        pagination, 
        sorting
      })
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const getIdeasSummary = createAsyncThunk(
  'ideas/getIdeasSummary',
  async (filters, { rejectWithValue }) => {
    try {
      const summary = await databaseService.getIdeasSummary(filters)
      return summary
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  // Core data
  ideas: [],
  
  // Pagination
  pagination: {
    currentPage: 1,
    itemsPerPage: 20,
    totalItems: 0,
    totalPages: 0
  },
  
  // Sorting
  sorting: {
    field: 'premium', // premium|probability|dte|alphabetical
    direction: 'desc' // asc|desc
  },
  
  // Enhanced filters
  filters: {
    // Legacy filters (maintaining backward compatibility)
    minDTE: 15,
    maxDTE: 45,
    sectors: [],
    minProbability: 0.5,
    
    // New enhanced filters
    riskLevels: [], // ['low', 'medium', 'high']
    minPremium: null,
    searchTerm: ''
  },
  
  // Summary data
  summary: {
    totalIdeas: 0,
    averagePremium: 0,
    averageProbability: 0,
    sectorBreakdown: {},
    riskBreakdown: {}
  },
  
  // View settings
  viewMode: 'cards', // cards|table
  
  // Async states
  loading: false,
  refreshing: false,
  error: null,
  lastUpdated: null
}

const ideasSlice = createSlice({
  name: 'ideas',
  initialState,
  reducers: {
    // Filter actions
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
      // Reset to first page when filters change
      state.pagination.currentPage = 1
    },
    
    clearFilters: (state) => {
      state.filters = {
        minDTE: 15,
        maxDTE: 45,
        sectors: [],
        minProbability: 0.5,
        riskLevels: [],
        minPremium: null,
        searchTerm: ''
      }
      state.pagination.currentPage = 1
    },
    
    // Pagination actions
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload
    },
    
    setItemsPerPage: (state, action) => {
      state.pagination.itemsPerPage = action.payload
      state.pagination.currentPage = 1 // Reset to first page
    },
    
    // Sorting actions
    updateSorting: (state, action) => {
      const { field, direction } = action.payload
      
      // If same field, toggle direction
      if (state.sorting.field === field && !direction) {
        state.sorting.direction = state.sorting.direction === 'asc' ? 'desc' : 'asc'
      } else {
        state.sorting.field = field
        state.sorting.direction = direction || 'desc'
      }
      
      // Reset to first page when sorting changes
      state.pagination.currentPage = 1
    },
    
    // View mode
    setViewMode: (state, action) => {
      state.viewMode = action.payload
    },
    
    // Manual idea management
    addIdea: (state, action) => {
      state.ideas.unshift(action.payload)
      state.pagination.totalItems += 1
      state.summary.totalIdeas += 1
    },
    
    updateIdea: (state, action) => {
      const index = state.ideas.findIndex(idea => idea.id === action.payload.id)
      if (index !== -1) {
        state.ideas[index] = { ...state.ideas[index], ...action.payload }
      }
    },
    
    removeIdea: (state, action) => {
      const ideaId = action.payload
      state.ideas = state.ideas.filter(idea => idea.id !== ideaId)
      state.pagination.totalItems -= 1
      state.summary.totalIdeas -= 1
    },
    
    // Legacy actions (maintaining backward compatibility)
    setIdeas: (state, action) => {
      state.ideas = action.payload
      state.pagination.totalItems = action.payload.length
      state.summary.totalIdeas = action.payload.length
    },
    
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    
    setError: (state, action) => {
      state.error = action.payload
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null
    },
    
    // Calculate summary statistics
    calculateSummary: (state) => {
      const ideas = state.ideas
      
      if (ideas.length === 0) {
        state.summary = {
          totalIdeas: 0,
          averagePremium: 0,
          averageProbability: 0,
          sectorBreakdown: {},
          riskBreakdown: {}
        }
        return
      }
      
      // Calculate averages
      const totalPremium = ideas.reduce((sum, idea) => sum + (idea.premium || 0), 0)
      const totalProbability = ideas.reduce((sum, idea) => sum + (idea.probability || 0), 0)
      
      state.summary.totalIdeas = ideas.length
      state.summary.averagePremium = totalPremium / ideas.length
      state.summary.averageProbability = totalProbability / ideas.length
      
      // Calculate sector breakdown
      const sectorCounts = {}
      ideas.forEach(idea => {
        if (idea.sector) {
          sectorCounts[idea.sector] = (sectorCounts[idea.sector] || 0) + 1
        }
      })
      state.summary.sectorBreakdown = sectorCounts
      
      // Calculate risk breakdown
      const riskCounts = {}
      ideas.forEach(idea => {
        if (idea.riskLevel) {
          riskCounts[idea.riskLevel] = (riskCounts[idea.riskLevel] || 0) + 1
        }
      })
      state.summary.riskBreakdown = riskCounts
    }
  },
  
  extraReducers: (builder) => {
    // Get Stock Ideas
    builder
      .addCase(getStockIdeas.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getStockIdeas.fulfilled, (state, action) => {
        state.loading = false
        const { ideas, pagination, summary } = action.payload
        
        state.ideas = ideas || []
        
        if (pagination) {
          state.pagination = {
            ...state.pagination,
            ...pagination,
            totalPages: Math.ceil(pagination.totalItems / state.pagination.itemsPerPage)
          }
        }
        
        if (summary) {
          state.summary = { ...state.summary, ...summary }
        } else {
          // Calculate summary if not provided
          ideasSlice.caseReducers.calculateSummary(state)
        }
        
        state.lastUpdated = new Date().toISOString()
      })
      .addCase(getStockIdeas.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Refresh Stock Ideas
    builder
      .addCase(refreshStockIdeas.pending, (state) => {
        state.refreshing = true
        state.error = null
      })
      .addCase(refreshStockIdeas.fulfilled, (state, action) => {
        state.refreshing = false
        const { ideas, pagination, summary } = action.payload
        
        state.ideas = ideas || []
        
        if (pagination) {
          state.pagination = {
            ...state.pagination,
            ...pagination,
            totalPages: Math.ceil(pagination.totalItems / state.pagination.itemsPerPage)
          }
        }
        
        if (summary) {
          state.summary = { ...state.summary, ...summary }
        } else {
          ideasSlice.caseReducers.calculateSummary(state)
        }
        
        state.lastUpdated = new Date().toISOString()
      })
      .addCase(refreshStockIdeas.rejected, (state, action) => {
        state.refreshing = false
        state.error = action.payload
      })

    // Get Ideas Summary
    builder
      .addCase(getIdeasSummary.fulfilled, (state, action) => {
        state.summary = { ...state.summary, ...action.payload }
      })
      .addCase(getIdeasSummary.rejected, (state, action) => {
        state.error = action.payload
      })
  }
})

export const { 
  // New enhanced actions
  updateFilters,
  clearFilters,
  setCurrentPage,
  setItemsPerPage,
  updateSorting,
  setViewMode,
  addIdea,
  updateIdea,
  removeIdea,
  calculateSummary,
  clearError,
  
  // Legacy actions (maintaining backward compatibility)
  setIdeas,
  setLoading, 
  setError 
} = ideasSlice.actions

export default ideasSlice.reducer