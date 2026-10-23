import api from '@/api/axiosInstance'
import { endpoints } from '@/api/endpoints'

function unwrap(response) {
  const body = response?.data
  if (body && typeof body === 'object' && Object.prototype.hasOwnProperty.call(body, 'data')) {
    return body.data
  }
  return body
}

export const courseApi = {
  list(params) {
    return api.get(endpoints.courses, { params }).then(unwrap)
  },
  getById(id) {
    return api.get(endpoints.course(id)).then(unwrap)
  },
  create(payload) {
    return api.post(endpoints.courses, payload).then(unwrap)
  },
  update(id, payload) {
    return api.put(endpoints.course(id), payload).then(unwrap)
  },
  remove(id) {
    return api.delete(endpoints.course(id)).then(unwrap)
  },
  toggleStatus(id) {
    return api.patch(endpoints.course(id)).then(unwrap)
  },
  toggleFeatured(id) {
    return api.patch(endpoints.courseFeatured(id)).then(unwrap)
  },
  togglePublished(id) {
    return api.patch(endpoints.coursePublished(id)).then(unwrap)
  },
}
