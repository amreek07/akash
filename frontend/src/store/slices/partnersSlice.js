import { createSlice } from '@reduxjs/toolkit'
import { seedPartners } from '@/constants/partners'

const STORAGE_KEY = 'admin.partners.preview'

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

export function savePartnersPreview(state) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ items: state.items }))
  } catch {
    // The in-memory list still updates for this visit.
  }
}

const partnersSlice = createSlice({
  name: 'partners',
  initialState: loadPreview() || {
    items: seedPartners,
  },
  reducers: {
    addPartner(state, action) {
      state.items.unshift(action.payload)
    },
    updatePartner(state, action) {
      const index = state.items.findIndex((partner) => partner.id === action.payload.id)
      if (index >= 0) state.items[index] = action.payload
    },
    deletePartner(state, action) {
      state.items = state.items.filter((partner) => partner.id !== action.payload)
    },
  },
})

export const { addPartner, updatePartner, deletePartner } = partnersSlice.actions
export default partnersSlice.reducer
