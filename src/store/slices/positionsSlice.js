import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  positions: [],
  totalPnL: 0,
  totalRevenue: 0,
  alerts: [],
  loading: false,
  error: null,
}

const positionsSlice = createSlice({
  name: 'positions',
  initialState,
  reducers: {
    addPosition: (state, action) => {
      state.positions.push({
        id: Date.now(),
        ...action.payload,
        dateOpened: new Date().toISOString(),
        status: 'open',
      })
    },
    updatePosition: (state, action) => {
      const index = state.positions.findIndex(p => p.id === action.payload.id)
      if (index !== -1) {
        state.positions[index] = { ...state.positions[index], ...action.payload }
      }
    },
    closePosition: (state, action) => {
      const index = state.positions.findIndex(p => p.id === action.payload.id)
      if (index !== -1) {
        state.positions[index].status = 'closed'
        state.positions[index].dateClosed = new Date().toISOString()
        state.positions[index].finalPnL = action.payload.finalPnL
      }
    },
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
    calculateTotals: (state) => {
      state.totalPnL = state.positions.reduce((sum, pos) => sum + (pos.currentPnL || 0), 0)
      state.totalRevenue = state.positions.reduce((sum, pos) => sum + (pos.premium || 0), 0)
    },
  },
})

export const { 
  addPosition, 
  updatePosition, 
  closePosition, 
  addAlert, 
  dismissAlert, 
  calculateTotals 
} = positionsSlice.actions
export default positionsSlice.reducer