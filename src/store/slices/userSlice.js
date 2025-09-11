import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  profile: {
    investmentCapital: 20000,
    riskTolerance: 'low', // low, medium, high
    favoriteMarketSectors: [],
    setupCompleted: false,
  },
  loading: false,
  error: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload }
    },
    completeSetup: (state) => {
      state.profile.setupCompleted = true
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const { updateProfile, completeSetup, setLoading, setError } = userSlice.actions
export default userSlice.reducer