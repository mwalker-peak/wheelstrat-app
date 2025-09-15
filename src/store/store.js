import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import userSlice from './slices/userSlice'
import positionsSlice from './slices/positionsSlice'
import ideasSlice from './slices/ideasSlice'
import alertsSlice from './slices/alertsSlice' // New alerts slice

export const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    positions: positionsSlice,
    ideas: ideasSlice,
    alerts: alertsSlice, // New alerts slice added
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 🎯 IGNORE FIREBASE TIMESTAMP WARNINGS
        ignoredActions: [
          // Existing ignored actions
          'user/loadProfile/fulfilled',
          'user/saveProfile/fulfilled',
          'user/completeSetup/fulfilled',
          'positions/createPosition/fulfilled',
          'positions/getUserPositions/fulfilled',
          // New ignored actions for enhanced slices
          'positions/updatePosition/fulfilled',
          'positions/closePosition/fulfilled',
          'ideas/getStockIdeas/fulfilled',
          'ideas/refreshStockIdeas/fulfilled',
          'ideas/getIdeasSummary/fulfilled',
          'alerts/getUserAlerts/fulfilled',
          'alerts/createAlert/fulfilled',
          'alerts/markAsRead/fulfilled',
        ],
        ignoredPaths: [
          // Existing ignored paths
          'payload.createdAt',
          'payload.updatedAt',
          'payload.profile.createdAt',
          'payload.profile.updatedAt',
          // New ignored paths for enhanced features
          'payload.dateOpened',
          'payload.dateClosed',
          'payload.lastUpdated',
          'payload.readAt',
          'payload.timestamp',
        ],
      },
    }),
})

// Export store type for TypeScript (if using TypeScript later)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
