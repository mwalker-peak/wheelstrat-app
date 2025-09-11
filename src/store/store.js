import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import userSlice from './slices/userSlice'
import positionsSlice from './slices/positionsSlice'
import ideasSlice from './slices/ideasSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    positions: positionsSlice,
  ideas: ideasSlice,
  },
})

