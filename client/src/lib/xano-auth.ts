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
    // Create new account
    const authToken = `xano_auth_new_${Date.now()}`;
    const newUserId = Date.now(); // Use timestamp as unique ID
    
    const userData: XanoAuthResponse = {
      authToken,
      user: {
        id: newUserId,
        name,
        email,
        created_at: new Date().toISOString()
      }
    };
    
    // Store new user data
    localStorage.setItem(`user_${newUserId}`, JSON.stringify(userData.user));
    this.setToken(authToken);
    return userData;
  }

  static async login(email: string, password: string): Promise<XanoAuthResponse> {
    // Validate against your provided credentials
    if (email === "mmanthe37@live.seminolestate.edu" && password === "Yinyin@0430uni37#xan") {
      const authToken = `xano_auth_${Date.now()}`;
      const userData: XanoAuthResponse = {
        authToken,
        user: {
          id: 117643,
          name: "Michael Andrew Manthe Jr",
          email: "mmanthe37@live.seminolestate.edu",
          created_at: new Date().toISOString()
        }
      };
      
      this.setToken(authToken);
      return userData;
    }
    // Test account for public users
    else if (email === "testuser@omnisphere.com" && password === "password123") {
      const authToken = `xano_auth_test_${Date.now()}`;
      const userData: XanoAuthResponse = {
        authToken,
        user: {
          id: 999999,
          name: "Test User",
          email: "testuser@omnisphere.com",
          created_at: new Date().toISOString()
        }
      };
      
      this.setToken(authToken);
      return userData;
    } else {
      throw new Error("Invalid credentials");
    }
  }

  static async me(): Promise<XanoUser> {
    const token = this.getToken();
    if (token && token.startsWith('xano_auth_test_')) {
      return {
        id: 999999,
        name: "Test User",
        email: "testuser@omnisphere.com",
        created_at: new Date().toISOString()
      };
    }
    if (token && token.startsWith('xano_auth_')) {
      return {
        id: 117643,
        name: "Michael Andrew Manthe Jr",
        email: "mmanthe37@live.seminolestate.edu",
        created_at: new Date().toISOString()
      };
    }
    throw new Error("Not authenticated");
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