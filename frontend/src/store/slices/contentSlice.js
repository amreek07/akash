import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { footerApi } from '@/api/footerApi'
import { galleryApi } from '@/api/galleryApi'
import { seedAbout, seedFooter, seedGeneral } from '@/constants/content'
import { getErrorMessage } from '@/utils/apiError'

const STORAGE_KEY = 'admin.content.preview'

const emptyGalleryPagination = {
  total: 0,
  page: 1,
  limit: 50,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
}

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

export function toGalleryItem(item) {
  if (!item) return null
  return {
    id: String(item.id || item._id || ''),
    title: item.title || '',
    image: item.image || '',
  }
}

function unwrapFooter(data) {
  return toFooter(data?.footer || data)
}

function unwrapGalleryItem(data) {
  return toGalleryItem(data?.gallery || data)
}

function fromPreviewGallery(items) {
  if (!Array.isArray(items)) return []
  return items.map(toGalleryItem).filter((item) => item?.id && item.image.startsWith('/uploads/'))
}

function loadPreview() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed.gallery) || !parsed.footer) return null
    return {
      gallery: fromPreviewGallery(parsed.gallery),
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

export const fetchGallery = createAsyncThunk(
  'content/gallery/fetchAll',
  async ({ page = 1, limit = 50 } = {}, { rejectWithValue }) => {
    try {
      const data = await galleryApi.list({ page, limit })
      const list = Array.isArray(data?.gallery) ? data.gallery : Array.isArray(data) ? data : []
      return {
        items: list.map(toGalleryItem).filter(Boolean),
        pagination: data?.pagination || {
          ...emptyGalleryPagination,
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

export const fetchGalleryById = createAsyncThunk('content/gallery/fetchById', async (id, { rejectWithValue }) => {
  try {
    const data = await galleryApi.getById(id)
    const item = unwrapGalleryItem(data)
    if (!item?.id) {
      return rejectWithValue('This image was not found.')
    }
    return item
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

export const createGalleryImage = createAsyncThunk('content/gallery/create', async (payload, { rejectWithValue }) => {
  try {
    const data = await galleryApi.create(payload)
    const item = unwrapGalleryItem(data)
    if (!item?.id) {
      return rejectWithValue('Image was added, but the server did not return it.')
    }
    return item
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

export const updateGalleryImage = createAsyncThunk(
  'content/gallery/update',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const data = await galleryApi.update(id, payload)
      const item = unwrapGalleryItem(data)
      if (!item?.id) {
        return rejectWithValue('Image was updated, but the server did not return it.')
      }
      return item
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const deleteGalleryImage = createAsyncThunk('content/gallery/delete', async (id, { rejectWithValue }) => {
  try {
    await galleryApi.remove(id)
    return id
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

const preview = loadPreview()

const contentSlice = createSlice({
  name: 'content',
  initialState: {
    gallery: preview?.gallery || [],
    galleryCurrent: null,
    galleryPagination: emptyGalleryPagination,
    galleryStatus: 'idle',
    galleryRequest: '',
    galleryError: null,
    footer: preview?.footer || seedFooter,
    general: preview?.general || seedGeneral,
    about: preview?.about || seedAbout,
    footerStatus: 'idle',
    footerRequest: '',
    footerError: null,
  },
  reducers: {
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
    clearGalleryFeedback(state) {
      state.galleryError = null
      if (state.galleryStatus !== 'loading') state.galleryStatus = 'idle'
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
      .addCase(fetchGallery.pending, (state, action) => {
        state.galleryStatus = 'loading'
        state.galleryRequest = action.type
        state.galleryError = null
      })
      .addCase(fetchGallery.fulfilled, (state, action) => {
        state.galleryStatus = 'succeeded'
        state.galleryRequest = action.type
        state.gallery = action.payload.items
        state.galleryPagination = action.payload.pagination
        state.galleryError = null
      })
      .addCase(fetchGallery.rejected, (state, action) => {
        state.galleryStatus = 'failed'
        state.galleryRequest = action.type
        state.galleryError = action.payload || 'Unable to load gallery images.'
      })
      .addCase(fetchGalleryById.pending, (state, action) => {
        state.galleryStatus = 'loading'
        state.galleryRequest = action.type
        state.galleryError = null
      })
      .addCase(fetchGalleryById.fulfilled, (state, action) => {
        state.galleryStatus = 'succeeded'
        state.galleryRequest = action.type
        state.galleryCurrent = action.payload
        state.galleryError = null
        const index = state.gallery.findIndex((item) => item.id === action.payload.id)
        if (index >= 0) state.gallery[index] = action.payload
      })
      .addCase(fetchGalleryById.rejected, (state, action) => {
        state.galleryStatus = 'failed'
        state.galleryRequest = action.type
        state.galleryError = action.payload || 'Unable to load this image.'
      })
      .addCase(createGalleryImage.pending, (state, action) => {
        state.galleryStatus = 'loading'
        state.galleryRequest = action.type
        state.galleryError = null
      })
      .addCase(createGalleryImage.fulfilled, (state, action) => {
        state.galleryStatus = 'succeeded'
        state.galleryRequest = action.type
        state.gallery.unshift(action.payload)
        state.galleryPagination.total += 1
        state.galleryError = null
      })
      .addCase(createGalleryImage.rejected, (state, action) => {
        state.galleryStatus = 'failed'
        state.galleryRequest = action.type
        state.galleryError = action.payload || 'Unable to add this image.'
      })
      .addCase(updateGalleryImage.pending, (state, action) => {
        state.galleryStatus = 'loading'
        state.galleryRequest = action.type
        state.galleryError = null
      })
      .addCase(updateGalleryImage.fulfilled, (state, action) => {
        state.galleryStatus = 'succeeded'
        state.galleryRequest = action.type
        state.galleryCurrent = action.payload
        const index = state.gallery.findIndex((item) => item.id === action.payload.id)
        if (index >= 0) state.gallery[index] = action.payload
        state.galleryError = null
      })
      .addCase(updateGalleryImage.rejected, (state, action) => {
        state.galleryStatus = 'failed'
        state.galleryRequest = action.type
        state.galleryError = action.payload || 'Unable to save this image.'
      })
      .addCase(deleteGalleryImage.pending, (state, action) => {
        state.galleryStatus = 'loading'
        state.galleryRequest = action.type
        state.galleryError = null
      })
      .addCase(deleteGalleryImage.fulfilled, (state, action) => {
        state.galleryStatus = 'succeeded'
        state.galleryRequest = action.type
        state.gallery = state.gallery.filter((item) => item.id !== action.payload)
        if (state.galleryCurrent?.id === action.payload) state.galleryCurrent = null
        state.galleryPagination.total = Math.max(0, state.galleryPagination.total - 1)
        state.galleryError = null
      })
      .addCase(deleteGalleryImage.rejected, (state, action) => {
        state.galleryStatus = 'failed'
        state.galleryRequest = action.type
        state.galleryError = action.payload || 'Unable to delete this image.'
      })
  },
})

export const { saveFooter, saveGeneral, saveAbout, clearFooterFeedback, clearGalleryFeedback } = contentSlice.actions
export default contentSlice.reducer
