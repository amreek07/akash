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
    label: 'Categories',
    to: paths.categories,
    icon: 'categories',
    description: 'Course categories',
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
    description: 'Site content',
  },
  {
    label: 'Notifications',
    to: paths.notifications,
    icon: 'bell',
    description: 'Admin alerts',
  },
  {
    label: 'Profile',
    to: paths.profile,
    icon: 'user',
    description: 'Administrator profile',
  },
]
