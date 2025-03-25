export interface User {
  id: number;
  usuario: string;
  role: number;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loggedIn: boolean;
}

export type RoleRoutes = {
  [key: string]: number[];
} 