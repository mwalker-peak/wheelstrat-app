import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import databaseService from '../../services/database'

// Async thunks for user profile operations
export const loadUserProfile = createAsyncThunk(
  'user/loadProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const profile = await databaseService.getUserProfile(userId)
      return profile
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const saveUserProfile = createAsyncThunk(
  'user/saveProfile',
  async ({ userId, profileData }, { rejectWithValue }) => {
    try {
      const updatedProfile = await databaseService.updateUserProfile(userId, profileData)
      return updatedProfile
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const completeUserSetup = createAsyncThunk(
  'user/completeSetup',
  async ({ userId, profileData }, { rejectWithValue }) => {
    try {
      const setupData = {
        ...profileData,
        'profile.setupCompleted': true,
        updatedAt: new Date().toISOString()
      }
      const updatedProfile = await databaseService.updateUserProfile(userId, setupData)
      return updatedProfile
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  profile: {
    investmentCapital: 20000,
    riskTolerance: 'low',
    favoriteMarketSectors: [],
    setupCompleted: false,
  },
  loading: false,
  error: null,
  profileLoaded: false
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload }
    },
    clearUserData: (state) => {
      state.profile = initialState.profile
      state.profileLoaded = false
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Load User Profile
    builder
      .addCase(loadUserProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadUserProfile.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload && action.payload.profile) {
          state.profile = { ...state.profile, ...action.payload.profile }
        }
        state.profileLoaded = true
      })
      .addCase(loadUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.profileLoaded = true // Still set to true to prevent infinite loading
      })

    // Save User Profile
    builder
      .addCase(saveUserProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(saveUserProfile.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload && action.payload.profile) {
          state.profile = { ...state.profile, ...action.payload.profile }
        }
      })
      .addCase(saveUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Complete Setup
    builder
      .addCase(completeUserSetup.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(completeUserSetup.fulfilled, (state, action) => {
        state.loading = false
        state.profile.setupCompleted = true
        if (action.payload && action.payload.profile) {
          state.profile = { ...state.profile, ...action.payload.profile }
        }
      })
      .addCase(completeUserSetup.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { updateProfile, clearUserData, clearError } = userSlice.actions
export default userSlice.reducer