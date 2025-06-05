import xano from "./xano";

export interface XanoUser {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface XanoAuthResponse {
  authToken: string;
  user: XanoUser;
}

export class XanoAuthService {
  private static TOKEN_KEY = 'xano_auth_token';

  static async signup(email: string, password: string, name: string): Promise<XanoAuthResponse> {
    const { data } = await xano.post('/auth/signup', {
      email,
      password,
      name
    });
    
    this.setToken(data.authToken);
    return data;
  }

  static async login(email: string, password: string): Promise<XanoAuthResponse> {
    const { data } = await xano.post('/auth/login', {
      email,
      password
    });
    
    this.setToken(data.authToken);
    return data;
  }

  static async me(): Promise<XanoUser> {
    const { data } = await xano.get('/auth/me');
    return data;
  }

  static async logout(): Promise<void> {
    this.removeToken();
    window.location.href = '/login';
  }

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    // Update axios default headers
    xano.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    delete xano.defaults.headers.common['Authorization'];
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static initializeAuth(): void {
    const token = this.getToken();
    if (token) {
      xano.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }
}

// Initialize auth on module load
XanoAuthService.initializeAuth();