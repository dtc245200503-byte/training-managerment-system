import { Outlet } from 'react-router-dom'

import Sidebar from './Sidebar'
import type { CurrentUser } from '../types/auth'

interface LayoutProps {
  user: CurrentUser
}

function Layout({ user }: LayoutProps) {
  return (
    <div className="app-layout">
      <Sidebar user={user} />

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout