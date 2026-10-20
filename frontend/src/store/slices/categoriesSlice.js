import { createSlice } from '@reduxjs/toolkit'
import { seedCategories } from '@/constants/categories'

const STORAGE_KEY = 'admin.categories.preview'

function loadPreview() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed.items)) return null
    return parsed
  } catch {
    return null
  }
}

export function saveCategoriesPreview(state) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ items: state.items }))
  } catch {
    // The in-memory catalogue still updates for this visit.
  }
}

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: loadPreview() || {
    items: seedCategories,
  },
  reducers: {
    addCategory(state, action) {
      state.items.unshift(action.payload)
    },
    updateCategory(state, action) {
      const index = state.items.findIndex((category) => category.id === action.payload.id)
      if (index >= 0) state.items[index] = action.payload
    },
    deleteCategory(state, action) {
      state.items = state.items.filter((category) => category.id !== action.payload)
    },
  },
})

export const { addCategory, updateCategory, deleteCategory } = categoriesSlice.actions
export default categoriesSlice.reducer
