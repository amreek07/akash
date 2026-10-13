import { paths } from '@/routes/paths'

export const adminNavigation = [
  {
    label: 'Dashboard',
    to: paths.dashboard,
    icon: 'dashboard',
    description: 'Administrator overview',
  },
  {
    label: 'Courses',
    to: paths.courses,
    icon: 'courses',
    description: 'Course catalogue',
  },
  {
    label: 'Responses',
    to: '/responses',
    icon: 'inbox',
    description: 'Registrations and enquiries',
  },
  {
    label: 'Content',
    to: '/content',
    icon: 'content',
    description: 'Gallery and footer',
  },
  {
    label: 'Profile',
    to: paths.profile,
    icon: 'user',
    description: 'Administrator profile',
  },
]
