export interface UserSession {
  token: string;
  username: string;
  expiresIn: number;
}

export interface AttendanceDraft {
  className: string;
  absentStudents: string;
  lastUpdated: number;
}

export interface AttendanceRecord {
  id: string;
  className: string;
  absentStudents: string;
  timestamp: string;
}
