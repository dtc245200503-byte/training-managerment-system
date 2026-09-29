import React, { useState } from 'react';
import { UserProfile, RoleType } from '../types/rbac';

interface RoleManagementProps {
  currentUser: UserProfile;
  allUsers: Record<string, UserProfile>;
  onUpdateRole: (targetUsername: string, newRoles: RoleType[]) => void;
  errorMessage?: string;
  successMessage?: string;
}

export const RoleManagement: React.FC<RoleManagementProps> = ({
  currentUser,
  allUsers,
  onUpdateRole,
  errorMessage,
  successMessage
}) => {
  const [editingRoles, setEditingRoles] = useState<Record<string, RoleType[]>>(() => {
    const initial: Record<string, RoleType[]> = {};
    Object.keys(allUsers).forEach((k) => {
      initial[k] = [...allUsers[k].roles];
    });
    return initial;
  });

  const handleRoleToggle = (targetUser: string, role: RoleType) => {
    setEditingRoles((prev) => {
      const currentList = prev[targetUser] || [];
      const hasRole = currentList.includes(role);
      const nextList = hasRole
        ? currentList.filter((r) => r !== role)
        : [...currentList, role];
      return { ...prev, [targetUser]: nextList };
    });
  };

  const handleSave = (targetUser: string) => {
    const nextRoles = editingRoles[targetUser] || [];
    onUpdateRole(targetUser, nextRoles);
  };

  return (
    <div className="space-y-3 text-xs">
      <h3 className="font-bold text-xs text-indigo-900 flex items-center gap-1.5">
        <span>⚙️</span> Trung Tâm Phân Quyền & Anti-Lockout
      </h3>

      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-300 text-rose-900 rounded-xl font-medium">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl font-medium">
          {successMessage}
        </div>
      )}

      <div className="space-y-2">
        {Object.keys(allUsers).map((key) => {
          const user = allUsers[key];
          const isSelf = key === currentUser.username;
          const userRoles = editingRoles[key] || user.roles;

          return (
            <div key={key} className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 shadow-sm">
              <div className="flex justify-between items-center font-bold text-slate-800 text-[11px]">
                <span>
                  {user.name} (<code className="text-indigo-600">{key}</code>)
                </span>
                {isSelf && (
                  <span className="text-amber-700 bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded text-[10px] font-bold">
                    Tài khoản của bạn
                  </span>
                )}
              </div>

              <div className="flex gap-3 text-[11px] text-slate-700">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userRoles.includes('admin')}
                    onChange={() => handleRoleToggle(key, 'admin')}
                    className="rounded text-indigo-600"
                  />
                  Quản trị
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userRoles.includes('teacher')}
                    onChange={() => handleRoleToggle(key, 'teacher')}
                    className="rounded text-blue-600"
                  />
                  Giảng viên
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userRoles.includes('student')}
                    onChange={() => handleRoleToggle(key, 'student')}
                    className="rounded text-emerald-600"
                  />
                  Học viên
                </label>
              </div>

              <button
                onClick={() => handleSave(key)}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold shadow-sm transition"
              >
                Lưu thay đổi
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
