import { useContext } from 'react'
import { SidebarStateContext } from '@/context/sidebarState'

export function useSidebar() {
  const context = useContext(SidebarStateContext)
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider')
  }
  return context
}
