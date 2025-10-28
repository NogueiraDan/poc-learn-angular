import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-panel',
  template: `
    <div class="admin-panel">
      <header class="admin-header">
        <h1>🔧 Painel Administrativo</h1>
        <p>Área restrita para administradores</p>
      </header>

      <div class="admin-content">
        <div class="welcome-section">
          <h2>Bem-vindo, {{ authService.currentUser()?.name }}!</h2>
          <p>Role: <strong>{{ authService.currentUser()?.role }}</strong></p>
        </div>

        <div class="admin-sections">
          <section class="admin-card">
            <h3>👥 Gerenciar Usuários</h3>
            <p>Administre usuários do sistema, permissões e roles.</p>
            <div class="admin-stats">
              <div class="stat">
                <span class="stat-number">127</span>
                <span class="stat-label">Usuários Ativos</span>
              </div>
              <div class="stat">
                <span class="stat-number">23</span>
                <span class="stat-label">Novos Este Mês</span>
              </div>
            </div>
          </section>

          <section class="admin-card">
            <h3>📊 Analytics</h3>
            <p>Visualize métricas e relatórios do sistema.</p>
            <div class="admin-stats">
              <div class="stat">
                <span class="stat-number">1.2k</span>
                <span class="stat-label">Sessões Hoje</span>
              </div>
              <div class="stat">
                <span class="stat-number">98.5%</span>
                <span class="stat-label">Uptime</span>
              </div>
            </div>
          </section>

          <section class="admin-card">
            <h3>⚙️ Configurações</h3>
            <p>Configure parâmetros globais da aplicação.</p>
            <div class="config-options">
              <label class="config-item">
                <input type="checkbox" checked>
                <span>Manutenção programada</span>
              </label>
              <label class="config-item">
                <input type="checkbox">
                <span>Notificações por email</span>
              </label>
              <label class="config-item">
                <input type="checkbox" checked>
                <span>Logs detalhados</span>
              </label>
            </div>
          </section>

          <section class="admin-card">
            <h3>🛡️ Segurança</h3>
            <p>Monitore atividades e configure políticas de segurança.</p>
            <div class="security-alerts">
              <div class="alert alert-warning">
                <strong>⚠️ Aviso:</strong> 3 tentativas de login falharam na última hora
              </div>
              <div class="alert alert-success">
                <strong>✅ OK:</strong> Backup automático executado com sucesso
              </div>
            </div>
          </section>
        </div>

        <div class="admin-actions">
          <button class="btn btn-primary">
            📊 Gerar Relatório
          </button>
          <button class="btn btn-secondary">
            🔄 Sincronizar Dados
          </button>
          <button class="btn btn-warning">
            ⚠️ Modo Manutenção
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-panel {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      color: var(--color-text);
    }

    .admin-header {
      text-align: center;
      margin-bottom: 3rem;

      h1 {
        color: var(--color-text);
        margin-bottom: 0.5rem;
      }

      p {
        color: var(--color-text);
        opacity: 0.7;
      }
    }

    .welcome-section {
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
      color: white;
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 2rem;
      text-align: center;

      h2 {
        margin: 0 0 0.5rem 0;
      }

      p {
        margin: 0;
        opacity: 0.9;
      }
    }

    .admin-sections {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .admin-card {
      background: var(--color-background);
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 2rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      h3 {
        color: var(--color-text);
        margin: 0 0 1rem 0;
      }

      p {
        color: var(--color-text);
        opacity: 0.8;
        margin-bottom: 1.5rem;
      }
    }

    .admin-stats {
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .stat {
      text-align: center;

      .stat-number {
        display: block;
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--color-primary);
      }

      .stat-label {
        font-size: 0.8rem;
        color: var(--color-text);
        opacity: 0.7;
      }
    }

    .config-options {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .config-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      color: var(--color-text);

      input {
        cursor: pointer;
      }
    }

    .security-alerts {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .alert {
      padding: 0.75rem 1rem;
      border-radius: 4px;
      font-size: 0.9rem;

      &.alert-warning {
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        color: #856404;
      }

      &.alert-success {
        background: #d4edda;
        border: 1px solid #c3e6cb;
        color: #155724;
      }
    }

    .admin-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
      transition: background-color 0.2s ease;

      &.btn-primary {
        background: var(--color-primary);
        color: white;

        &:hover {
          background: color-mix(in srgb, var(--color-primary) 80%, black);
        }
      }

      &.btn-secondary {
        background: var(--color-secondary);
        color: white;

        &:hover {
          background: color-mix(in srgb, var(--color-secondary) 80%, black);
        }
      }

      &.btn-warning {
        background: #ffc107;
        color: #212529;

        &:hover {
          background: #e0a800;
        }
      }
    }

    @media (max-width: 768px) {
      .admin-panel {
        padding: 1rem;
      }

      .admin-sections {
        grid-template-columns: 1fr;
      }

      .admin-actions {
        flex-direction: column;
        align-items: center;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminPanelComponent {
  readonly authService = inject(AuthService);
}