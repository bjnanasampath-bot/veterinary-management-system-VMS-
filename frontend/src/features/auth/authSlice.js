import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authApi } from '../../api'
import toast from 'react-hot-toast'

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await authApi.login(data)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data)
  }
})

export const logout = createAsyncThunk('auth/logout', async (_, { getState }) => {
  const refresh = localStorage.getItem('refresh_token')
  try { await authApi.logout({ refresh_token: refresh }) } catch {}
  localStorage.clear()
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('access_token'),
    isAuthenticated: !!localStorage.getItem('access_token'),
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.access
        localStorage.setItem('access_token', action.payload.access)
        localStorage.setItem('refresh_token', action.payload.refresh)
        localStorage.setItem('user', JSON.stringify(action.payload.user))
        toast.success('Login successful!')
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Login failed'
        toast.error(state.error)
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        toast.success('Logged out successfully')
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
