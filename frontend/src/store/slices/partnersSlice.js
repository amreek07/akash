import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { partnerApi } from '@/api/partnerApi'
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
  all: 0,
  active: 0,
  inactive: 0,
}

export function toPartner(item) {
  if (!item) return null
  const status = item.status === 'inactive' || item.isActive === false ? 'inactive' : 'active'
  return {
    id: String(item.id || item._id || ''),
    partnerId: item.partnerId || '',
    name: item.name || '',
    email: item.email || '',
    phone: item.phone || '',
    address: item.address || '',
    city: item.city || '',
    status,
    isActive: status === 'active',
    createdAt: item.createdAt || null,
  }
}

function unwrapPartner(data) {
  return toPartner(data?.partner || data)
}

export const fetchPartners = createAsyncThunk(
  'partners/fetchAll',
  async ({ page = 1, limit = 50, search = '', status } = {}, { rejectWithValue }) => {
    try {
      const data = await partnerApi.list({
        page,
        limit,
        search: search || undefined,
        status: status || undefined,
      })
      const list = Array.isArray(data?.partners) ? data.partners : Array.isArray(data) ? data : []
      return {
        items: list.map(toPartner).filter(Boolean),
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

export const fetchPartnerById = createAsyncThunk('partners/fetchById', async (id, { rejectWithValue }) => {
  try {
    const data = await partnerApi.getById(id)
    const partner = unwrapPartner(data)
    if (!partner?.id) {
      return rejectWithValue('This partner was not found.')
    }
    return partner
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

export const createPartner = createAsyncThunk('partners/create', async (payload, { rejectWithValue }) => {
  try {
    const data = await partnerApi.create(payload)
    const partner = unwrapPartner(data)
    if (!partner?.id) {
      return rejectWithValue('Partner was created, but the server did not return it.')
    }
    return partner
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

export const updatePartner = createAsyncThunk('partners/update', async ({ id, ...payload }, { rejectWithValue }) => {
  try {
    const data = await partnerApi.update(id, payload)
    const partner = unwrapPartner(data)
    if (!partner?.id) {
      return rejectWithValue('Partner was updated, but the server did not return it.')
    }
    return partner
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

export const deletePartner = createAsyncThunk('partners/delete', async (id, { rejectWithValue }) => {
  try {
    await partnerApi.remove(id)
    return id
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

const partnersSlice = createSlice({
  name: 'partners',
  initialState,
  reducers: {
    clearPartnerFeedback(state) {
      state.status = 'idle'
      state.request = ''
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPartners.pending, pending)
      .addCase(fetchPartners.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = null
        state.items = action.payload.items
        state.pagination = action.payload.pagination
        state.counts = action.payload.counts
      })
      .addCase(fetchPartners.rejected, rejected)
      .addCase(fetchPartnerById.pending, pending)
      .addCase(fetchPartnerById.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = null
        state.current = action.payload
        const index = state.items.findIndex((item) => item.id === action.payload.id)
        if (index >= 0) state.items[index] = action.payload
      })
      .addCase(fetchPartnerById.rejected, rejected)
      .addCase(createPartner.pending, pending)
      .addCase(createPartner.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = null
        state.items.unshift(action.payload)
        state.counts.all += 1
        if (action.payload.isActive) state.counts.active += 1
        else state.counts.inactive += 1
        state.pagination.total += 1
      })
      .addCase(createPartner.rejected, rejected)
      .addCase(updatePartner.pending, pending)
      .addCase(updatePartner.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = null
        state.current = action.payload
        const index = state.items.findIndex((item) => item.id === action.payload.id)
        if (index >= 0) state.items[index] = action.payload
      })
      .addCase(updatePartner.rejected, rejected)
      .addCase(deletePartner.pending, pending)
      .addCase(deletePartner.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = null
        const removed = state.items.find((item) => item.id === action.payload)
        state.items = state.items.filter((item) => item.id !== action.payload)
        if (state.current?.id === action.payload) state.current = null
        state.counts.all = Math.max(0, state.counts.all - 1)
        if (removed?.isActive) state.counts.active = Math.max(0, state.counts.active - 1)
        else if (removed) state.counts.inactive = Math.max(0, state.counts.inactive - 1)
        state.pagination.total = Math.max(0, state.pagination.total - 1)
      })
      .addCase(deletePartner.rejected, rejected)
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

export const { clearPartnerFeedback } = partnersSlice.actions
export default partnersSlice.reducer
