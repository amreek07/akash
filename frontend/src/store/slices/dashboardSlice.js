import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { dashboardApi } from '@/api/dashboardApi'
import { getErrorMessage } from '@/utils/apiError'

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function emptyMonths() {
  return monthLabels.map((label, index) => ({
    month: index + 1,
    label,
    registration: 0,
    enquiry: 0,
    general: 0,
    total: 0,
  }))
}

const emptyStats = {
  year: new Date().getFullYear(),
  registrations: 0,
  courses: { total: 0, active: 0 },
  partners: { total: 0, active: 0 },
  months: emptyMonths(),
}

function toStats(data) {
  const months = emptyMonths()
  if (Array.isArray(data?.months)) {
    data.months.forEach((month) => {
      const index = Number(month.month) - 1
      if (index < 0 || index > 11) return
      months[index] = {
        month: index + 1,
        label: month.label || monthLabels[index],
        registration: Number(month.registration) || 0,
        enquiry: Number(month.enquiry) || 0,
        general: Number(month.general) || 0,
        total: Number(month.total) || 0,
      }
    })
  }
  return {
    year: Number(data?.year) || emptyStats.year,
    registrations: Number(data?.registrations) || 0,
    courses: {
      total: Number(data?.courses?.total) || 0,
      active: Number(data?.courses?.active) || 0,
    },
    partners: {
      total: Number(data?.partners?.total) || 0,
      active: Number(data?.partners?.active) || 0,
    },
    months,
  }
}

export const fetchDashboard = createAsyncThunk('dashboard/fetch', async (_, { rejectWithValue }) => {
  try {
    const data = await dashboardApi.get()
    return toStats(data)
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: emptyStats,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.stats = action.payload
        state.error = null
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Unable to load dashboard stats.'
      })
  },
})

export default dashboardSlice.reducer
