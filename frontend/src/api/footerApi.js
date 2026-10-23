import api from '@/api/axiosInstance'
import { endpoints } from '@/api/endpoints'

function unwrap(response) {
  const body = response?.data
  if (body && typeof body === 'object' && Object.prototype.hasOwnProperty.call(body, 'data')) {
    return body.data
  }
  return body
}

export const footerApi = {
  get() {
    return api.get(endpoints.footer).then(unwrap)
  },
  update(payload) {
    return api.put(endpoints.footer, payload).then(unwrap)
  },
}
