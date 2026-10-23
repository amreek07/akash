import { instituteName } from '@/constants/content'

export const appConfig = {
  appName: instituteName,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  apiTimeout: 20000,
}
