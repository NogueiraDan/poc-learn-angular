import { TestBed } from '@angular/core/testing';
import { AuthService, AuthUser } from './auth.service';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: spy }
      ]
    });

    service = TestBed.inject(AuthService);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Limpar localStorage antes de cada teste
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with no authenticated user', () => {
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.currentUser()).toBeNull();
  });

  it('should authenticate user with valid credentials', async () => {
    const result = await service.login('admin@angular.com', 'admin123');
    
    expect(result.success).toBeTrue();
    expect(result.message).toBe('Login realizado com sucesso!');
    expect(service.isAuthenticated()).toBeTrue();
    expect(service.currentUser()?.email).toBe('admin@angular.com');
    expect(service.isAdmin()).toBeTrue();
  });

  it('should reject invalid credentials', async () => {
    const result = await service.login('invalid@email.com', 'wrongpassword');
    
    expect(result.success).toBeFalse();
    expect(result.message).toBe('Email ou senha inválidos!');
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should logout user and navigate to login', () => {
    // Primeiro fazer login
    service.login('user@angular.com', 'user123');
    
    // Então fazer logout
    service.logout();
    
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.currentUser()).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should check user roles correctly', async () => {
    await service.login('admin@angular.com', 'admin123');
    
    expect(service.hasRole('admin')).toBeTrue();
    expect(service.hasRole('user')).toBeTrue(); // Admin has access to all
    expect(service.isAdmin()).toBeTrue();
  });

  it('should persist user in localStorage', async () => {
    await service.login('user@angular.com', 'user123');
    
    const storedUser = localStorage.getItem('angular_poc_user');
    expect(storedUser).toBeTruthy();
    
    const user = JSON.parse(storedUser!);
    expect(user.email).toBe('user@angular.com');
  });

  it('should load user from localStorage on init', () => {
    const mockUser: AuthUser = {
      id: 1,
      email: 'test@angular.com',
      name: 'Test User',
      role: 'user'
    };
    
    localStorage.setItem('angular_poc_user', JSON.stringify(mockUser));
    
    // Criar novo serviço para testar a inicialização
    const newService = new AuthService(routerSpy);
    
    expect(newService.isAuthenticated()).toBeTrue();
    expect(newService.currentUser()?.email).toBe('test@angular.com');
  });
});