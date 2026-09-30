import {
  useEffect,
  useState,
} from 'react'

import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom'

import Layout from './components/Layout'
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
      <p>Nội dung chức năng đang được phát triển.</p>
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
            element={<Page title="Trang chủ" />}
          />

          <Route
            path="/users"
            element={
              <Page title="Quản lý tài khoản" />
            }
          />

          <Route
            path="/roles"
            element={
              <Page title="Vai trò và phân quyền" />
            }
          />

          <Route
            path="/courses"
            element={<Page title="Khóa học" />}
          />

          <Route
            path="/classes"
            element={<Page title="Lớp học" />}
          />

          <Route
            path="/grades"
            element={<Page title="Điểm" />}
          />

          <Route
            path="/tuition"
            element={<Page title="Học phí" />}
          />

          <Route
            path="/attendance"
            element={<Page title="Điểm danh" />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App