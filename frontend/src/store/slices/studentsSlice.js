import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { studentApi } from '@/api/studentApi'
import { getErrorMessage } from '@/utils/apiError'

const emptyPagination = {
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
}

function toRelation(item) {
  if (!item || typeof item !== 'object') return null
  const id = String(item.id || item._id || '')
  if (!id) return null
  return item
}

export function toStudent(item) {
  if (!item) return null
  const course = toRelation(item.course)
  const reference = toRelation(item.reference)
  return {
    id: String(item.id || item._id || ''),
    uuid: item.uuid || '',
    name: item.name || '',
    fatherName: item.fatherName || '',
    dob: item.dob || '',
    contact: item.contact || '',
    email: item.email || '',
    course: course
      ? {
          id: String(course.id || course._id || ''),
          title: course.title || '',
        }
      : null,
    reference: reference
      ? {
          id: String(reference.id || reference._id || ''),
          partnerId: reference.partnerId || '',
          name: reference.name || '',
        }
      : null,
    enrollmentDate: item.enrollmentDate || '',
    courseCompletionDate: item.courseCompletionDate || '',
    semesterFees: Array.isArray(item.semesterFees)
      ? item.semesterFees.map((fee) => ({
          id: String(fee.id || fee._id || ''),
          semester: fee.semester ?? '',
          amount: fee.amount ?? '',
          paidAmount: fee.paidAmount ?? 0,
          currency: fee.currency || 'INR',
          dueDate: fee.dueDate || '',
          paidDate: fee.paidDate || '',
          status: fee.status || 'pending',
        }))
      : [],
    createdAt: item.createdAt || null,
    updatedAt: item.updatedAt || null,
  }
}

function unwrapStudent(data) {
  return toStudent(data?.student || data)
}

function listKey(arg = {}) {
  return `${arg.search || ''}|${arg.course || ''}|${arg.reference || ''}`
}

export const fetchStudents = createAsyncThunk(
  'students/fetchAll',
  async ({ page = 1, limit = 20, search = '', course, reference } = {}, { rejectWithValue }) => {
    try {
      const data = await studentApi.list({
        page,
        limit,
        search: search || undefined,
        course: course || undefined,
        reference: reference || undefined,
      })
      const list = Array.isArray(data?.students) ? data.students : Array.isArray(data) ? data : []
      return {
        items: list.map(toStudent).filter(Boolean),
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

export const fetchStudentById = createAsyncThunk('students/fetchById', async (id, { rejectWithValue }) => {
  try {
    const data = await studentApi.getById(id)
    const student = unwrapStudent(data)
    if (!student?.id) {
      return rejectWithValue('This student was not found.')
    }
    return student
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

export const createStudent = createAsyncThunk('students/create', async (payload, { rejectWithValue }) => {
  try {
    const data = await studentApi.create(payload)
    const student = unwrapStudent(data)
    if (!student?.id) {
      return rejectWithValue('Student was created, but the server did not return it.')
    }
    return student
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

export const updateStudent = createAsyncThunk('students/update', async ({ id, ...payload }, { rejectWithValue }) => {
  try {
    const data = await studentApi.update(id, payload)
    const student = unwrapStudent(data)
    if (!student?.id) {
      return rejectWithValue('Student was updated, but the server did not return it.')
    }
    return student
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

export const deleteStudent = createAsyncThunk('students/delete', async (id, { rejectWithValue }) => {
  try {
    await studentApi.remove(id)
    return id
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

const initialState = {
  items: [],
  current: null,
  pagination: emptyPagination,
  listKey: '',
  status: 'idle',
  request: '',
  error: null,
}

const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    clearStudentFeedback(state) {
      state.status = 'idle'
      state.request = ''
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state, action) => {
        const page = Number(action.meta.arg?.page) || 1
        if (page <= 1) state.listKey = listKey(action.meta.arg)
        pending(state, action)
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        if (listKey(action.meta.arg) !== state.listKey) return
        state.status = 'succeeded'
        state.error = null
        const page = Number(action.meta.arg?.page) || 1
        if (page <= 1) {
          state.items = action.payload.items
        } else {
          const seen = new Set(state.items.map((item) => item.id))
          action.payload.items.forEach((item) => {
            if (!seen.has(item.id)) state.items.push(item)
          })
        }
        state.pagination = action.payload.pagination
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        if (state.listKey && listKey(action.meta.arg) !== state.listKey) return
        rejected(state, action)
      })
      .addCase(fetchStudentById.pending, pending)
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = null
        state.current = action.payload
        const index = state.items.findIndex((item) => item.id === action.payload.id)
        if (index >= 0) state.items[index] = action.payload
      })
      .addCase(fetchStudentById.rejected, rejected)
      .addCase(createStudent.pending, pending)
      .addCase(createStudent.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = null
        state.current = action.payload
        state.items.unshift(action.payload)
        state.pagination.total += 1
      })
      .addCase(createStudent.rejected, rejected)
      .addCase(updateStudent.pending, pending)
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = null
        state.current = action.payload
        const index = state.items.findIndex((item) => item.id === action.payload.id)
        if (index >= 0) state.items[index] = action.payload
      })
      .addCase(updateStudent.rejected, rejected)
      .addCase(deleteStudent.pending, pending)
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = null
        state.items = state.items.filter((item) => item.id !== action.payload)
        if (state.current?.id === action.payload) state.current = null
        state.pagination.total = Math.max(0, state.pagination.total - 1)
        state.pagination.hasNextPage = state.items.length < state.pagination.total
      })
      .addCase(deleteStudent.rejected, rejected)
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

export const { clearStudentFeedback } = studentsSlice.actions
export default studentsSlice.reducer
