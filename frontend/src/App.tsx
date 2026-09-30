import {
  useEffect,
  useState,
} from 'react'

import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom'

import ErrorPage from './components/ErrorPage'
import Layout from './components/Layout'
import PermissionPage from './components/PermissionPage'
import { getCurrentUser } from './services/authService'
import type { CurrentUser } from './types/auth'


function Page({
  title,
}: {
  title: string
}) {
  return (
    <div>
      <h1>{title}</h1>

      <p>
        Nội dung chức năng đang được phát triển.
      </p>
    </div>
  )
}


function App() {
  const [user, setUser] = useState<CurrentUser | null>(
    null,
  )

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState('')


  useEffect(() => {
    const loadUser = async () => {
      const accessToken = localStorage.getItem(
        'access_token',
      )

      if (!accessToken) {
        setError(
          'Chưa có access token. Vui lòng đăng nhập.',
        )
        setLoading(false)
        return
      }

      try {
        const currentUser = await getCurrentUser(
          accessToken,
        )

        setUser(currentUser)
      } catch {
        setError(
          'Không thể lấy thông tin người dùng.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])


  if (loading) {
    return <p>Đang tải...</p>
  }


  if (error) {
    return <p>{error}</p>
  }


  if (!user) {
    return <p>Không tìm thấy người dùng.</p>
  }


  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <Layout user={user} />
          }
        >
          <Route
            path="/"
            element={
              <Page title="Trang chủ" />
            }
          />

          <Route
            path="/users"
            element={
              <PermissionPage
                user={user}
                permission="USER_MANAGE"
                title="Quản lý tài khoản"
              />
            }
          />

          <Route
            path="/roles"
            element={
              <PermissionPage
                user={user}
                permission="ROLE_MANAGE"
                title="Vai trò và phân quyền"
              />
            }
          />

          <Route
            path="/courses"
            element={
              <PermissionPage
                user={user}
                permission="COURSE_MANAGE"
                title="Khóa học"
              />
            }
          />

          <Route
            path="/classes"
            element={
              <PermissionPage
                user={user}
                permission="CLASS_MANAGE"
                title="Lớp học"
              />
            }
          />

          <Route
            path="/grades"
            element={
              <PermissionPage
                user={user}
                permission="GRADE_VIEW"
                title="Điểm"
              />
            }
          />

          <Route
            path="/tuition"
            element={
              <PermissionPage
                user={user}
                permission="TUITION_VIEW"
                title="Học phí"
              />
            }
          />

          <Route
            path="/attendance"
            element={
              <PermissionPage
                user={user}
                permission="ATTENDANCE_VIEW"
                title="Điểm danh"
              />
            }
          />

          <Route
            path="*"
            element={
              <ErrorPage
                statusCode={404}
                title="Không tìm thấy trang"
                message={
                  'Trang bạn đang truy cập không tồn tại.'
                }
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}


export default App