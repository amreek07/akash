export const paths = {
  root: '/',
  login: '/login',
  forgetPassword: '/forget-password',
  verifyOtp: '/verify-otp',
  resetPassword: '/reset-password',
  dashboard: '/dashboard',
  courses: '/courses',
  courseNew: '/courses/new',
  courseDetails: (id) => `/courses/${id}`,
  courseEdit: (id) => `/courses/${id}/edit`,
}

export const pageTitles = {
  [paths.login]: 'Sign in',
  [paths.forgetPassword]: 'Forget password',
  [paths.verifyOtp]: 'Verify code',
  [paths.resetPassword]: 'Reset password',
  [paths.dashboard]: 'Dashboard',
  [paths.courses]: 'Courses',
}

export function resolvePageTitle(pathname) {
  if (pageTitles[pathname]) return pageTitles[pathname]
  if (pathname === paths.courseNew) return 'Add course'
  if (/^\/courses\/[^/]+\/edit$/.test(pathname)) return 'Edit course'
  if (/^\/courses\/[^/]+$/.test(pathname)) return 'Course details'
  return 'Admin'
}
