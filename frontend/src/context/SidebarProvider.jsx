import { useCallback, useMemo, useState } from 'react'
import { SidebarStateContext } from '@/context/sidebarState'

export function SidebarProvider({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleCollapsed = useCallback(() => setCollapsed((current) => !current), [])
  const openMobile = useCallback(() => setMobileOpen(true), [])
  const closeMobile = useCallback(() => setMobileOpen(false), [])

  const value = useMemo(
    () => ({
      collapsed,
      mobileOpen,
      toggleCollapsed,
      openMobile,
      closeMobile,
    }),
    [collapsed, mobileOpen, toggleCollapsed, openMobile, closeMobile],
  )

  return <SidebarStateContext.Provider value={value}>{children}</SidebarStateContext.Provider>
}
