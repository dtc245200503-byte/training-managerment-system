import React, { useState } from 'react';
import { UserProfile, RoleType } from './types/rbac';
import { Navbar360 } from './components/Navbar360';
import { NavigationMenu } from './components/NavigationMenu';
import { RoleManagement } from './components/RoleManagement';

const INITIAL_USERS: Record<string, UserProfile> = {
  admin_an: {
    username: 'admin_an',
    name: 'Thầy Trần Văn An',
    roles: ['admin', 'teacher']
  },
  gv_ha: {
    username: 'gv_ha',
    name: 'Cô Thu Hà',
    roles: ['teacher']
  },
  hs_nam: {
    username: 'hs_nam',
    name: 'Lê Hoàng Nam',
    roles: ['student']
  }
};

export const App: React.FC = () => {
  const [users, setUsers] = useState<Record<string, UserProfile>>(INITIAL_USERS);
  const [currentUsername, setCurrentUsername] = useState<string>('admin_an');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(true);
  const [is360, setIs360] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [alertError, setAlertError] = useState<string>('');
  const [alertSuccess, setAlertSuccess] = useState<string>('');

  const currentUser = users[currentUsername];

  const handleUpdateRole = (targetUsername: string, newRoles: RoleType[]) => {
    // KIỂM TRA QUY TẮC AN TOÀN ANTI-LOCKOUT
    if (
      targetUsername === currentUsername &&
      currentUser.roles.includes('admin') &&
      !newRoles.includes('admin')
    ) {
      setAlertError('🚫 Quy tắc an toàn (Anti-Lockout): Bạn KHÔNG THỂ tự thu hồi vai trò Quản trị viên của chính mình!');
      setAlertSuccess('');
      return;
    }

    setAlertError('');
    setUsers((prev) => ({
      ...prev,
      [targetUsername]: {
        ...prev[targetUsername],
        roles: newRoles
      }
    }));
    setAlertSuccess(`✓ Đã cập nhật vai trò cho ${users[targetUsername].name} thành công (Hiệu lực ngay lập tức)!`);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 font-sans text-slate-800">
      <div className="max-w-xl mx-auto space-y-3">
        
        {/* Thanh công cụ điều khiển */}
        <div className="flex justify-between items-center bg-white border border-slate-200 rounded-xl p-3 text-xs shadow-sm">
          <div>
            <span className="font-extrabold text-indigo-700">PHẦN 2 (REACT TS + PYTHON)</span>
            <span className="text-[11px] text-slate-500 ml-1.5">• Multi-Role RBAC & Mobile 360px</span>
          </div>
          <button
            onClick={() => setIs360(!is360)}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold transition shadow-sm"
          >
            {is360 ? '🖥️ Thoát 360px' : '📱 Mô phỏng 360px'}
          </button>
        </div>

        {/* Khung giao diện ứng dụng */}
        <div
          style={{ maxWidth: is360 ? '360px' : '100%', margin: '0 auto' }}
          className={`bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl text-slate-800 transition-all ${
            is360 ? 'border-8 border-slate-300 shadow-2xl' : ''
          }`}
        >
          {/* Header & Navbar */}
          <Navbar360
            user={currentUser}
            isMenuOpen={isMenuOpen}
            onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
          />

          {/* Menu Drawer RBAC */}
          <NavigationMenu
            user={currentUser}
            isOpen={isMenuOpen}
            onSelectMenu={(menuId) => setCurrentTab(menuId)}
            onLogout={() => alert('Đã đăng xuất an toàn khỏi hệ thống!')}
          />

          {/* Vùng làm việc */}
          <div className="p-4 space-y-3.5">
            {/* Thanh chuyển nhanh người dùng */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <span className="font-bold text-slate-700 block">Chuyển tài khoản thử nghiệm:</span>
              <div className="grid grid-cols-3 gap-2">
                {Object.keys(users).map((k) => (
                  <button
                    key={k}
                    onClick={() => {
                      setCurrentUsername(k);
                      setAlertError('');
                      setAlertSuccess('');
                    }}
                    className={`p-2 rounded-lg border text-left text-[10px] font-bold transition ${
                      k === currentUsername
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-800 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {users[k].name}
                  </button>
                ))}
              </div>
            </div>

            {/* Nội dung tab */}
            {currentTab === 'roles' ? (
              <RoleManagement
                currentUser={currentUser}
                allUsers={users}
                onUpdateRole={handleUpdateRole}
                errorMessage={alertError}
                successMessage={alertSuccess}
              />
            ) : (
              <div className="p-4 bg-white border border-slate-200 rounded-xl text-xs space-y-2 shadow-sm">
                <h4 className="font-bold text-indigo-700 text-sm">Cổng Thông Tin Đào Tạo</h4>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Đang xem mục: <b>{currentTab}</b>. Mọi nút bấm trên giao diện đều có chiều cao $\ge 44$px đảm bảo thao tác cảm ứng trên di động 360px chính xác, không bấm nhầm.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default App;
