import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  template: `
    <header class="app-header">
      <div class="header-content">
        <div class="brand">
          <h1>
            <a routerLink="/">Angular POC</a>
          </h1>
        </div>
        
        <nav class="main-nav">
          <a routerLink="/users" routerLinkActive="active">Usuários</a>
          <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
          <a routerLink="/forms" routerLinkActive="active">Formulários</a>
          <a routerLink="/pwa-demo" routerLinkActive="active">📱 PWA</a>
          @if (authService.isAdmin()) {
            <a routerLink="/admin" routerLinkActive="active">Admin</a>
          }
        </nav>
        
        <div class="header-actions">
          <button 
            type="button"
            class="theme-toggle"
            (click)="toggleTheme()"
            [title]="'Tema atual: ' + themeService.currentTheme().name"
          >
            {{ getThemeIcon() }}
          </button>
          
          <div class="theme-info">
            {{ themeService.currentTheme().name }}
          </div>
          
          @if (authService.isAuthenticated()) {
            <div class="user-info">
              <span class="user-name">{{ authService.currentUser()?.name }}</span>
              <span class="user-role">({{ authService.currentUser()?.role }})</span>
              <button 
                type="button" 
                class="btn-logout"
                (click)="logout()"
                title="Sair"
              >
                🚪
              </button>
            </div>
          } @else {
            <a routerLink="/login" class="btn-login">
              Entrar
            </a>
          }
        </div>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      background: var(--color-primary);
      color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    
    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 60px;
      gap: 2rem;
    }
    
    .brand {
      h1 {
        margin: 0;
        font-size: 1.5rem;
        
        a {
          color: white;
          text-decoration: none;
          
          &:hover {
            opacity: 0.8;
          }
        }
      }
    }
    
    .main-nav {
      display: flex;
      gap: 2rem;
      
      a {
        color: white;
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        transition: background-color 0.2s ease;
        
        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        &.active {
          background: rgba(255, 255, 255, 0.2);
          font-weight: 500;
        }
      }
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .theme-toggle {
      background: none;
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      padding: 0.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1.2rem;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    }
    
    .theme-info {
      font-size: 0.85rem;
      opacity: 0.8;
      white-space: nowrap;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      
      .user-name {
        font-weight: 500;
      }
      
      .user-role {
        opacity: 0.7;
        font-size: 0.8rem;
      }
    }
    
    .btn-logout {
      background: none;
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.2s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    }
    
    .btn-login {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: background-color 0.2s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.3);
      }
    }
    
    @media (max-width: 768px) {
      .header-content {
        padding: 0 1rem;
        flex-wrap: wrap;
        min-height: auto;
        padding-top: 1rem;
        padding-bottom: 1rem;
      }
      
      .main-nav {
        order: 3;
        width: 100%;
        justify-content: center;
        margin-top: 1rem;
        gap: 1rem;
      }
      
      .theme-info {
        display: none;
      }
      
      .user-info {
        .user-role {
          display: none;
        }
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive]
})
export class HeaderComponent {
  readonly themeService = inject(ThemeService);
  readonly authService = inject(AuthService);
  
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
  
  logout(): void {
    this.authService.logout();
  }
  
  getThemeIcon(): string {
    const themeName = this.themeService.themeName();
    switch (themeName) {
      case 'light': return '☀️';
      case 'dark': return '🌙';
      case 'blue': return '🌊';
      default: return '🎨';
    }
  }
}
