import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import databaseService from '../../services/database'

// Async thunks for Firebase auth actions
export const signUpUser = createAsyncThunk(
  'auth/signUp',
  async ({ email, password, displayName }, { rejectWithValue }) => {
    try {
      const user = await databaseService.signUp(email, password, { displayName })
      return user
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const signInUser = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const user = await databaseService.signIn(email, password)
      return user
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const signInWithGoogle = createAsyncThunk(
  'auth/signInWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      const user = await databaseService.signInWithGoogle()
      return user
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const signOutUser = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      await databaseService.signOut()
      return null
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const sendPasswordReset = createAsyncThunk(
  'auth/sendPasswordReset',
  async (email, { rejectWithValue }) => {
    try {
      await databaseService.sendPasswordResetEmail(email)
      return email
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  passwordResetSent: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Handle auth state changes from Firebase listener
    setAuthState: (state, action) => {
      const user = action.payload
      if (user) {
        state.user = user
        state.isAuthenticated = true
      } else {
        state.user = null
        state.isAuthenticated = false
      }
      state.loading = false
    },
    clearError: (state) => {
      state.error = null
    },
    clearPasswordReset: (state) => {
      state.passwordResetSent = false
    }
  },
  extraReducers: (builder) => {
    // Sign Up
    builder
      .addCase(signUpUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
        state.loading = false
        state.error = null
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Sign In
    builder
      .addCase(signInUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
        state.loading = false
        state.error = null
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Google Sign In
    builder
      .addCase(signInWithGoogle.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
        state.loading = false
        state.error = null
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Sign Out
    builder
      .addCase(signOutUser.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
        state.loading = false
        state.error = null
      })

    // Password Reset
    builder
      .addCase(sendPasswordReset.fulfilled, (state) => {
        state.passwordResetSent = true
        state.error = null
      })
      .addCase(sendPasswordReset.rejected, (state, action) => {
        state.error = action.payload
      })
  }
})

export const { setAuthState, clearError, clearPasswordReset } = authSlice.actions
export default authSlice.reducer