import { instituteName } from '@/constants/content'

export const appConfig = {
  appName: instituteName,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  apiTimeout: 20000,
  previewAuth: import.meta.env.VITE_PREVIEW_AUTH !== 'false',
}
