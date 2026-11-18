import api from '@/api/axiosInstance'
import { endpoints } from '@/api/endpoints'

function unwrap(response) {
  const body = response?.data
  if (body && typeof body === 'object' && Object.prototype.hasOwnProperty.call(body, 'data')) {
    return body.data
  }
  return body
}

export const studentApi = {
  list(params) {
    return api.get(endpoints.students, { params }).then(unwrap)
  },
  getById(id) {
    return api.get(endpoints.student(id)).then(unwrap)
  },
  create(payload) {
    return api.post(endpoints.students, payload).then(unwrap)
  },
  update(id, payload) {
    return api.put(endpoints.student(id), payload).then(unwrap)
  },
  remove(id) {
    return api.delete(endpoints.student(id)).then(unwrap)
  },
}
