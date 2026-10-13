const ACCESS_KEY = 'admin.accessToken'
const REFRESH_KEY = 'admin.refreshToken'
const USER_KEY = 'admin.user'

function read(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Storage can be unavailable in private browsing.
  }
}

function remove(key) {
  try {
    localStorage.removeItem(key)
  } catch {
    // Ignore storage failures and keep the in-memory session clear.
  }
}

export const tokenStorage = {
  getAccessToken() {
    return read(ACCESS_KEY)
  },
  getRefreshToken() {
    return read(REFRESH_KEY)
  },
  getUser() {
    const raw = read(USER_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  },
  getSession() {
    return {
      accessToken: read(ACCESS_KEY),
      refreshToken: read(REFRESH_KEY),
      user: this.getUser(),
    }
  },
  setSession({ accessToken, refreshToken, user }) {
    if (accessToken) write(ACCESS_KEY, accessToken)
    if (refreshToken) write(REFRESH_KEY, refreshToken)
    if (user) write(USER_KEY, JSON.stringify(user))
  },
  setTokens({ accessToken, refreshToken }) {
    if (accessToken) write(ACCESS_KEY, accessToken)
    if (refreshToken) write(REFRESH_KEY, refreshToken)
  },
  clear() {
    remove(ACCESS_KEY)
    remove(REFRESH_KEY)
    remove(USER_KEY)
  },
}
