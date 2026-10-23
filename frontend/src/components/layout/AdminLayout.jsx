import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import { SidebarProvider } from '@/context/SidebarProvider'
import { useSidebar } from '@/context/useSidebar'
import { fetchCurrentUser } from '@/store/slices/authSlice'
import { fetchNotifications } from '@/store/slices/notificationsSlice'
import { useAppDispatch } from '@/store/hooks'

function AdminShell() {
  const dispatch = useAppDispatch()
  const { collapsed } = useSidebar()

  useEffect(() => {
    dispatch(fetchCurrentUser())
    dispatch(fetchNotifications({ page: 1, limit: 1 }))
  }, [dispatch])

  return (
    <div className="min-h-svh bg-surface">
      <Sidebar />
      <div className={`transition-[padding] duration-200 ${collapsed ? 'lg:pl-20' : 'lg:pl-[260px]'}`}>
        <Topbar />
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <AdminShell />
    </SidebarProvider>
  )
}
