export const appConfig = {
  appName: import.meta.env.VITE_APP_NAME || 'Admin Panel',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  apiTimeout: 20000,
  previewAuth: import.meta.env.VITE_PREVIEW_AUTH !== 'false',
}
