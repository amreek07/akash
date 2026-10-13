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
  content: '/content/general',
  contentGeneral: '/content/general',
  contentAbout: '/content/about',
  contentGallery: '/content/gallery',
  contentFooter: '/content/footer',
  galleryNew: '/content/gallery/new',
  galleryEdit: (id) => `/content/gallery/${id}/edit`,
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
  [paths.contentGeneral]: 'General',
  [paths.contentAbout]: 'About us',
  [paths.contentGallery]: 'Gallery',
  [paths.galleryNew]: 'Add image',
  [paths.contentFooter]: 'Footer',
}

export function resolvePageTitle(pathname) {
  if (pageTitles[pathname]) return pageTitles[pathname]
  if (pathname === paths.courseNew) return 'Add course'
  if (/^\/courses\/[^/]+\/edit$/.test(pathname)) return 'Edit course'
  if (/^\/courses\/[^/]+$/.test(pathname)) return 'Course details'
  if (/^\/responses\/(registrations|enquiries)\/[^/]+$/.test(pathname)) return 'Response details'
  if (/^\/content\/gallery\/[^/]+\/edit$/.test(pathname)) return 'Edit image'
  return 'Coding Hubs Institute'
}
