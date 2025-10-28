import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  readonly userService = inject(UserService);
  readonly themeService = inject(ThemeService);

  readonly angularFeatures = computed(() => [
    {
      name: 'Signals',
      description: 'Sistema reativo moderno para gerenciamento de estado',
      icon: '⚡',
      implemented: true,
    },
    {
      name: 'Standalone Components',
      description: 'Componentes independentes sem necessidade de NgModules',
      icon: '🎯',
      implemented: true,
    },
    {
      name: 'Control Flow (@if, @for)',
      description: 'Nova sintaxe de controle de fluxo nos templates',
      icon: '🔄',
      implemented: true,
    },
    {
      name: 'Reactive Forms',
      description: 'Formulários reativos com validação robusta',
      icon: '📝',
      implemented: true,
    },
    {
      name: 'HTTP Client & Services',
      description: 'Integração com APIs e gerenciamento de dados',
      icon: '🌐',
      implemented: true,
    },
    {
      name: 'Custom Pipes',
      description: 'Pipes personalizados para transformação de dados',
      icon: '🔧',
      implemented: true,
    },
    {
      name: 'Dependency Injection',
      description: 'Sistema moderno de injeção de dependências',
      icon: '💉',
      implemented: true,
    },
    {
      name: 'Routing & Guards',
      description: 'Sistema de roteamento com guardas de navegação',
      icon: '🛣️',
      implemented: false,
    },
    {
      name: 'Lazy Loading',
      description: 'Carregamento sob demanda de funcionalidades',
      icon: '⏳',
      implemented: false,
    },
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
      case 'light':
        return '☀️';
      case 'dark':
        return '🌙';
      case 'blue':
        return '🌊';
      default:
        return '🎨';
    }
  }
}
