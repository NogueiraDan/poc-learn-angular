import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { JsonPipe } from '@angular/common';

interface FormData {
  personalInfo: {
    name: string;
    email: string;
    age: number;
    bio: string;
  };
  preferences: {
    newsletter: boolean;
    theme: string;
    language: string;
  };
  skills: string[];
}

@Component({
  selector: 'app-forms-demo',
  template: `
    <div class="forms-demo">
      <header class="demo-header">
        <h1>🎯 Demonstração de Formulários Reativos</h1>
        <p>Explorando as capacidades dos Reactive Forms no Angular com validação e estado reativo</p>
      </header>
      
      <div class="demo-content">
        <div class="form-section">
          <form [formGroup]="demoForm" (ngSubmit)="onSubmit()" class="demo-form">
            <!-- Personal Information -->
            <section class="form-group-section">
              <h2>👤 Informações Pessoais</h2>
              <div formGroupName="personalInfo" class="form-grid">
                <div class="form-field">
                  <label for="name">Nome Completo *</label>
                  <input 
                    type="text" 
                    id="name"
                    formControlName="name"
                    [class.error]="isFieldInvalid('personalInfo.name')"
                    placeholder="Seu nome completo"
                  >
                  @if (isFieldInvalid('personalInfo.name')) {
                    <span class="error-message">
                      @if (getFieldError('personalInfo.name', 'required')) {
                        Nome é obrigatório
                      }
                      @if (getFieldError('personalInfo.name', 'minlength')) {
                        Nome deve ter pelo menos 2 caracteres
                      }
                    </span>
                  }
                </div>
                
                <div class="form-field">
                  <label for="email">Email *</label>
                  <input 
                    type="email" 
                    id="email"
                    formControlName="email"
                    [class.error]="isFieldInvalid('personalInfo.email')"
                    placeholder="seu@email.com"
                  >
                  @if (isFieldInvalid('personalInfo.email')) {
                    <span class="error-message">
                      @if (getFieldError('personalInfo.email', 'required')) {
                        Email é obrigatório
                      }
                      @if (getFieldError('personalInfo.email', 'email')) {
                        Email deve ter um formato válido
                      }
                    </span>
                  }
                </div>
                
                <div class="form-field">
                  <label for="age">Idade</label>
                  <input 
                    type="number" 
                    id="age"
                    formControlName="age"
                    [class.error]="isFieldInvalid('personalInfo.age')"
                    placeholder="25"
                    min="18"
                    max="100"
                  >
                  @if (isFieldInvalid('personalInfo.age')) {
                    <span class="error-message">
                      @if (getFieldError('personalInfo.age', 'min')) {
                        Idade mínima é 18 anos
                      }
                      @if (getFieldError('personalInfo.age', 'max')) {
                        Idade máxima é 100 anos
                      }
                    </span>
                  }
                </div>
                
                <div class="form-field full-width">
                  <label for="bio">Biografia</label>
                  <textarea 
                    id="bio"
                    formControlName="bio"
                    placeholder="Conte um pouco sobre você..."
                    rows="3"
                  ></textarea>
                  <small>{{ bioCharCount() }}/500 caracteres</small>
                </div>
              </div>
            </section>
            
            <!-- Preferences -->
            <section class="form-group-section">
              <h2>⚙️ Preferências</h2>
              <div formGroupName="preferences" class="form-grid">
                <div class="form-field">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      formControlName="newsletter"
                    >
                    <span class="checkmark"></span>
                    Receber newsletter
                  </label>
                </div>
                
                <div class="form-field">
                  <label for="theme">Tema Preferido</label>
                  <select id="theme" formControlName="theme">
                    <option value="">Selecione um tema</option>
                    <option value="light">Claro</option>
                    <option value="dark">Escuro</option>
                    <option value="blue">Azul Oceano</option>
                  </select>
                </div>
                
                <div class="form-field">
                  <label for="language">Idioma</label>
                  <select id="language" formControlName="language">
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en-US">English (US)</option>
                    <option value="es-ES">Español</option>
                  </select>
                </div>
              </div>
            </section>
            
            <!-- Skills -->
            <section class="form-group-section">
              <h2>🛠️ Habilidades</h2>
              <div class="skills-section">
                <div class="skills-input">
                  <input 
                    type="text" 
                    #skillInput
                    placeholder="Digite uma habilidade e pressione Enter"
                    (keyup.enter)="addSkill(skillInput.value); skillInput.value = ''"
                  >
                  <button 
                    type="button" 
                    class="btn btn-secondary"
                    (click)="addSkill(skillInput.value); skillInput.value = ''"
                  >
                    Adicionar
                  </button>
                </div>
                
                <div formArrayName="skills" class="skills-list">
                  @if (skillsArray.length === 0) {
                    <p class="no-skills">Nenhuma habilidade adicionada</p>
                  } @else {
                    @for (skill of skillsArray.controls; track $index) {
                      <div class="skill-item">
                        <input [formControlName]="$index" readonly>
                        <button 
                          type="button" 
                          class="btn btn-danger btn-sm"
                          (click)="removeSkill($index)"
                        >
                          ✕
                        </button>
                      </div>
                    }
                  }
                </div>
              </div>
            </section>
            
            <!-- Form Actions -->
            <div class="form-actions">
              <button 
                type="button" 
                class="btn btn-secondary"
                (click)="resetForm()"
              >
                Limpar Formulário
              </button>
              
              <button 
                type="submit" 
                class="btn btn-primary"
                [disabled]="demoForm.invalid"
              >
                Enviar Formulário
              </button>
            </div>
          </form>
        </div>
        
        <!-- Real-time Form State -->
        <div class="form-state">
          <h2>📊 Estado do Formulário</h2>
          
          <div class="state-indicators">
            <div class="indicator" [class.active]="demoForm.valid">
              <span class="indicator-icon">✅</span>
              <span>Válido</span>
            </div>
            
            <div class="indicator" [class.active]="demoForm.dirty">
              <span class="indicator-icon">✏️</span>
              <span>Modificado</span>
            </div>
            
            <div class="indicator" [class.active]="demoForm.touched">
              <span class="indicator-icon">👆</span>
              <span>Tocado</span>
            </div>
          </div>
          
          <div class="form-data">
            <h3>Dados Atuais:</h3>
            <pre class="json-preview">{{ demoForm.value | json }}</pre>
          </div>
          
          @if (submittedData()) {
            <div class="submitted-data">
              <h3>✅ Último Envio:</h3>
              <pre class="json-preview">{{ submittedData() | json }}</pre>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .forms-demo {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
      color: var(--color-text);
    }
    
    .demo-header {
      text-align: center;
      margin-bottom: 3rem;
      
      h1 {
        color: var(--color-text);
        margin-bottom: 1rem;
      }
      
      p {
        color: var(--color-text);
        opacity: 0.8;
        font-size: 1.1rem;
      }
    }
    
    .demo-content {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 2rem;
      
      @media (max-width: 1200px) {
        grid-template-columns: 1fr;
      }
    }
    
    .demo-form {
      background: var(--color-background);
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 2rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .form-group-section {
      margin-bottom: 2.5rem;
      
      h2 {
        color: var(--color-text);
        margin-bottom: 1.5rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid #e0e0e0;
      }
    }
    
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }
    
    .form-field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      
      &.full-width {
        grid-column: 1 / -1;
      }
    }
    
    label {
      font-weight: 500;
      color: var(--color-text);
      font-size: 0.9rem;
    }
    
    input, select, textarea {
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
    }
    
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      font-weight: normal;
      
      input[type="checkbox"] {
        width: auto;
        margin: 0;
      }
    }
    
    .error-message {
      color: #dc3545;
      font-size: 0.8rem;
      margin-top: 0.25rem;
    }
    
    small {
      color: var(--color-text);
      opacity: 0.6;
      font-size: 0.8rem;
    }
    
    .skills-section {
      .skills-input {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }
      
      .skills-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      
      .skill-item {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        
        input {
          flex: 1;
        }
      }
      
      .no-skills {
        color: var(--color-text);
        opacity: 0.6;
        font-style: italic;
        text-align: center;
        padding: 1rem;
      }
    }
    
    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #e0e0e0;
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
      
      &.btn-danger {
        background: #dc3545;
        color: white;
        
        &:hover {
          background: #c82333;
        }
      }
      
      &.btn-sm {
        padding: 0.25rem 0.5rem;
        font-size: 0.8rem;
      }
    }
    
    .form-state {
      background: var(--color-background);
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      height: fit-content;
      position: sticky;
      top: 2rem;
      
      h2, h3 {
        color: var(--color-text);
        margin-top: 0;
      }
    }
    
    .state-indicators {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }
    
    .indicator {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem;
      border-radius: 4px;
      opacity: 0.5;
      transition: opacity 0.2s ease;
      
      &.active {
        opacity: 1;
        background: color-mix(in srgb, var(--color-primary) 10%, var(--color-background));
      }
      
      .indicator-icon {
        font-size: 1.2rem;
      }
    }
    
    .json-preview {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 4px;
      padding: 1rem;
      font-size: 0.8rem;
      overflow-x: auto;
      max-height: 300px;
      overflow-y: auto;
    }
    
    .submitted-data {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e0e0e0;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, JsonPipe]
})
export class FormsDemoComponent {
  private readonly fb = inject(FormBuilder);
  
  readonly submittedData = signal<FormData | null>(null);
  
  readonly demoForm: FormGroup = this.fb.group({
    personalInfo: this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      age: [null, [Validators.min(18), Validators.max(100)]],
      bio: ['', [Validators.maxLength(500)]]
    }),
    preferences: this.fb.group({
      newsletter: [false],
      theme: [''],
      language: ['pt-BR']
    }),
    skills: this.fb.array([])
  });
  
  readonly bioCharCount = computed(() => {
    const bio = this.demoForm.get('personalInfo.bio')?.value || '';
    return bio.length;
  });
  
  get skillsArray(): FormArray {
    return this.demoForm.get('skills') as FormArray;
  }
  
  isFieldInvalid(fieldPath: string): boolean {
    const field = this.demoForm.get(fieldPath);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
  
  getFieldError(fieldPath: string, errorType: string): boolean {
    const field = this.demoForm.get(fieldPath);
    return !!(field && field.errors && field.errors[errorType]);
  }
  
  addSkill(skill: string): void {
    if (skill.trim()) {
      this.skillsArray.push(this.fb.control(skill.trim()));
    }
  }
  
  removeSkill(index: number): void {
    this.skillsArray.removeAt(index);
  }
  
  resetForm(): void {
    this.demoForm.reset({
      personalInfo: {
        name: '',
        email: '',
        age: null,
        bio: ''
      },
      preferences: {
        newsletter: false,
        theme: '',
        language: 'pt-BR'
      }
    });
    this.skillsArray.clear();
    this.submittedData.set(null);
  }
  
  onSubmit(): void {
    if (this.demoForm.valid) {
      const formData: FormData = {
        personalInfo: this.demoForm.value.personalInfo,
        preferences: this.demoForm.value.preferences,
        skills: this.demoForm.value.skills
      };
      
      this.submittedData.set(formData);
      
      // Simulate API call
      console.log('Form submitted:', formData);
      alert('Formulário enviado com sucesso! Verifique o console para ver os dados.');
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.demoForm);
    }
  }
  
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }
}
