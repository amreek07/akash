import api from '@/api/axiosInstance'
import { endpoints } from '@/api/endpoints'

function unwrap(response) {
  const body = response?.data
  if (body && typeof body === 'object' && Object.prototype.hasOwnProperty.call(body, 'data')) {
    return body.data
  }
  return body
}

export const categoryApi = {
  list(params) {
    return api.get(endpoints.categories, { params }).then(unwrap)
  },
  getById(id) {
    return api.get(endpoints.category(id)).then(unwrap)
  },
  create(payload) {
    return api.post(endpoints.categories, payload).then(unwrap)
  },
  update(id, payload) {
    return api.put(endpoints.category(id), payload).then(unwrap)
  },
  remove(id) {
    return api.delete(endpoints.category(id)).then(unwrap)
  },
}
