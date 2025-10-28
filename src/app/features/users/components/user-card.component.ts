import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { User } from '../../../core/services/user.service';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';

@Component({
  selector: 'app-user-card',
  template: `
    <div class="user-card" [class.selected]="isSelected()">
      <div class="user-avatar">
        {{ userInitials() }}
      </div>
      
      <div class="user-info">
        <h3>{{ user().name }}</h3>
        <p class="email">{{ user().email }}</p>
        <p class="company">{{ user().company.name | truncate:30 }}</p>
        
        @if (user().website) {
          <a [href]="websiteUrl()" target="_blank" class="website">
            {{ user().website }}
          </a>
        }
      </div>
      
      <div class="user-actions">
        <button 
          type="button"
          class="btn btn-primary"
          (click)="onEdit()"
        >
          Editar
        </button>
        
        <button 
          type="button"
          class="btn btn-secondary"
          (click)="onSelect()"
        >
          {{ isSelected() ? 'Desselecionar' : 'Selecionar' }}
        </button>
        
        <button 
          type="button"
          class="btn btn-danger"
          (click)="onDelete()"
        >
          Excluir
        </button>
      </div>
    </div>
  `,
  styles: [`
    .user-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background: var(--color-background);
      color: var(--color-text);
      transition: all 0.2s ease;
      
      &:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
      }
      
      &.selected {
        border-color: var(--color-primary);
        background: color-mix(in srgb, var(--color-primary) 10%, var(--color-background));
      }
    }
    
    .user-avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: var(--color-primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 1.2rem;
    }
    
    .user-info {
      flex: 1;
      
      h3 {
        margin: 0 0 0.25rem 0;
        color: var(--color-text);
      }
      
      .email {
        color: var(--color-primary);
        margin: 0 0 0.25rem 0;
        font-size: 0.9rem;
      }
      
      .company {
        color: var(--color-secondary);
        margin: 0 0 0.25rem 0;
        font-size: 0.85rem;
      }
      
      .website {
        color: var(--color-primary);
        text-decoration: none;
        font-size: 0.8rem;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
    
    .user-actions {
      display: flex;
      gap: 0.5rem;
      flex-direction: column;
      
      @media (min-width: 768px) {
        flex-direction: row;
      }
    }
    
    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.85rem;
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
      
      &.btn-danger {
        background: #dc3545;
        color: white;
        
        &:hover {
          background: #c82333;
        }
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TruncatePipe]
})
export class UserCardComponent {
  // Inputs usando signals
  readonly user = input.required<User>();
  readonly selected = input<boolean>(false);
  
  // Outputs
  readonly edit = output<User>();
  readonly delete = output<number>();
  readonly selectUser = output<User>();
  
  // Computed signals
  readonly userInitials = computed(() => {
    const name = this.user().name;
    return name
      .split(' ')
      .map((part: string) => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  });
  
  readonly websiteUrl = computed(() => {
    const website = this.user().website;
    return website.startsWith('http') ? website : `https://${website}`;
  });
  
  readonly isSelected = computed(() => this.selected());
  
  onEdit(): void {
    this.edit.emit(this.user());
  }
  
  onDelete(): void {
    if (confirm(`Tem certeza que deseja excluir ${this.user().name}?`)) {
      this.delete.emit(this.user().id);
    }
  }
  
  onSelect(): void {
    this.selectUser.emit(this.user());
  }
}
