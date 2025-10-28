import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>🔐 Login</h1>
          <p>Faça login para acessar a aplicação</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-field">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              [class.error]="isFieldInvalid('email')"
              placeholder="seu@email.com"
            >
            @if (isFieldInvalid('email')) {
              <span class="error-message">
                @if (loginForm.get('email')?.errors?.['required']) {
                  Email é obrigatório
                }
                @if (loginForm.get('email')?.errors?.['email']) {
                  Email deve ter um formato válido
                }
              </span>
            }
          </div>

          <div class="form-field">
            <label for="password">Senha</label>
            <input
              type="password"
              id="password"
              formControlName="password"
              [class.error]="isFieldInvalid('password')"
              placeholder="Sua senha"
            >
            @if (isFieldInvalid('password')) {
              <span class="error-message">
                @if (loginForm.get('password')?.errors?.['required']) {
                  Senha é obrigatória
                }
                @if (loginForm.get('password')?.errors?.['minlength']) {
                  Senha deve ter pelo menos 6 caracteres
                }
              </span>
            }
          </div>

          @if (errorMessage()) {
            <div class="error-banner">
              {{ errorMessage() }}
            </div>
          }

          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="loginForm.invalid || authService.isLoading()"
          >
            @if (authService.isLoading()) {
              Entrando...
            } @else {
              Entrar
            }
          </button>
        </form>

        <div class="demo-credentials">
          <h3>👤 Credenciais para teste:</h3>
          <div class="credential-item">
            <strong>Admin:</strong> admin@angular.com / admin123
            <button type="button" class="btn-link" (click)="fillCredentials('admin')">Usar</button>
          </div>
          <div class="credential-item">
            <strong>Usuário:</strong> user@angular.com / user123
            <button type="button" class="btn-link" (click)="fillCredentials('user')">Usar</button>
          </div>
          <div class="credential-item">
            <strong>Convidado:</strong> guest@angular.com / guest123
            <button type="button" class="btn-link" (click)="fillCredentials('guest')">Usar</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
      padding: 2rem;
    }

    .login-card {
      background: var(--color-background);
      border-radius: 12px;
      padding: 2.5rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      width: 100%;
      max-width: 400px;
      color: var(--color-text);
    }

    .login-header {
      text-align: center;
      margin-bottom: 2rem;

      h1 {
        color: var(--color-text);
        margin-bottom: 0.5rem;
      }

      p {
        color: var(--color-text);
        opacity: 0.7;
      }
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    label {
      font-weight: 500;
      color: var(--color-text);
    }

    input {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      background: var(--color-background);
      color: var(--color-text);
      transition: border-color 0.2s ease, box-shadow 0.2s ease;

      &:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 20%, transparent);
      }

      &.error {
        border-color: #dc3545;
      }
    }

    .error-message {
      color: #dc3545;
      font-size: 0.8rem;
    }

    .error-banner {
      background: #f8d7da;
      color: #721c24;
      padding: 0.75rem;
      border-radius: 4px;
      border: 1px solid #f5c6cb;
      text-align: center;
      font-size: 0.9rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
      transition: background-color 0.2s ease;

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      &.btn-primary {
        background: var(--color-primary);
        color: white;

        &:hover:not(:disabled) {
          background: color-mix(in srgb, var(--color-primary) 80%, black);
        }
      }
    }

    .demo-credentials {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #e0e0e0;

      h3 {
        color: var(--color-text);
        margin-bottom: 1rem;
        font-size: 0.9rem;
      }

      .credential-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
        font-size: 0.8rem;
        color: var(--color-text);
        opacity: 0.8;

        .btn-link {
          background: none;
          border: none;
          color: var(--color-primary);
          cursor: pointer;
          text-decoration: underline;
          font-size: 0.8rem;

          &:hover {
            opacity: 0.8;
          }
        }
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule]
})
export class LoginComponent {
  readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly errorMessage = signal<string>('');

  readonly loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  fillCredentials(type: 'admin' | 'user' | 'guest'): void {
    const credentials = {
      admin: { email: 'admin@angular.com', password: 'admin123' },
      user: { email: 'user@angular.com', password: 'user123' },
      guest: { email: 'guest@angular.com', password: 'guest123' }
    };

    this.loginForm.patchValue(credentials[type]);
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.errorMessage.set('');
    const { email, password } = this.loginForm.value;

    try {
      const result = await this.authService.login(email, password);
      
      if (result.success) {
        // Redirecionar para URL original ou dashboard
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        this.router.navigate([returnUrl]);
      } else {
        this.errorMessage.set(result.message);
      }
    } catch (error) {
      this.errorMessage.set('Erro interno. Tente novamente.');
    }
  }
}