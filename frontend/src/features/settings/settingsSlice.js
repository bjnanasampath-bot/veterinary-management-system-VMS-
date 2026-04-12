import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { settingsApi } from '../../api'

export const fetchSettings = createAsyncThunk('settings/fetchAll', async () => {
  const res = await settingsApi.getAll({ page_size: 100 })
  const data = res.data?.results || res.data?.data || res.data || []
  const settingsMap = {}
  data.forEach(s => settingsMap[s.key] = s.value)
  return settingsMap
})

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    data: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export default settingsSlice.reducer
