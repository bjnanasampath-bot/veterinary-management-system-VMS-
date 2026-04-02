import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export function createGenericSlice(name, api) {
  const fetchAll = createAsyncThunk(`${name}/fetchAll`, async (params, { rejectWithValue }) => {
    try { return (await api.getAll(params)).data } catch (e) { return rejectWithValue(e.response?.data) }
  })
  const fetchById = createAsyncThunk(`${name}/fetchById`, async (id, { rejectWithValue }) => {
    try { return (await api.getById(id)).data } catch (e) { return rejectWithValue(e.response?.data) }
  })
  const create = createAsyncThunk(`${name}/create`, async (data, { rejectWithValue }) => {
    try { return (await api.create(data)).data } catch (e) { return rejectWithValue(e.response?.data) }
  })
  const update = createAsyncThunk(`${name}/update`, async ({ id, data }, { rejectWithValue }) => {
    try { return (await api.update(id, data)).data } catch (e) { return rejectWithValue(e.response?.data) }
  })
  const remove = createAsyncThunk(`${name}/remove`, async (id, { rejectWithValue }) => {
    try { await api.delete(id); return id } catch (e) { return rejectWithValue(e.response?.data) }
  })

  const slice = createSlice({
    name,
    initialState: {
      items: [], selected: null, loading: false, error: null,
      pagination: { count: 0, total_pages: 1, current_page: 1 }
    },
    reducers: {
      clearSelected: (state) => { state.selected = null },
      clearError: (state) => { state.error = null },
    },
    extraReducers: (builder) => {
      const pending = (state) => { state.loading = true; state.error = null }
      const rejected = (state, action) => { state.loading = false; state.error = action.payload }

      builder
        .addCase(fetchAll.pending, pending)
        .addCase(fetchAll.fulfilled, (state, action) => {
          state.loading = false
          const d = action.payload
          if (d?.results) {
            state.items = d.results
            state.pagination = { count: d.count, total_pages: d.total_pages, current_page: d.current_page }
          } else if (d?.data) {
            state.items = Array.isArray(d.data) ? d.data : []
          } else {
            state.items = Array.isArray(d) ? d : []
          }
        })
        .addCase(fetchAll.rejected, rejected)
        .addCase(fetchById.pending, pending)
        .addCase(fetchById.fulfilled, (state, action) => {
          state.loading = false
          state.selected = action.payload?.data || action.payload
        })
        .addCase(fetchById.rejected, rejected)
        .addCase(create.pending, pending)
        .addCase(create.fulfilled, (state, action) => {
          state.loading = false
          const item = action.payload?.data || action.payload
          if (item) state.items.unshift(item)
        })
        .addCase(create.rejected, rejected)
        .addCase(update.pending, pending)
        .addCase(update.fulfilled, (state, action) => {
          state.loading = false
          const item = action.payload?.data || action.payload
          if (item) {
            const idx = state.items.findIndex(i => i.id === item.id)
            if (idx !== -1) state.items[idx] = item
            state.selected = item
          }
        })
        .addCase(update.rejected, rejected)
        .addCase(remove.pending, pending)
        .addCase(remove.fulfilled, (state, action) => {
          state.loading = false
          state.items = state.items.filter(i => i.id !== action.payload)
        })
        .addCase(remove.rejected, rejected)
    }
  })

  return { slice, fetchAll, fetchById, create, update, remove }
}
