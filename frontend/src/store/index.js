import { configureStore } from '@reduxjs/toolkit'
import authReducer, { clearSession, updateTokens } from '@/store/slices/authSlice'
import categoriesReducer from '@/store/slices/categoriesSlice'
import coursesReducer from '@/store/slices/coursesSlice'
import contentReducer, { saveContentPreview } from '@/store/slices/contentSlice'
import partnersReducer, { savePartnersPreview } from '@/store/slices/partnersSlice'
import responsesReducer from '@/store/slices/responsesSlice'
import { bindAuthHandlers } from '@/api/axiosInstance'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: coursesReducer,
    categories: categoriesReducer,
    partners: partnersReducer,
    content: contentReducer,
    responses: responsesReducer,
  },
})

store.subscribe(() => {
  savePartnersPreview(store.getState().partners)
  saveContentPreview(store.getState().content)
})

bindAuthHandlers({
  onSessionUpdate: (tokens) => store.dispatch(updateTokens(tokens)),
  onSessionEnd: () => store.dispatch(clearSession()),
})
