import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { categoryApi } from '@/api/categoryApi'
import { getErrorMessage } from '@/utils/apiError'

const emptyPagination = {
  total: 0,
  page: 1,
  limit: 50,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
}

export function toCategory(item) {
  if (!item) return null
  return {
    id: String(item.id || item._id),
    name: item.name || '',
    description: item.description || '',
    isActive: item.isActive !== false,
  }
}

function unwrapCategory(data) {
  return toCategory(data?.category || data)
}

export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async ({ page = 1, limit = 50 } = {}, { rejectWithValue }) => {
    try {
      const data = await categoryApi.list({ page, limit })
      const list = Array.isArray(data?.categories) ? data.categories : Array.isArray(data) ? data : []
      return {
        items: list.map(toCategory).filter(Boolean),
        pagination: data?.pagination || {
          ...emptyPagination,
          total: list.length,
          page,
          limit,
        },
      }
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const fetchCategoryById = createAsyncThunk(
  'categories/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await categoryApi.getById(id)
      const category = unwrapCategory(data)
      if (!category) {
        return rejectWithValue('This category was not found.')
      }
      return category
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const createCategory = createAsyncThunk(
  'categories/create',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await categoryApi.create(payload)
      const category = unwrapCategory(data)
      if (!category) {
        return rejectWithValue('Category was created, but the server did not return it.')
      }
      return category
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const updateCategory = createAsyncThunk(
  'categories/update',
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      const data = await categoryApi.update(id, payload)
      const category = unwrapCategory(data)
      if (!category) {
        return rejectWithValue('Category was updated, but the server did not return it.')
      }
      return category
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (id, { rejectWithValue }) => {
    try {
      await categoryApi.remove(id)
      return id
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

const initialState = {
  items: [],
  current: null,
  pagination: emptyPagination,
  status: 'idle',
  request: '',
  error: null,
}

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCategoryFeedback(state) {
      state.status = 'idle'
      state.request = ''
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, pending)
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = null
        state.items = action.payload.items
        state.pagination = action.payload.pagination
      })
      .addCase(fetchCategories.rejected, rejected)
      .addCase(fetchCategoryById.pending, pending)
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = null
        state.current = action.payload
        const index = state.items.findIndex((item) => item.id === action.payload.id)
        if (index >= 0) state.items[index] = action.payload
      })
      .addCase(fetchCategoryById.rejected, rejected)
      .addCase(createCategory.pending, pending)
      .addCase(createCategory.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = null
        state.items.unshift(action.payload)
        state.pagination.total += 1
      })
      .addCase(createCategory.rejected, rejected)
      .addCase(updateCategory.pending, pending)
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = null
        state.current = action.payload
        const index = state.items.findIndex((item) => item.id === action.payload.id)
        if (index >= 0) state.items[index] = action.payload
      })
      .addCase(updateCategory.rejected, rejected)
      .addCase(deleteCategory.pending, pending)
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = null
        state.items = state.items.filter((item) => item.id !== action.payload)
        if (state.current?.id === action.payload) state.current = null
        state.pagination.total = Math.max(0, state.pagination.total - 1)
      })
      .addCase(deleteCategory.rejected, rejected)
  },
})

function pending(state, action) {
  state.status = 'loading'
  state.request = action.type
  state.error = null
}

function rejected(state, action) {
  state.status = 'failed'
  state.request = action.type
  state.error = action.payload || 'Request failed'
}

export const { clearCategoryFeedback } = categoriesSlice.actions
export default categoriesSlice.reducer
