import axios from 'axios'
import { appConfig } from '@/config/appConfig'
import { endpoints } from '@/api/endpoints'
import { tokenStorage } from '@/utils/tokenStorage'

const api = axios.create({
  baseURL: appConfig.apiBaseUrl,
  timeout: appConfig.apiTimeout,
  headers: {
    Accept: 'application/json',
  },
})

const refreshClient = axios.create({
  baseURL: appConfig.apiBaseUrl,
  timeout: appConfig.apiTimeout,
  headers: {
    Accept: 'application/json',
  },
})

const authHandlers = {
  onSessionUpdate: null,
  onSessionEnd: null,
}

export function bindAuthHandlers(handlers) {
  authHandlers.onSessionUpdate = handlers.onSessionUpdate
  authHandlers.onSessionEnd = handlers.onSessionEnd
}

const publicEndpoints = [
  endpoints.login,
  endpoints.forgetPassword,
  endpoints.verifyOtp,
  endpoints.verifyResetOtp,
  endpoints.resetPassword,
  endpoints.resendOtp,
  endpoints.refresh,
  endpoints.logout,
]

api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  return config
})

let refreshRequest = null

function isPublicRequest(config) {
  const url = config?.url || ''
  return publicEndpoints.some((endpoint) => url.includes(endpoint))
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const status = error.response?.status

    if (status !== 401 || !original || original._retry || isPublicRequest(original)) {
      return Promise.reject(error)
    }

    const refreshToken = tokenStorage.getRefreshToken()
    if (!refreshToken) {
      tokenStorage.clear()
      authHandlers.onSessionEnd?.()
      return Promise.reject(error)
    }

    original._retry = true

    try {
      if (!refreshRequest) {
        refreshRequest = refreshClient
          .post(endpoints.refresh, { refreshToken })
          .then((response) => {
            const payload = response.data?.data ?? response.data ?? {}
            const accessToken = payload.accessToken || payload.token?.accessToken
            const nextRefresh = payload.refreshToken || payload.token?.refreshToken || refreshToken
            if (!accessToken) {
              throw new Error('Refresh did not return an access token')
            }
            tokenStorage.setTokens({ accessToken, refreshToken: nextRefresh })
            authHandlers.onSessionUpdate?.({ accessToken, refreshToken: nextRefresh })
            return accessToken
          })
          .finally(() => {
            refreshRequest = null
          })
      }

      const accessToken = await refreshRequest
      original.headers.Authorization = `Bearer ${accessToken}`
      return api(original)
    } catch (refreshError) {
      tokenStorage.clear()
      authHandlers.onSessionEnd?.()
      return Promise.reject(refreshError)
    }
  },
)

export default api
