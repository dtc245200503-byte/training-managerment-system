import React, { useState } from 'react';
import { useSession } from './hooks/useSession';
import { Login } from './components/Login';
import { DiemDanhForm } from './components/DiemDanhForm';

export const App: React.FC = () => {
  const {
    token,
    username,
    remainingSeconds,
    isExpired,
    draft,
    saveDraft,
    clearDraft,
    login,
    logout,
    simulateExpire
  } = useSession();

  const [notification, setNotification] = useState<string>('');

  return (
    <div className="min-h-screen bg-slate-100 p-4 font-sans text-slate-800">
      <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h1 className="text-xs font-black uppercase text-blue-900 tracking-wide">
              HỆ THỐNG QUẢN LÝ ĐÀO TẠO
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">SCRUM-20: Quản lý phiên làm việc & Đăng xuất an toàn</p>
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded-full font-bold bg-blue-50 text-blue-700 border border-blue-200">
            React TS + Python
          </span>
        </div>

        {/* Thanh trạng thái phiên */}
        {token && (
          <div className="bg-blue-50/60 px-4 py-2.5 border-b border-blue-100 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-700 font-medium">Phiên còn lại: </span>
              <b className="text-blue-700 font-mono text-base font-bold">{remainingSeconds}s</b>
              <span className="text-[10px] text-slate-500 ml-1">(Gia hạn tự động khi gõ)</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={simulateExpire}
                className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200 text-[11px] font-bold border border-amber-300"
              >
                ⚠️ Test hết hạn
              </button>
              <button
                onClick={logout}
                className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 hover:bg-rose-200 text-[11px] font-bold border border-rose-300"
              >
                🚪 Đăng xuất
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="p-4 space-y-3">
          {notification && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-medium">
              {notification}
            </div>
          )}

          {!token ? (
            <Login isExpired={isExpired} onLoginSuccess={login} />
          ) : (
            <DiemDanhForm
              token={token}
              draft={draft}
              onSaveDraft={saveDraft}
              onClearDraft={clearDraft}
              onFormSubmitted={(msg) => setNotification(msg)}
            />
          )}
        </div>

      </div>
    </div>
  );
};

export default App;
