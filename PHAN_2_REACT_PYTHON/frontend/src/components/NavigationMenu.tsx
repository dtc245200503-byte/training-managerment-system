import React from 'react';
import { MenuItem, UserProfile } from '../types/rbac';

interface NavigationMenuProps {
  user: UserProfile;
  isOpen: boolean;
  onSelectMenu: (menuId: string) => void;
  onLogout: () => void;
}

const ALL_MENUS: MenuItem[] = [
  { id: 'home', name: 'Trang chủ đào tạo', icon: '🏠', roles: ['admin', 'teacher', 'student'] },
  { id: 'results', name: 'Xem kết quả chuyên cần', icon: '📊', roles: ['admin', 'teacher', 'student'] },
  { id: 'diemdanh', name: 'Điểm danh học viên', icon: '📝', roles: ['admin', 'teacher'] },
  { id: 'roles', name: 'Cấu hình phân quyền', icon: '⚙️', roles: ['admin'] }
];

export const NavigationMenu: React.FC<NavigationMenuProps> = ({
  user,
  isOpen,
  onSelectMenu,
  onLogout
}) => {
  if (!isOpen) return null;

  // Lọc danh sách menu theo vai trò người dùng (RBAC Filtering)
  const allowedMenus = ALL_MENUS.filter((m) =>
    m.roles.some((r) => user.roles.includes(r))
  );

  return (
    <nav className="bg-slate-50/80 p-3.5 border-b border-slate-200 space-y-1.5 animate-fadeIn">
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 py-0.5 flex justify-between">
        <span>DANH MỤC THUỘC QUYỀN ĐÀO TẠO</span>
        <span className="text-emerald-700 font-extrabold text-[9px] bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200">
          ✓ ĐÃ LỌC THEO VAI TRÒ
        </span>
      </div>

      <div className="space-y-1.5">
        {allowedMenus.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectMenu(item.id)}
            style={{ minHeight: '44px' }}
            className="w-full text-left px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 text-slate-700 hover:text-indigo-700 text-xs flex items-center justify-between shadow-sm transition"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base">{item.icon}</span>
              <span className="font-semibold">{item.name}</span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Mở →</span>
          </button>
        ))}
      </div>

      <button
        onClick={onLogout}
        style={{ minHeight: '44px' }}
        className="w-full text-left px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 flex items-center gap-2 transition mt-2.5"
      >
        <span>🚪</span> Đăng xuất an toàn
      </button>
    </nav>
  );
};
