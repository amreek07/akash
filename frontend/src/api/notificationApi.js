import api from '@/api/axiosInstance'
import { endpoints } from '@/api/endpoints'

function unwrap(response) {
  const body = response?.data
  if (body && typeof body === 'object' && Object.prototype.hasOwnProperty.call(body, 'data')) {
    return body.data
  }
  return body
}

export const notificationApi = {
  list(params) {
    return api.get(endpoints.notifications, { params }).then(unwrap)
  },
  getById(id) {
    return api.get(endpoints.notification(id)).then(unwrap)
  },
  markAsRead(id) {
    return api.patch(endpoints.notificationRead(id)).then(unwrap)
  },
  markAllAsRead() {
    return api.patch(endpoints.notificationsReadAll).then(unwrap)
  },
  remove(id) {
    return api.delete(endpoints.notification(id)).then(unwrap)
  },
}
