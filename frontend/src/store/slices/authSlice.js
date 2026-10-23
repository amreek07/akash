import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authApi } from '@/api/authApi'
import { tokenStorage } from '@/utils/tokenStorage'
import { emptyRecovery, recoveryStorage } from '@/utils/recoveryStorage'
import { getErrorMessage } from '@/utils/apiError'

const session = tokenStorage.getSession()

function toAdmin(user = {}) {
  return {
    id: user.id || user._id || '',
    fullName: user.fullName || user.name || 'Administrator',
    email: user.email || '',
    role: user.role || '',
    countryCode: user.countryCode || '',
    phone: user.phone || '',
  }
}

function saveRecovery(recovery) {
  recoveryStorage.write(recovery)
  return recovery
}

function normalizeEmail(email) {
  return email.trim().toLowerCase()
}

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const normalizedEmail = normalizeEmail(email)
      await authApi.login({ email: normalizedEmail, password })
      return saveRecovery({
        email: normalizedEmail,
        purpose: 'login',
        otpVerified: false,
      })
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const verifyLoginOtp = createAsyncThunk(
  'auth/verifyLoginOtp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const data = await authApi.verifyOtp({ email: normalizeEmail(email), otp: String(otp).trim() })
      const user = toAdmin(data?.user)
      if (user.role !== 'admin') {
        tokenStorage.clear()
        return rejectWithValue('This panel is only available to administrators.')
      }

      const accessToken = data?.token?.accessToken || data?.accessToken
      const refreshToken = data?.token?.refreshToken || data?.refreshToken
      if (!accessToken) {
        return rejectWithValue('Verification succeeded, but no access token was returned.')
      }

      tokenStorage.setSession({ accessToken, refreshToken, user })
      recoveryStorage.clear()
      return { user, accessToken, refreshToken: refreshToken || null }
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const forgetPassword = createAsyncThunk(
  'auth/forgetPassword',
  async ({ email }, { rejectWithValue }) => {
    try {
      const normalizedEmail = normalizeEmail(email)
      await authApi.forgetPassword({ email: normalizedEmail })
      return saveRecovery({
        email: normalizedEmail,
        purpose: 'reset',
        otpVerified: false,
      })
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const verifyResetOtp = createAsyncThunk(
  'auth/verifyResetOtp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      await authApi.verifyResetOtp({ email: normalizeEmail(email), otp: String(otp).trim() })
      return saveRecovery({
        email: normalizeEmail(email),
        purpose: 'reset',
        otpVerified: true,
      })
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      await authApi.resetPassword({ email: normalizeEmail(email), newPassword: password })
      recoveryStorage.clear()
      return true
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      await authApi.changePassword({ oldPassword, newPassword })
      return true
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const resendOtp = createAsyncThunk(
  'auth/resendOtp',
  async ({ email, purpose }, { rejectWithValue }) => {
    try {
      if (purpose === 'reset') {
        await authApi.forgetPassword({ email: normalizeEmail(email) })
      } else {
        await authApi.resendOtp({ email: normalizeEmail(email) })
      }
      return true
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const logout = createAsyncThunk('auth/logout', async (_, { getState, dispatch }) => {
  const refreshToken = getState().auth.refreshToken
  dispatch(clearSession())
  try {
    if (refreshToken) {
      await authApi.logout({ refreshToken })
    }
  } catch {
    // The local session ends even when the server is unreachable.
  }
})

const initialState = {
  user: session.user,
  accessToken: session.accessToken,
  refreshToken: session.refreshToken,
  isAuthenticated: Boolean(session.accessToken),
  status: 'idle',
  request: '',
  error: null,
  resendStatus: 'idle',
  resendMessage: '',
  recovery: recoveryStorage.read(),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthFeedback(state) {
      state.status = 'idle'
      state.request = ''
      state.error = null
      state.resendStatus = 'idle'
      state.resendMessage = ''
    },
    clearRecovery(state) {
      recoveryStorage.clear()
      state.recovery = { ...emptyRecovery }
    },
    updateTokens(state, action) {
      state.accessToken = action.payload.accessToken
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken
      }
      state.isAuthenticated = Boolean(state.accessToken)
    },
    clearSession(state) {
      tokenStorage.clear()
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.status = 'idle'
      state.error = null
    },
    profileUpdated(state, action) {
      state.user = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, pending)
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = null
        state.recovery = action.payload
      })
      .addCase(login.rejected, rejected)
      .addCase(verifyLoginOtp.pending, pending)
      .addCase(verifyLoginOtp.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = null
        state.user = action.payload.user
        state.accessToken = action.payload.accessToken
        state.refreshToken = action.payload.refreshToken
        state.isAuthenticated = true
        state.recovery = { ...emptyRecovery }
      })
      .addCase(verifyLoginOtp.rejected, rejected)
      .addCase(forgetPassword.pending, pending)
      .addCase(forgetPassword.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = null
        state.recovery = action.payload
      })
      .addCase(forgetPassword.rejected, rejected)
      .addCase(verifyResetOtp.pending, pending)
      .addCase(verifyResetOtp.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = null
        state.recovery = action.payload
      })
      .addCase(verifyResetOtp.rejected, rejected)
      .addCase(resetPassword.pending, pending)
      .addCase(resetPassword.fulfilled, (state) => {
        state.status = 'succeeded'
        state.error = null
        state.recovery = { ...emptyRecovery }
      })
      .addCase(resetPassword.rejected, rejected)
      .addCase(changePassword.pending, pending)
      .addCase(changePassword.fulfilled, (state) => {
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(changePassword.rejected, rejected)
      .addCase(resendOtp.pending, (state) => {
        state.resendStatus = 'loading'
        state.resendMessage = ''
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.resendStatus = 'succeeded'
        state.resendMessage = 'A new code has been sent.'
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.resendStatus = 'failed'
        state.resendMessage = action.payload || 'Unable to resend the code.'
      })
  },
})

function pending(state, action) {
  state.status = 'loading'
  state.request = action.type
  state.error = null
}

function rejected(state, action) {
  state.status = 'failed'
  state.request = action.type
  state.error = action.payload || 'Request failed'
}

export const { clearAuthFeedback, clearRecovery, updateTokens, clearSession, profileUpdated } = authSlice.actions

export function saveProfile(profile) {
  return (dispatch, getState) => {
    const { user, accessToken, refreshToken } = getState().auth
    const nextUser = {
      ...user,
      fullName: profile.fullName,
      email: profile.email,
      countryCode: profile.countryCode,
      phone: profile.phone,
    }
    if (accessToken) {
      tokenStorage.setSession({ accessToken, refreshToken, user: nextUser })
    }
    dispatch(profileUpdated(nextUser))
  }
}

export default authSlice.reducer
