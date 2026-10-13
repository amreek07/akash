import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { appConfig } from '@/config/appConfig'
import AdminLayout from '@/components/layout/AdminLayout'
import Login from '@/pages/auth/Login'
import ForgetPassword from '@/pages/auth/ForgetPassword'
import VerifyOtp from '@/pages/auth/VerifyOtp'
import ResetPassword from '@/pages/auth/ResetPassword'
import Dashboard from '@/pages/dashboard/Dashboard'
import CourseList from '@/pages/courses/CourseList'
import CourseFormPage from '@/pages/courses/CourseFormPage'
import CourseDetails from '@/pages/courses/CourseDetails'
import Profile from '@/pages/profile/Profile'
import EditProfile from '@/pages/profile/EditProfile'
import ChangePassword from '@/pages/profile/ChangePassword'
import ResponseList from '@/pages/responses/ResponseList'
import ResponseDetails from '@/pages/responses/ResponseDetails'
import GeneralContent from '@/pages/content/GeneralContent'
import AboutContent from '@/pages/content/AboutContent'
import GalleryList from '@/pages/content/GalleryList'
import GalleryFormPage from '@/pages/content/GalleryFormPage'
import FooterContent from '@/pages/content/FooterContent'
import NotFound from '@/pages/NotFound'
import { paths, resolvePageTitle } from '@/routes/paths'
import PrivateRoute from '@/routes/PrivateRoute'
import PublicRoute from '@/routes/PublicRoute'
import { useAppSelector } from '@/store/hooks'

function RootRedirect() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  return <Navigate to={isAuthenticated ? paths.dashboard : paths.login} replace />
}

export default function AppRoutes() {
  const { pathname } = useLocation()

  useEffect(() => {
    const pageTitle = resolvePageTitle(pathname)
    document.title = `${pageTitle} · ${appConfig.appName}`
  }, [pathname])

  return (
    <Routes>
      <Route path={paths.root} element={<RootRedirect />} />

      <Route element={<PublicRoute />}>
        <Route path={paths.login} element={<Login />} />
        <Route path={paths.forgetPassword} element={<ForgetPassword />} />
        <Route path={paths.verifyOtp} element={<VerifyOtp />} />
        <Route path={paths.resetPassword} element={<ResetPassword />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route element={<AdminLayout />}>
          <Route path={paths.dashboard} element={<Dashboard />} />
          <Route path={paths.courses} element={<CourseList />} />
          <Route path={paths.courseNew} element={<CourseFormPage />} />
          <Route path="/courses/:id/edit" element={<CourseFormPage />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path={paths.profile} element={<Profile />} />
          <Route path={paths.profileEdit} element={<EditProfile />} />
          <Route path={paths.changePassword} element={<ChangePassword />} />
          <Route path="/responses" element={<Navigate to={paths.responses} replace />} />
          <Route path="/responses/:kind" element={<ResponseList />} />
          <Route path="/responses/:kind/:id" element={<ResponseDetails />} />
          <Route path="/content" element={<Navigate to={paths.contentGeneral} replace />} />
          <Route path={paths.contentGeneral} element={<GeneralContent />} />
          <Route path={paths.contentAbout} element={<AboutContent />} />
          <Route path={paths.contentGallery} element={<GalleryList />} />
          <Route path={paths.galleryNew} element={<GalleryFormPage />} />
          <Route path="/content/gallery/:id/edit" element={<GalleryFormPage />} />
          <Route path={paths.contentFooter} element={<FooterContent />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
