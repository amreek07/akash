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
  profile: '/profile',
  profileEdit: '/profile/edit',
  changePassword: '/profile/change-password',
  responses: '/responses/registrations',
  responseTab: (kind) => `/responses/${kind}`,
  responseDetails: (kind, id) => `/responses/${kind}/${id}`,
}

export const pageTitles = {
  [paths.login]: 'Sign in',
  [paths.forgetPassword]: 'Forget password',
  [paths.verifyOtp]: 'Verify code',
  [paths.resetPassword]: 'Reset password',
  [paths.dashboard]: 'Dashboard',
  [paths.courses]: 'Courses',
  [paths.profile]: 'Profile',
  [paths.profileEdit]: 'Edit profile',
  [paths.changePassword]: 'Change password',
  [paths.responses]: 'Responses',
  '/responses/enquiries': 'Responses',
}

export function resolvePageTitle(pathname) {
  if (pageTitles[pathname]) return pageTitles[pathname]
  if (pathname === paths.courseNew) return 'Add course'
  if (/^\/courses\/[^/]+\/edit$/.test(pathname)) return 'Edit course'
  if (/^\/courses\/[^/]+$/.test(pathname)) return 'Course details'
  if (/^\/responses\/(registrations|enquiries)\/[^/]+$/.test(pathname)) return 'Response details'
  return 'Admin'
}
