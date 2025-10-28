import { Injectable, signal, computed } from '@angular/core';

export interface Theme {
  name: string;
  primary: string;
  secondary: string;
  background: string;
  text: string;
}

export const THEMES: Record<string, Theme> = {
  light: {
    name: 'Light',
    primary: '#1976d2',
    secondary: '#424242',
    background: '#ffffff',
    text: '#000000'
  },
  dark: {
    name: 'Dark', 
    primary: '#bb86fc',
    secondary: '#03dac6',
    background: '#121212',
    text: '#ffffff'
  },
  blue: {
    name: 'Blue Ocean',
    primary: '#0077be',
    secondary: '#00a8cc',
    background: '#f0f8ff',
    text: '#1e3a8a'
  }
};

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly _currentTheme = signal<string>('light');
  
  // Computed signal para o tema atual
  readonly currentTheme = computed(() => THEMES[this._currentTheme()]);
  readonly availableThemes = computed(() => Object.values(THEMES));
  readonly themeName = computed(() => this._currentTheme());
  
  constructor() {
    // Carregar tema salvo do localStorage
    const savedTheme = localStorage.getItem('angular-poc-theme');
    if (savedTheme && THEMES[savedTheme]) {
      this._currentTheme.set(savedTheme);
    }
    
    // Aplicar tema inicial
    this.applyTheme();
  }
  
  setTheme(themeName: string): void {
    if (THEMES[themeName]) {
      this._currentTheme.set(themeName);
      localStorage.setItem('angular-poc-theme', themeName);
      this.applyTheme();
    }
  }
  
  toggleTheme(): void {
    const currentName = this._currentTheme();
    const themeNames = Object.keys(THEMES);
    const currentIndex = themeNames.indexOf(currentName);
    const nextIndex = (currentIndex + 1) % themeNames.length;
    this.setTheme(themeNames[nextIndex]);
  }
  
  private applyTheme(): void {
    const theme = this.currentTheme();
    const root = document.documentElement;
    
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-secondary', theme.secondary);
    root.style.setProperty('--color-background', theme.background);
    root.style.setProperty('--color-text', theme.text);
    
    // Adicionar classe do tema ao body
    document.body.className = `theme-${this._currentTheme()}`;
  }
}
