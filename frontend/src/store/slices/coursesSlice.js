import { createSlice } from '@reduxjs/toolkit'
import { defaultCourseTypes, seedCourses } from '@/constants/courses'

const STORAGE_KEY = 'admin.courses.preview'

function loadPreview() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed.items) || !Array.isArray(parsed.types)) return null
    return parsed
  } catch {
    return null
  }
}

export function saveCoursePreview(state) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ items: state.items, types: state.types }))
  } catch {
    // The in-memory catalogue still updates for this visit.
  }
}

function rememberType(state, type) {
  const next = type.trim()
  if (!next) return
  const exists = state.types.some((item) => item.toLowerCase() === next.toLowerCase())
  if (!exists) state.types.push(next)
}

const coursesSlice = createSlice({
  name: 'courses',
  initialState: loadPreview() || {
    items: seedCourses,
    types: defaultCourseTypes,
  },
  reducers: {
    addCourse(state, action) {
      state.items.unshift(action.payload)
      rememberType(state, action.payload.type)
    },
    updateCourse(state, action) {
      const index = state.items.findIndex((course) => course.id === action.payload.id)
      if (index >= 0) state.items[index] = action.payload
      rememberType(state, action.payload.type)
    },
    deleteCourse(state, action) {
      state.items = state.items.filter((course) => course.id !== action.payload)
    },
  },
})

export const { addCourse, updateCourse, deleteCourse } = coursesSlice.actions
export default coursesSlice.reducer
