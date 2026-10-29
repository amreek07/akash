import api from '@/api/axiosInstance'
import { endpoints } from '@/api/endpoints'

function unwrap(response) {
  const body = response?.data
  if (body && typeof body === 'object' && Object.prototype.hasOwnProperty.call(body, 'data')) {
    return body.data
  }
  return body
}

export const partnerApi = {
  list(params) {
    return api.get(endpoints.partners, { params }).then(unwrap)
  },
  getById(id) {
    return api.get(endpoints.partner(id)).then(unwrap)
  },
  create(payload) {
    return api.post(endpoints.partners, payload).then(unwrap)
  },
  update(id, payload) {
    return api.put(endpoints.partner(id), payload).then(unwrap)
  },
  remove(id) {
    return api.delete(endpoints.partner(id)).then(unwrap)
  },
}
