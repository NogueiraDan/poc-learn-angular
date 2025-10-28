import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  template: `
    <div class="unauthorized-container">
      <div class="unauthorized-content">
        <div class="error-icon">🚫</div>
        <h1>Acesso Negado</h1>
        <p>Você não tem permissão para acessar esta página.</p>
        <p>Entre em contato com o administrador se precisar de acesso.</p>
        
        <div class="actions">
          <a routerLink="/dashboard" class="btn btn-primary">
            Voltar ao Dashboard
          </a>
          <a routerLink="/login" class="btn btn-secondary">
            Fazer Login Novamente
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-background);
      padding: 2rem;
    }

    .unauthorized-content {
      text-align: center;
      max-width: 500px;
      color: var(--color-text);
    }

    .error-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    h1 {
      color: var(--color-text);
      margin-bottom: 1rem;
      font-size: 2rem;
    }

    p {
      color: var(--color-text);
      opacity: 0.8;
      margin-bottom: 1rem;
      line-height: 1.6;
    }

    .actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 2rem;
      flex-wrap: wrap;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 500;
      transition: background-color 0.2s ease;
      display: inline-block;

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
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink]
})
export class UnauthorizedComponent {}