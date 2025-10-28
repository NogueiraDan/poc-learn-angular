import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-form',
  template: `
    <div class="user-form-container">
      <h2>{{ isEdit() ? 'Editar Usuário' : 'Novo Usuário' }}</h2>
      
      <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="user-form">
        <div class="form-group">
          <label for="name">Nome *</label>
          <input 
            type="text" 
            id="name"
            formControlName="name"
            [class.error]="isFieldInvalid('name')"
            placeholder="Digite o nome completo"
          >
          @if (isFieldInvalid('name')) {
            <span class="error-message">
              @if (userForm.get('name')?.errors?.['required']) {
                Nome é obrigatório
              }
              @if (userForm.get('name')?.errors?.['minlength']) {
                Nome deve ter pelo menos 2 caracteres
              }
            </span>
          }
        </div>
        
        <div class="form-group">
          <label for="email">Email *</label>
          <input 
            type="email" 
            id="email"
            formControlName="email"
            [class.error]="isFieldInvalid('email')"
            placeholder="exemplo@email.com"
          >
          @if (isFieldInvalid('email')) {
            <span class="error-message">
              @if (userForm.get('email')?.errors?.['required']) {
                Email é obrigatório
              }
              @if (userForm.get('email')?.errors?.['email']) {
                Email deve ter um formato válido
              }
            </span>
          }
        </div>
        
        <div class="form-group">
          <label for="phone">Telefone</label>
          <input 
            type="tel" 
            id="phone"
            formControlName="phone"
            placeholder="(11) 99999-9999"
          >
        </div>
        
        <div class="form-group">
          <label for="website">Website</label>
          <input 
            type="url" 
            id="website"
            formControlName="website"
            placeholder="https://exemplo.com"
          >
        </div>
        
        <div class="form-group">
          <label for="companyName">Empresa</label>
          <input 
            type="text" 
            id="companyName"
            formControlName="companyName"
            placeholder="Nome da empresa"
          >
        </div>
        
        <div class="form-actions">
          <button 
            type="button" 
            class="btn btn-secondary"
            (click)="onCancel()"
          >
            Cancelar
          </button>
          
          <button 
            type="submit" 
            class="btn btn-primary"
            [disabled]="userForm.invalid || saving()"
          >
            @if (saving()) {
              Salvando...
            } @else {
              {{ isEdit() ? 'Atualizar' : 'Criar' }}
            }
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .user-form-container {
      max-width: 500px;
      margin: 0 auto;
      padding: 2rem;
      background: var(--color-background);
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    h2 {
      color: var(--color-text);
      margin-bottom: 2rem;
      text-align: center;
    }
    
    .user-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    label {
      font-weight: 500;
      color: var(--color-text);
      font-size: 0.9rem;
    }
    
    input {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
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
        
        &:focus {
          box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.2);
        }
      }
      
      &::placeholder {
        color: #999;
      }
    }
    
    .error-message {
      color: #dc3545;
      font-size: 0.8rem;
      margin-top: 0.25rem;
    }
    
    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 1rem;
    }
    
    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
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
  imports: [ReactiveFormsModule]
})
export class UserFormComponent {
  private readonly fb = inject(FormBuilder);
  
  // Inputs
  readonly user = input<User | null>(null);
  readonly saving = input<boolean>(false);
  
  // Outputs
  readonly save = output<Partial<User>>();
  readonly cancel = output<void>();
  
  // Computed
  readonly isEdit = computed(() => !!this.user());
  
  // Form
  readonly userForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    website: [''],
    companyName: ['']
  });
  
  constructor() {
    // Watch for user changes to populate form
    const userValue = this.user();
    if (userValue) {
      this.userForm.patchValue({
        name: userValue.name,
        email: userValue.email,
        phone: userValue.phone,
        website: userValue.website,
        companyName: userValue.company.name
      });
    }
  }
  
  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
  
  onSubmit(): void {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      const userData: Partial<User> = {
        name: formValue.name,
        email: formValue.email,
        phone: formValue.phone,
        website: formValue.website,
        company: {
          name: formValue.companyName
        }
      };
      
      if (this.isEdit() && this.user()) {
        userData.id = this.user()!.id;
      }
      
      this.save.emit(userData);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.userForm.controls).forEach(key => {
        this.userForm.get(key)?.markAsTouched();
      });
    }
  }
  
  onCancel(): void {
    this.cancel.emit();
  }
}
