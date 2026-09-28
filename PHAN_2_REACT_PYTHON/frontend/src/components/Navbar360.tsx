import React from 'react';
import { UserProfile, RoleType } from '../types/rbac';

interface NavbarProps {
  user: UserProfile;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
}

export const Navbar360: React.FC<NavbarProps> = ({ user, isMenuOpen, onToggleMenu }) => {
  const getBadge = (role: RoleType) => {
    switch (role) {
      case 'admin':
        return <span key={role} className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-purple-100 text-purple-700 border border-purple-200">Quản trị</span>;
      case 'teacher':
        return <span key={role} className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-700 border border-blue-200">Giảng viên</span>;
      case 'student':
        return <span key={role} className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">Học viên</span>;
    }
  };

  const initials = user.name.split(' ').pop()?.substring(0, 2).toUpperCase() || 'ND';

  return (
    <header className="bg-slate-50 p-3.5 flex items-center justify-between border-b border-slate-200">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 font-black text-xs flex items-center justify-center text-white shadow-sm">
          {initials}
        </div>
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-xs text-slate-900">{user.name}</span>
            <div className="flex gap-1">{user.roles.map(getBadge)}</div>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Tài khoản: <span className="text-indigo-600 font-mono font-semibold">{user.username}</span>
          </div>
        </div>
      </div>

      <button
        onClick={onToggleMenu}
        aria-label="Toggle Navigation Menu"
        className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
      >
        <span className="text-sm">☰</span> Menu
      </button>
    </header>
  );
};
