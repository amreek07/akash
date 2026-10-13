import api from '@/api/axiosInstance'
import { endpoints } from '@/api/endpoints'

function unwrap(response) {
  const body = response?.data
  if (body && typeof body === 'object' && Object.prototype.hasOwnProperty.call(body, 'data')) {
    return body.data
  }
  return body
}

export const authApi = {
  login(payload) {
    return api.post(endpoints.login, payload).then(unwrap)
  },
  verifyOtp(payload) {
    return api.post(endpoints.verifyOtp, payload).then(unwrap)
  },
  resendOtp(payload) {
    return api.post(endpoints.resendOtp, payload).then(unwrap)
  },
  forgetPassword(payload) {
    return api.post(endpoints.forgetPassword, payload).then(unwrap)
  },
  verifyResetOtp(payload) {
    return api.post(endpoints.verifyResetOtp, payload).then(unwrap)
  },
  resetPassword(payload) {
    return api.post(endpoints.resetPassword, payload).then(unwrap)
  },
  logout(payload) {
    return api.post(endpoints.logout, payload).then(unwrap)
  },
}
