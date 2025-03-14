import type { User } from './user';

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}