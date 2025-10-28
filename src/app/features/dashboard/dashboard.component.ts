import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard">
      <h1>Dashboard - Bem-vindo ao Angular POC!</h1>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h3>{{ userService.users().length }}</h3>
            <p>Usuários Cadastrados</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🎨</div>
          <div class="stat-content">
            <h3>{{ themeService.availableThemes().length }}</h3>
            <p>Temas Disponíveis</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">⚡</div>
          <div class="stat-content">
            <h3>{{ angularFeatures().length }}</h3>
            <p>Features Implementadas</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🚀</div>
          <div class="stat-content">
            <h3>Angular 20+</h3>
            <p>Versão Utilizada</p>
          </div>
        </div>
      </div>
      
      <div class="content-grid">
        <section class="features-section">
          <h2>🔥 Features Implementadas</h2>
          <div class="features-list">
            @for (feature of angularFeatures(); track feature.name) {
              <div class="feature-item" [class.implemented]="feature.implemented">
                <div class="feature-icon">{{ feature.icon }}</div>
                <div class="feature-content">
                  <h4>{{ feature.name }}</h4>
                  <p>{{ feature.description }}</p>
                  @if (feature.implemented) {
                    <span class="status implemented">✅ Implementado</span>
                  } @else {
                    <span class="status pending">⏳ Em desenvolvimento</span>
                  }
                </div>
              </div>
            }
          </div>
        </section>
        
        <section class="quick-actions">
          <h2>🎯 Ações Rápidas</h2>
          <div class="actions-list">
            <button class="action-btn" (click)="goToUsers()">
              <span class="btn-icon">👥</span>
              <span>Gerenciar Usuários</span>
            </button>
            
            <button class="action-btn" (click)="toggleTheme()">
              <span class="btn-icon">{{ getThemeIcon() }}</span>
              <span>Trocar Tema</span>
            </button>
            
            <button class="action-btn" (click)="refreshData()">
              <span class="btn-icon">🔄</span>
              <span>Atualizar Dados</span>
            </button>
          </div>
        </section>
      </div>
      
      <section class="current-theme-info">
        <h2>🎨 Tema Atual</h2>
        <div class="theme-preview">
          <div class="theme-colors">
            <div 
              class="color-sample primary" 
              [style.background-color]="themeService.currentTheme().primary"
              title="Cor Primária"
            ></div>
            <div 
              class="color-sample secondary" 
              [style.background-color]="themeService.currentTheme().secondary"
              title="Cor Secundária"
            ></div>
            <div 
              class="color-sample background" 
              [style.background-color]="themeService.currentTheme().background"
              [style.border]="'2px solid ' + themeService.currentTheme().text"
              title="Cor de Fundo"
            ></div>
          </div>
          <div class="theme-details">
            <h3>{{ themeService.currentTheme().name }}</h3>
            <p>Tema selecionado com suporte a CSS custom properties</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      color: var(--color-text);
    }
    
    h1 {
      text-align: center;
      margin-bottom: 3rem;
      color: var(--color-text);
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }
    
    .stat-card {
      background: var(--color-background);
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s ease;
      
      &:hover {
        transform: translateY(-2px);
      }
    }
    
    .stat-icon {
      font-size: 2rem;
    }
    
    .stat-content {
      h3 {
        margin: 0;
        font-size: 1.5rem;
        color: var(--color-primary);
      }
      
      p {
        margin: 0.25rem 0 0 0;
        color: var(--color-text);
        opacity: 0.8;
        font-size: 0.9rem;
      }
    }
    
    .content-grid {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 2rem;
      margin-bottom: 3rem;
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }
    
    .features-section, .quick-actions, .current-theme-info {
      background: var(--color-background);
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      
      h2 {
        margin-top: 0;
        color: var(--color-text);
      }
    }
    
    .features-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .feature-item {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      transition: border-color 0.2s ease;
      
      &.implemented {
        border-color: #28a745;
        background: color-mix(in srgb, #28a745 10%, var(--color-background));
      }
    }
    
    .feature-icon {
      font-size: 1.5rem;
    }
    
    .feature-content {
      flex: 1;
      
      h4 {
        margin: 0 0 0.5rem 0;
        color: var(--color-text);
      }
      
      p {
        margin: 0 0 0.5rem 0;
        color: var(--color-text);
        opacity: 0.8;
        font-size: 0.9rem;
      }
    }
    
    .status {
      font-size: 0.8rem;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-weight: 500;
      
      &.implemented {
        background: #d4edda;
        color: #155724;
      }
      
      &.pending {
        background: #fff3cd;
        color: #856404;
      }
    }
    
    .actions-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: var(--color-primary);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.2s ease;
      
      &:hover {
        background: color-mix(in srgb, var(--color-primary) 80%, black);
      }
      
      .btn-icon {
        font-size: 1.2rem;
      }
    }
    
    .theme-preview {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    
    .theme-colors {
      display: flex;
      gap: 0.5rem;
    }
    
    .color-sample {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      cursor: pointer;
      transition: transform 0.2s ease;
      
      &:hover {
        transform: scale(1.1);
      }
    }
    
    .theme-details {
      h3 {
        margin: 0 0 0.25rem 0;
        color: var(--color-text);
      }
      
      p {
        margin: 0;
        color: var(--color-text);
        opacity: 0.8;
        font-size: 0.9rem;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  readonly userService = inject(UserService);
  readonly themeService = inject(ThemeService);
  
  readonly angularFeatures = computed(() => [
    {
      name: 'Signals',
      description: 'Sistema reativo moderno para gerenciamento de estado',
      icon: '⚡',
      implemented: true
    },
    {
      name: 'Standalone Components',
      description: 'Componentes independentes sem necessidade de NgModules',
      icon: '🎯',
      implemented: true
    },
    {
      name: 'Control Flow (@if, @for)',
      description: 'Nova sintaxe de controle de fluxo nos templates',
      icon: '🔄',
      implemented: true
    },
    {
      name: 'Reactive Forms',
      description: 'Formulários reativos com validação robusta',
      icon: '📝',
      implemented: true
    },
    {
      name: 'HTTP Client & Services',
      description: 'Integração com APIs e gerenciamento de dados',
      icon: '🌐',
      implemented: true
    },
    {
      name: 'Custom Pipes',
      description: 'Pipes personalizados para transformação de dados',
      icon: '🔧',
      implemented: true
    },
    {
      name: 'Dependency Injection',
      description: 'Sistema moderno de injeção de dependências',
      icon: '💉',
      implemented: true
    },
    {
      name: 'Routing & Guards',
      description: 'Sistema de roteamento com guardas de navegação',
      icon: '🛣️',
      implemented: false
    },
    {
      name: 'Lazy Loading',
      description: 'Carregamento sob demanda de funcionalidades',
      icon: '⏳',
      implemented: false
    }
  ]);
  
  ngOnInit(): void {
    // Load users data if not already loaded
    if (this.userService.users().length === 0) {
      this.userService.getUsers().subscribe();
    }
  }
  
  goToUsers(): void {
    // In a real app, would use Router
    window.location.href = '/users';
  }
  
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
  
  refreshData(): void {
    this.userService.getUsers().subscribe();
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
