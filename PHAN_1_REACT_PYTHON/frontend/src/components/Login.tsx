import React, { useState } from 'react';

interface LoginProps {
  isExpired: boolean;
  onLoginSuccess: (token: string, username: string) => void;
}

export const Login: React.FC<LoginProps> = ({ isExpired, onLoginSuccess }) => {
  const [username, setUsername] = useState('gv_minhanh');
  const [password, setPassword] = useState('123456');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mô phỏng token xác thực đăng nhập
    const fakeToken = "mock_token_" + Date.now();
    onLoginSuccess(fakeToken, username);
  };

  return (
    <div className="p-5 max-w-sm mx-auto bg-white border border-slate-200 rounded-2xl shadow-lg space-y-4">
      {isExpired && (
        <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 font-medium">
          ⚠️ <b>Phiên đăng nhập đã hết hạn!</b> Vui lòng đăng nhập lại để tiếp tục. Nội dung đang nhập dở của bạn vẫn được lưu nháp an toàn.
        </div>
      )}

      <div>
        <h2 className="text-sm font-black text-slate-800 uppercase tracking-wide">Đăng nhập tài khoản đào tạo</h2>
        <p className="text-[11px] text-slate-500">Giảng viên / Quản lý học vụ</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-3 text-xs">
        <div>
          <label className="font-bold text-slate-700 block mb-1">Tên đăng nhập:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">Mật khẩu:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 outline-none focus:border-blue-600"
          />
        </div>

        <button
          type="submit"
          className="w-full h-11 bg-blue-600 hover:bg-blue-700 font-bold rounded-xl text-white shadow-sm transition"
        >
          {isExpired ? 'Đăng nhập lại & Phục hồi nháp' : 'Đăng nhập vào hệ thống'}
        </button>
      </form>
    </div>
  );
};
