import { configureStore } from '@reduxjs/toolkit'
import authReducer, { clearSession, updateTokens } from '@/store/slices/authSlice'
import coursesReducer, { saveCoursePreview } from '@/store/slices/coursesSlice'
import { bindAuthHandlers } from '@/api/axiosInstance'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: coursesReducer,
  },
})

store.subscribe(() => {
  saveCoursePreview(store.getState().courses)
})

bindAuthHandlers({
  onSessionUpdate: (tokens) => store.dispatch(updateTokens(tokens)),
  onSessionEnd: () => store.dispatch(clearSession()),
})
