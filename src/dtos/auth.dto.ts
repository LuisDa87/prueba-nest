export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'vendedor';
}

export interface LoginDTO {
  email: string;
  password: string;
}

