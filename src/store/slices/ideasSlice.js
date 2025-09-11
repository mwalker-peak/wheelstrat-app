import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  ideas: [],
  filters: {
    minDTE: 15,
    maxDTE: 45,
    sectors: [],
    minProbability: 0.5,
  },
  loading: false,
  error: null,
}

const ideasSlice = createSlice({
  name: 'ideas',
  initialState,
  reducers: {
    setIdeas: (state, action) => {
      state.ideas = action.payload
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const { setIdeas, updateFilters, setLoading, setError } = ideasSlice.actions
export default ideasSlice.reducer