import api from '@/api/axiosInstance'
import { endpoints } from '@/api/endpoints'

function unwrap(response) {
  const body = response?.data
  if (body && typeof body === 'object' && Object.prototype.hasOwnProperty.call(body, 'data')) {
    return body.data
  }
  return body
}

export const responseApi = {
  list(params) {
    return api.get(endpoints.responses, { params }).then(unwrap)
  },
  getById(id) {
    return api.get(endpoints.response(id)).then(unwrap)
  },
}
