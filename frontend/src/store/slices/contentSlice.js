import { createSlice } from '@reduxjs/toolkit'
import { seedAbout, seedFooter, seedGallery, seedGeneral } from '@/constants/content'

const STORAGE_KEY = 'admin.content.preview'

function loadPreview() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed.gallery) || !parsed.footer) return null
    return {
      gallery: parsed.gallery,
      footer: parsed.footer,
      general: parsed.general || seedGeneral,
      about: parsed.about || seedAbout,
    }
  } catch {
    return null
  }
}

export function saveContentPreview(state) {
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        gallery: state.gallery,
        footer: state.footer,
        general: state.general,
        about: state.about,
      }),
    )
  } catch {
    // Large image previews stay in memory for this visit.
  }
}

const contentSlice = createSlice({
  name: 'content',
  initialState: loadPreview() || {
    gallery: seedGallery,
    footer: seedFooter,
    general: seedGeneral,
    about: seedAbout,
  },
  reducers: {
    addGalleryImage(state, action) {
      state.gallery.unshift(action.payload)
    },
    updateGalleryImage(state, action) {
      const index = state.gallery.findIndex((item) => item.id === action.payload.id)
      if (index >= 0) state.gallery[index] = action.payload
    },
    deleteGalleryImage(state, action) {
      state.gallery = state.gallery.filter((item) => item.id !== action.payload)
    },
    saveFooter(state, action) {
      state.footer = action.payload
    },
    saveGeneral(state, action) {
      state.general = action.payload
    },
    saveAbout(state, action) {
      state.about = action.payload
    },
  },
})

export const { addGalleryImage, updateGalleryImage, deleteGalleryImage, saveFooter, saveGeneral, saveAbout } =
  contentSlice.actions
export default contentSlice.reducer
