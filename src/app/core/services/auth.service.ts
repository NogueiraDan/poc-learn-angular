import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'guest';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _currentUser = signal<AuthUser | null>(null);
  private readonly _isLoading = signal(false);

  // Computed signals
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this._currentUser());
  readonly isAdmin = computed(() => this._currentUser()?.role === 'admin');
  readonly isLoading = this._isLoading.asReadonly();

  constructor(private router: Router) {
    // Recuperar usuário do localStorage ao inicializar
    this.loadUserFromStorage();
  }

  // Simulação de login
  async login(email: string, password: string): Promise<{ success: boolean; message: string }> {
    this._isLoading.set(true);
    
    // Simular delay de API
    await this.delay(1000);
    
    // Simular autenticação - dados mockados
    const users: Record<string, { password: string; user: AuthUser }> = {
      'admin@angular.com': {
        password: 'admin123',
        user: { id: 1, email: 'admin@angular.com', name: 'Administrador', role: 'admin' }
      },
      'user@angular.com': {
        password: 'user123',
        user: { id: 2, email: 'user@angular.com', name: 'Usuário Regular', role: 'user' }
      },
      'guest@angular.com': {
        password: 'guest123',
        user: { id: 3, email: 'guest@angular.com', name: 'Convidado', role: 'guest' }
      }
    };

    const userData = users[email];
    
    if (userData && userData.password === password) {
      this._currentUser.set(userData.user);
      this.saveUserToStorage(userData.user);
      this._isLoading.set(false);
      return { success: true, message: 'Login realizado com sucesso!' };
    } else {
      this._isLoading.set(false);
      return { success: false, message: 'Email ou senha inválidos!' };
    }
  }

  // Logout
  logout(): void {
    this._currentUser.set(null);
    localStorage.removeItem('angular_poc_user');
    this.router.navigate(['/login']);
  }

  // Verificar se tem permissão para role específica
  hasRole(role: string): boolean {
    const user = this._currentUser();
    if (!user) return false;
    
    // Admin tem acesso a tudo
    if (user.role === 'admin') return true;
    
    return user.role === role;
  }

  // Métodos privados
  private loadUserFromStorage(): void {
    try {
      const storedUser = localStorage.getItem('angular_poc_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        this._currentUser.set(user);
      }
    } catch (error) {
      console.error('Erro ao carregar usuário do localStorage:', error);
      localStorage.removeItem('angular_poc_user');
    }
  }

  private saveUserToStorage(user: AuthUser): void {
    try {
      localStorage.setItem('angular_poc_user', JSON.stringify(user));
    } catch (error) {
      console.error('Erro ao salvar usuário no localStorage:', error);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Método para simular refresh token (para demonstração)
  async refreshToken(): Promise<boolean> {
    const currentUser = this._currentUser();
    if (!currentUser) return false;

    try {
      // Simular chamada de API para refresh
      await this.delay(500);
      
      // Em uma aplicação real, aqui você faria uma chamada para renovar o token
      // Para demonstração, vamos apenas manter o usuário logado
      return true;
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      this.logout();
      return false;
    }
  }
}