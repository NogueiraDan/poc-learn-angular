import { TestBed } from '@angular/core/testing';
import { ThemeService, THEMES } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
    
    // Limpar localStorage antes de cada teste
    localStorage.clear();
    
    // Resetar classes do body
    document.body.className = '';
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with light theme by default', () => {
    expect(service.themeName()).toBe('light');
    expect(service.currentTheme()).toEqual(THEMES['light']);
  });

  it('should change theme correctly', () => {
    service.setTheme('dark');
    
    expect(service.themeName()).toBe('dark');
    expect(service.currentTheme()).toEqual(THEMES['dark']);
  });

  it('should persist theme in localStorage', () => {
    service.setTheme('blue');
    
    const savedTheme = localStorage.getItem('angular-poc-theme');
    expect(savedTheme).toBe('blue');
  });

  it('should load saved theme from localStorage', () => {
    localStorage.setItem('angular-poc-theme', 'dark');
    
    // Criar novo serviço para testar a inicialização
    const newService = new ThemeService();
    
    expect(newService.themeName()).toBe('dark');
  });

  it('should toggle between themes', () => {
    expect(service.themeName()).toBe('light');
    
    service.toggleTheme();
    expect(service.themeName()).toBe('dark');
    
    service.toggleTheme();
    expect(service.themeName()).toBe('blue');
    
    service.toggleTheme();
    expect(service.themeName()).toBe('light');
  });

  it('should apply theme to document', () => {
    service.setTheme('dark');
    
    expect(document.body.className).toContain('theme-dark');
  });

  it('should return available themes', () => {
    const themes = service.availableThemes();
    
    expect(themes.length).toBe(3);
    expect(themes).toContain(THEMES['light']);
    expect(themes).toContain(THEMES['dark']);
    expect(themes).toContain(THEMES['blue']);
  });

  it('should ignore invalid theme names', () => {
    const originalTheme = service.themeName();
    
    service.setTheme('invalid-theme');
    
    expect(service.themeName()).toBe(originalTheme);
  });
});