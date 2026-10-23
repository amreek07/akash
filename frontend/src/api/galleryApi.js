import api from '@/api/axiosInstance'
import { endpoints } from '@/api/endpoints'

function unwrap(response) {
  const body = response?.data
  if (body && typeof body === 'object' && Object.prototype.hasOwnProperty.call(body, 'data')) {
    return body.data
  }
  return body
}

export const galleryApi = {
  list(params) {
    return api.get(endpoints.gallery, { params }).then(unwrap)
  },
  getById(id) {
    return api.get(endpoints.galleryItem(id)).then(unwrap)
  },
  create(payload) {
    return api.post(endpoints.gallery, payload).then(unwrap)
  },
  update(id, payload) {
    return api.put(endpoints.galleryItem(id), payload).then(unwrap)
  },
  remove(id) {
    return api.delete(endpoints.galleryItem(id)).then(unwrap)
  },
}
