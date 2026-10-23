import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { responseApi } from '@/api/responseApi'
import { getErrorMessage } from '@/utils/apiError'

const emptyPagination = {
  total: 0,
  page: 1,
  limit: 50,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
}

const emptyCounts = {
  registration: 0,
  enquiry: 0,
  general: 0,
}

function coursePrice(course) {
  const offer = Number(course?.fees?.offerPrice)
  if (Number.isFinite(offer) && offer > 0) return offer
  const price = Number(course?.fees?.price)
  return Number.isFinite(price) ? price : null
}

export function toResponse(item) {
  if (!item) return null
  const course = item.course && typeof item.course === 'object' ? item.course : null
  return {
    id: String(item.id || item._id || ''),
    kind: item.responseType || 'general',
    courseId: course ? String(course.id || course._id) : item.course ? String(item.course) : '',
    courseTitle: course?.title || '',
    price: coursePrice(course),
    userName: item.name || '',
    email: item.email || '',
    mobile: item.phone || '',
    message: item.message || '',
    isResponded: Boolean(item.isResponded),
    createdAt: item.createdAt || null,
  }
}

function unwrapResponse(data) {
  return toResponse(data?.response || data)
}

export const fetchResponses = createAsyncThunk(
  'responses/fetchAll',
  async ({ page = 1, limit = 50, search = '', responseType } = {}, { rejectWithValue }) => {
    try {
      const data = await responseApi.list({
        page,
        limit,
        search: search || undefined,
        responseType: responseType || undefined,
      })
      const list = Array.isArray(data?.responses) ? data.responses : Array.isArray(data) ? data : []
      return {
        items: list.map(toResponse).filter(Boolean),
        pagination: data?.pagination || {
          ...emptyPagination,
          total: list.length,
          page,
          limit,
        },
        counts: { ...emptyCounts, ...(data?.counts || {}) },
      }
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const fetchResponseById = createAsyncThunk('responses/fetchById', async (id, { rejectWithValue }) => {
  try {
    const data = await responseApi.getById(id)
    const response = unwrapResponse(data)
    if (!response?.id) {
      return rejectWithValue('This response was not found.')
    }
    return response
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

const initialState = {
  items: [],
  current: null,
  pagination: emptyPagination,
  counts: emptyCounts,
  status: 'idle',
  request: '',
  error: null,
}

const responsesSlice = createSlice({
  name: 'responses',
  initialState,
  reducers: {
    clearResponseFeedback(state) {
      state.status = 'idle'
      state.request = ''
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResponses.pending, pending)
      .addCase(fetchResponses.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = null
        state.items = action.payload.items
        state.pagination = action.payload.pagination
        state.counts = action.payload.counts
      })
      .addCase(fetchResponses.rejected, rejected)
      .addCase(fetchResponseById.pending, pending)
      .addCase(fetchResponseById.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = null
        state.current = action.payload
        const index = state.items.findIndex((item) => item.id === action.payload.id)
        if (index >= 0) state.items[index] = action.payload
      })
      .addCase(fetchResponseById.rejected, rejected)
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

export const { clearResponseFeedback } = responsesSlice.actions
export default responsesSlice.reducer
