export interface User {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  message?: string;
}