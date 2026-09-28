export type RoleType = 'admin' | 'teacher' | 'student';

export interface UserProfile {
  username: string;
  name: string;
  roles: RoleType[];
}

export interface MenuItem {
  id: string;
  name: string;
  icon: string;
  roles: RoleType[];
}
