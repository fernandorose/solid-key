export interface UserLogin {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface UserData {
  user: UserLogin;
  token: string;
}

export interface UserBase {
  id: string;
  name: string;
  email: string;
  last_login: Date;
  role: 'user' | 'admin';
}

export interface Admin extends UserBase {}

export interface User extends UserBase {}

export interface UserResponse {
  admins: Admin[];
  users: User[];
}
