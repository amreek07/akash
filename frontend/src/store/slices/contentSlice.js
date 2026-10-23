import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { footerApi } from '@/api/footerApi'
import { seedAbout, seedFooter, seedGallery, seedGeneral } from '@/constants/content'
import { getErrorMessage } from '@/utils/apiError'

const STORAGE_KEY = 'admin.content.preview'

export function toFooter(item) {
  const source = item || seedFooter
  return {
    id: String(source.id || source._id || ''),
    instituteName: source.instituteName || '',
    tagline: source.tagline || '',
    quickLinks: (source.quickLinks || []).map((link, index) => ({
      id: String(link.id || link._id || `ql-${index}`),
      label: link.label || '',
      href: link.href || '',
    })),
    popularCourses: (source.popularCourses || []).map((course, index) => ({
      id: String(course.id || course._id || `pc-${index}`),
      label: course.label || '',
      href: course.href || '',
    })),
    address: source.address || '',
    phone: source.phone || '',
    email: source.email || '',
    facebook: source.facebook || '',
    instagram: source.instagram || '',
    youtube: source.youtube || '',
    copyright: source.copyright || seedFooter.copyright,
  }
}

function unwrapFooter(data) {
  return toFooter(data?.footer || data)
}

function loadPreview() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed.gallery) || !parsed.footer) return null
    return {
      gallery: parsed.gallery,
      footer: toFooter(parsed.footer),
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

export const fetchFooter = createAsyncThunk('content/fetchFooter', async (_, { rejectWithValue }) => {
  try {
    const data = await footerApi.get()
    const footer = unwrapFooter(data)
    if (!footer.instituteName && !footer.id) {
      return rejectWithValue('Footer content was not returned by the server.')
    }
    return footer
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

export const updateFooter = createAsyncThunk('content/updateFooter', async (payload, { rejectWithValue }) => {
  try {
    const data = await footerApi.update(payload)
    const footer = unwrapFooter(data)
    if (!footer.instituteName && !footer.id) {
      return rejectWithValue('Footer was saved, but the server did not return it.')
    }
    return footer
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

const preview = loadPreview()

const contentSlice = createSlice({
  name: 'content',
  initialState: {
    gallery: preview?.gallery || seedGallery,
    footer: preview?.footer || seedFooter,
    general: preview?.general || seedGeneral,
    about: preview?.about || seedAbout,
    footerStatus: 'idle',
    footerRequest: '',
    footerError: null,
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
      state.footer = toFooter(action.payload)
    },
    saveGeneral(state, action) {
      state.general = action.payload
    },
    saveAbout(state, action) {
      state.about = action.payload
    },
    clearFooterFeedback(state) {
      state.footerError = null
      if (state.footerStatus !== 'loading') state.footerStatus = 'idle'
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFooter.pending, (state, action) => {
        state.footerStatus = 'loading'
        state.footerRequest = action.type
        state.footerError = null
      })
      .addCase(fetchFooter.fulfilled, (state, action) => {
        state.footerStatus = 'succeeded'
        state.footerRequest = action.type
        state.footer = action.payload
        state.footerError = null
      })
      .addCase(fetchFooter.rejected, (state, action) => {
        state.footerStatus = 'failed'
        state.footerRequest = action.type
        state.footerError = action.payload || 'Unable to load footer content.'
      })
      .addCase(updateFooter.pending, (state, action) => {
        state.footerStatus = 'loading'
        state.footerRequest = action.type
        state.footerError = null
      })
      .addCase(updateFooter.fulfilled, (state, action) => {
        state.footerStatus = 'succeeded'
        state.footerRequest = action.type
        state.footer = action.payload
        state.footerError = null
      })
      .addCase(updateFooter.rejected, (state, action) => {
        state.footerStatus = 'failed'
        state.footerRequest = action.type
        state.footerError = action.payload || 'Unable to save footer content.'
      })
  },
})

export const {
  addGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  saveFooter,
  saveGeneral,
  saveAbout,
  clearFooterFeedback,
} = contentSlice.actions
export default contentSlice.reducer
