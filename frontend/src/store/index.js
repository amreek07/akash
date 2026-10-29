import { configureStore } from '@reduxjs/toolkit'
import authReducer, { clearSession, updateTokens } from '@/store/slices/authSlice'
import categoriesReducer from '@/store/slices/categoriesSlice'
import coursesReducer from '@/store/slices/coursesSlice'
import contentReducer, { saveContentPreview } from '@/store/slices/contentSlice'
import partnersReducer from '@/store/slices/partnersSlice'
import responsesReducer from '@/store/slices/responsesSlice'
import notificationsReducer from '@/store/slices/notificationsSlice'
import dashboardReducer from '@/store/slices/dashboardSlice'
import { bindAuthHandlers } from '@/api/axiosInstance'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: coursesReducer,
    categories: categoriesReducer,
    partners: partnersReducer,
    content: contentReducer,
    responses: responsesReducer,
    notifications: notificationsReducer,
    dashboard: dashboardReducer,
  },
})

store.subscribe(() => {
  saveContentPreview(store.getState().content)
})

bindAuthHandlers({
  onSessionUpdate: (tokens) => store.dispatch(updateTokens(tokens)),
  onSessionEnd: () => store.dispatch(clearSession()),
})
