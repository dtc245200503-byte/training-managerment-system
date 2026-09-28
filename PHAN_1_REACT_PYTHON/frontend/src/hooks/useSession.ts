import { useState, useEffect, useCallback } from 'react';
import { AttendanceDraft } from '../types/session';

const DRAFT_STORAGE_KEY = 'attendance_form_draft';
const DEFAULT_SESSION_SECONDS = 1800; // 30 phút

export const useSession = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const [username, setUsername] = useState<string>(localStorage.getItem('auth_user') || '');
  const [remainingSeconds, setRemainingSeconds] = useState<number>(DEFAULT_SESSION_SECONDS);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [draft, setDraft] = useState<AttendanceDraft | null>(null);

  // Khôi phục nháp từ LocalStorage nếu có
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      try {
        setDraft(JSON.parse(savedDraft));
      } catch (e) {
        console.error("Lỗi đọc draft:", e);
      }
    }
  }, []);

  // Bộ đếm lùi thời gian phiên
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSessionExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [token]);

  // Gia hạn phiên làm việc (Sliding Session) khi có tương tác
  const refreshSession = useCallback(() => {
    if (token) {
      setRemainingSeconds(DEFAULT_SESSION_SECONDS);
    }
  }, [token]);

  // Tự động lưu bản nháp form
  const saveDraft = useCallback((className: string, absentStudents: string) => {
    refreshSession();
    const newDraft: AttendanceDraft = {
      className,
      absentStudents,
      lastUpdated: Date.now()
    };
    setDraft(newDraft);
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(newDraft));
  }, [refreshSession]);

  const clearDraft = useCallback(() => {
    setDraft(null);
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  }, []);

  // Khi hết hạn phiên
  const handleSessionExpired = useCallback(() => {
    setIsExpired(true);
    setToken(null);
    localStorage.removeItem('auth_token');
    // GIỮ NGUYÊN BẢN NHÁP (DRAFT) ĐỂ NGƯỜI DÙNG KHÔNG BỊ MẤT DỮ LIỆU
  }, []);

  const login = (newToken: string, user: string) => {
    setToken(newToken);
    setUsername(user);
    setIsExpired(false);
    setRemainingSeconds(DEFAULT_SESSION_SECONDS);
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('auth_user', user);
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch('http://localhost:5000/api/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (e) {
      console.warn("Server logout notification skipped:", e);
    } finally {
      setToken(null);
      setUsername('');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      clearDraft();
    }
  };

  return {
    token,
    username,
    remainingSeconds,
    isExpired,
    draft,
    saveDraft,
    clearDraft,
    login,
    logout,
    refreshSession,
    simulateExpire: handleSessionExpired
  };
};
