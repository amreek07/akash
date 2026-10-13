const RECOVERY_KEY = 'admin.recovery'

export const emptyRecovery = {
  email: '',
  purpose: 'login',
  resetToken: '',
}

export const recoveryStorage = {
  read() {
    try {
      const raw = sessionStorage.getItem(RECOVERY_KEY)
      if (!raw) return { ...emptyRecovery }
      return { ...emptyRecovery, ...JSON.parse(raw) }
    } catch {
      return { ...emptyRecovery }
    }
  },
  write(recovery) {
    try {
      sessionStorage.setItem(RECOVERY_KEY, JSON.stringify(recovery))
    } catch {
      // The in-memory recovery state still carries the flow.
    }
  },
  clear() {
    try {
      sessionStorage.removeItem(RECOVERY_KEY)
    } catch {
      // Ignore storage failures.
    }
  },
}
