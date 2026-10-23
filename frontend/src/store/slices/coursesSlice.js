import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { courseApi } from '@/api/courseApi'
import { getErrorMessage } from '@/utils/apiError'

const emptyPagination = {
  total: 0,
  page: 1,
  limit: 50,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
}

export function toCourse(item) {
  if (!item) return null
  const populatedCategory =
    item.category && typeof item.category === 'object'
      ? {
          id: String(item.category.id || item.category._id),
          name: item.category.name || '',
          isActive: item.category.isActive !== false,
        }
      : null
  return {
    id: String(item.id || item._id),
    title: item.title || '',
    description: item.description || '',
    duration: {
      value: item.duration?.value ?? '',
      unit: item.duration?.unit || 'months',
    },
    fees: {
      price: item.fees?.price ?? '',
      offerPrice: item.fees?.offerPrice ?? '',
      currency: item.fees?.currency || 'INR',
    },
    categoryId: populatedCategory?.id || (item.category ? String(item.category) : ''),
    categoryName: populatedCategory?.name || '',
    eligibility: item.eligibility || '',
    isActive: item.isActive !== false,
    isParentActive: item.isParentActive !== false,
    isFeatured: Boolean(item.isFeatured),
    isPublished: Boolean(item.isPublished),
  }
}

function unwrapCourse(data) {
  return toCourse(data?.course || data)
}

function replaceCourse(state, course) {
  const index = state.items.findIndex((item) => item.id === course.id)
  if (index >= 0) state.items[index] = course
  if (state.current?.id === course.id) state.current = course
}

export const fetchCourses = createAsyncThunk(
  'courses/fetchAll',
  async ({ page = 1, limit = 50, search = '' } = {}, { rejectWithValue }) => {
    try {
      const data = await courseApi.list({ page, limit, search: search || undefined })
      const list = Array.isArray(data?.courses) ? data.courses : Array.isArray(data) ? data : []
      return {
        items: list.map(toCourse).filter(Boolean),
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

export const fetchCourseById = createAsyncThunk(
  'courses/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const course = unwrapCourse(await courseApi.getById(id))
      if (!course) return rejectWithValue('This course was not found.')
      return course
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const createCourse = createAsyncThunk(
  'courses/create',
  async (payload, { rejectWithValue }) => {
    try {
      const course = unwrapCourse(await courseApi.create(payload))
      if (!course) return rejectWithValue('Course was created, but the server did not return it.')
      return course
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const updateCourse = createAsyncThunk(
  'courses/update',
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      const course = unwrapCourse(await courseApi.update(id, payload))
      if (!course) return rejectWithValue('Course was updated, but the server did not return it.')
      return course
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const deleteCourse = createAsyncThunk(
  'courses/delete',
  async (id, { rejectWithValue }) => {
    try {
      await courseApi.remove(id)
      return id
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const toggleCourseStatus = createAsyncThunk(
  'courses/toggleStatus',
  async (id, { rejectWithValue }) => {
    try {
      const course = unwrapCourse(await courseApi.toggleStatus(id))
      if (!course) return rejectWithValue('Unable to update course status.')
      return course
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const toggleCourseFeatured = createAsyncThunk(
  'courses/toggleFeatured',
  async (id, { rejectWithValue }) => {
    try {
      const course = unwrapCourse(await courseApi.toggleFeatured(id))
      if (!course) return rejectWithValue('Unable to update featured status.')
      return course
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const toggleCoursePublished = createAsyncThunk(
  'courses/togglePublished',
  async (id, { rejectWithValue }) => {
    try {
      const course = unwrapCourse(await courseApi.togglePublished(id))
      if (!course) return rejectWithValue('Unable to update published status.')
      return course
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

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearCourseFeedback(state) {
      state.status = 'idle'
      state.request = ''
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, pending)
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = null
        state.items = action.payload.items
        state.pagination = action.payload.pagination
      })
      .addCase(fetchCourses.rejected, rejected)
      .addCase(fetchCourseById.pending, pending)
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = null
        state.current = action.payload
        replaceCourse(state, action.payload)
      })
      .addCase(fetchCourseById.rejected, rejected)
      .addCase(createCourse.pending, pending)
      .addCase(createCourse.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = null
        state.items.unshift(action.payload)
        state.pagination.total += 1
      })
      .addCase(createCourse.rejected, rejected)
      .addCase(updateCourse.pending, pending)
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = null
        replaceCourse(state, action.payload)
      })
      .addCase(updateCourse.rejected, rejected)
      .addCase(deleteCourse.pending, pending)
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = null
        state.items = state.items.filter((item) => item.id !== action.payload)
        if (state.current?.id === action.payload) state.current = null
        state.pagination.total = Math.max(0, state.pagination.total - 1)
      })
      .addCase(deleteCourse.rejected, rejected)
      .addCase(toggleCourseStatus.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = null
        replaceCourse(state, action.payload)
      })
      .addCase(toggleCourseStatus.rejected, rejected)
      .addCase(toggleCourseFeatured.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = null
        replaceCourse(state, action.payload)
      })
      .addCase(toggleCourseFeatured.rejected, rejected)
      .addCase(toggleCoursePublished.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = null
        replaceCourse(state, action.payload)
      })
      .addCase(toggleCoursePublished.rejected, rejected)
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

export const { clearCourseFeedback } = coursesSlice.actions
export default coursesSlice.reducer
