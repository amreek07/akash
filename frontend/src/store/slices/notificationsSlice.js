import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { notificationApi } from '@/api/notificationApi'
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
  unread: 0,
  read: 0,
}

export function toNotification(item) {
  if (!item) return null
  return {
    id: String(item.id || item._id || ''),
    title: item.title || '',
    message: item.message || '',
    type: item.type || 'general',
    read: Boolean(item.read ?? item.isRead),
    responseId: item.responseId || (item.response ? String(item.response) : ''),
    createdAt: item.createdAt || null,
  }
}

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchAll',
  async ({ page = 1, limit = 50, search = '', read = 'all' } = {}, { rejectWithValue }) => {
    try {
      const data = await notificationApi.list({
        page,
        limit,
        search: search || undefined,
        read: read && read !== 'all' ? read : undefined,
      })
      const list = Array.isArray(data?.notifications) ? data.notifications : Array.isArray(data) ? data : []
      return {
        items: list.map(toNotification).filter(Boolean),
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

export const markNotificationRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id, { rejectWithValue }) => {
    try {
      const data = await notificationApi.markAsRead(id)
      const notification = toNotification(data?.notification || data)
      if (!notification?.id) {
        return rejectWithValue('Notification was updated, but the server did not return it.')
      }
      return notification
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const markAllNotificationsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await notificationApi.markAllAsRead()
      return true
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const deleteNotification = createAsyncThunk('notifications/delete', async (id, { rejectWithValue }) => {
  try {
    await notificationApi.remove(id)
    return id
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

const initialState = {
  items: [],
  pagination: emptyPagination,
  counts: emptyCounts,
  status: 'idle',
  request: '',
  error: null,
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearNotificationFeedback(state) {
      state.status = 'idle'
      state.request = ''
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, pending)
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = null
        state.items = action.payload.items
        state.pagination = action.payload.pagination
        state.counts = action.payload.counts
      })
      .addCase(fetchNotifications.rejected, rejected)
      .addCase(markNotificationRead.pending, pending)
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = null
        const wasUnread = state.items.find((item) => item.id === action.payload.id && !item.read)
        const index = state.items.findIndex((item) => item.id === action.payload.id)
        if (index >= 0) state.items[index] = action.payload
        if (wasUnread) {
          state.counts.unread = Math.max(0, state.counts.unread - 1)
          state.counts.read += 1
        }
      })
      .addCase(markNotificationRead.rejected, rejected)
      .addCase(markAllNotificationsRead.pending, pending)
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.status = 'succeeded'
        state.error = null
        state.items = state.items.map((item) => ({ ...item, read: true }))
        state.counts.read = state.counts.all
        state.counts.unread = 0
      })
      .addCase(markAllNotificationsRead.rejected, rejected)
      .addCase(deleteNotification.pending, pending)
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = null
        const removed = state.items.find((item) => item.id === action.payload)
        state.items = state.items.filter((item) => item.id !== action.payload)
        state.counts.all = Math.max(0, state.counts.all - 1)
        if (removed && !removed.read) {
          state.counts.unread = Math.max(0, state.counts.unread - 1)
        } else if (removed) {
          state.counts.read = Math.max(0, state.counts.read - 1)
        }
        state.pagination.total = Math.max(0, state.pagination.total - 1)
      })
      .addCase(deleteNotification.rejected, rejected)
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

export const { clearNotificationFeedback } = notificationsSlice.actions
export default notificationsSlice.reducer
