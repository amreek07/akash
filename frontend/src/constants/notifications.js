export const notificationRecords = [
  {
    id: 'n1',
    title: 'New course registration',
    message: 'Meera Joshi registered for Diploma in Computer Applications.',
    type: 'registration',
    createdAt: '2026-10-15T09:20:00',
    read: false,
  },
  {
    id: 'n2',
    title: 'Partner request pending',
    message: 'Skill India asked to renew the active partnership for 2026-27.',
    type: 'partner',
    createdAt: '2026-10-14T16:40:00',
    read: false,
  },
  {
    id: 'n3',
    title: 'Enquiry received',
    message: 'Ananya Iyer asked about weekend batches for Bachelor of Computer Applications.',
    type: 'enquiry',
    createdAt: '2026-10-14T11:05:00',
    read: false,
  },
  {
    id: 'n4',
    title: 'Course catalogue updated',
    message: 'Web Design Certificate fee offer was saved in the catalogue.',
    type: 'course',
    createdAt: '2026-10-13T18:22:00',
    read: true,
  },
  {
    id: 'n5',
    title: 'Profile change saved',
    message: 'Administrator phone details were updated from the profile panel.',
    type: 'profile',
    createdAt: '2026-10-12T08:15:00',
    read: true,
  },
  {
    id: 'n6',
    title: 'New registration',
    message: 'Arjun Patel registered for Bachelor of Computer Applications.',
    type: 'registration',
    createdAt: '2026-10-11T14:50:00',
    read: true,
  },
]

export function unreadNotificationCount(records = notificationRecords) {
  return records.filter((item) => !item.read).length
}
