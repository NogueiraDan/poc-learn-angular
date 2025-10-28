import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User, UserService } from '../../../core/services/user.service';
import { UserCardComponent } from '../components/user-card.component';
import { UserFormComponent } from '../components/user-form.component';

@Component({
  selector: 'app-users-page',
  template: `
    <div class="users-page">
      <header class="page-header">
        <h1>Gerenciamento de Usuários</h1>
        <button 
          type="button"
          class="btn btn-primary"
          (click)="showCreateForm()"
        >
          + Novo Usuário
        </button>
      </header>
      
      <!-- Filtros e Busca -->
      <section class="filters-section">
        <div class="search-box">
          <input 
            type="text"
            placeholder="Buscar usuários..."
            [(ngModel)]="searchTerm"
            (input)="onSearchChange()"
            class="search-input"
          >
        </div>
        
        <div class="stats">
          <span class="stat">
            Total: <strong>{{ filteredUsers().length }}</strong>
          </span>
          @if (selectedUsers().length > 0) {
            <span class="stat">
              Selecionados: <strong>{{ selectedUsers().length }}</strong>
            </span>
          }
        </div>
      </section>
      
      <!-- Loading State -->
      @if (userService.loading()) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Carregando usuários...</p>
        </div>
      }
      
      <!-- Error State -->
      @if (userService.error()) {
        <div class="error-state">
          <p>{{ userService.error() }}</p>
          <button 
            type="button"
            class="btn btn-secondary"
            (click)="loadUsers()"
          >
            Tentar novamente
          </button>
        </div>
      }
      
      <!-- Users List -->
      @if (!userService.loading() && !userService.error()) {
        <section class="users-list">
          @if (filteredUsers().length === 0) {
            <div class="empty-state">
              <p>{{ searchTerm() ? 'Nenhum usuário encontrado para a busca.' : 'Nenhum usuário cadastrado.' }}</p>
            </div>
          } @else {
            @for (user of filteredUsers(); track user.id) {
              <app-user-card
                [user]="user"
                [selected]="isUserSelected(user)"
                (edit)="editUser($event)"
                (delete)="deleteUser($event)"
                (selectUser)="toggleUserSelection($event)"
              />
            }
          }
        </section>
      }
      
      <!-- Form Modal -->
      @if (showForm()) {
        <div class="modal-overlay" (click)="closeForm()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <app-user-form
              [user]="editingUser()"
              [saving]="saving()"
              (save)="saveUser($event)"
              (cancel)="closeForm()"
            />
          </div>
        </div>
      }
      
      <!-- Bulk Actions -->
      @if (selectedUsers().length > 0) {
        <div class="bulk-actions">
          <button 
            type="button"
            class="btn btn-danger"
            (click)="deleteSelectedUsers()"
          >
            Excluir Selecionados ({{ selectedUsers().length }})
          </button>
          
          <button 
            type="button"
            class="btn btn-secondary"
            (click)="clearSelection()"
          >
            Limpar Seleção
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .users-page {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      
      h1 {
        color: var(--color-text);
        margin: 0;
      }
    }
    
    .filters-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      gap: 1rem;
      flex-wrap: wrap;
    }
    
    .search-box {
      flex: 1;
      min-width: 300px;
    }
    
    .search-input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      background: var(--color-background);
      color: var(--color-text);
      
      &:focus {
        outline: none;
        border-color: var(--color-primary);
      }
    }
    
    .stats {
      display: flex;
      gap: 1rem;
      
      .stat {
        color: var(--color-text);
        font-size: 0.9rem;
      }
    }
    
    .loading-state, .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      text-align: center;
      color: var(--color-text);
    }
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid var(--color-primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .users-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .empty-state {
      text-align: center;
      padding: 3rem;
      color: var(--color-text);
    }
    
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .modal-content {
      background: var(--color-background);
      border-radius: 8px;
      max-width: 90vw;
      max-height: 90vh;
      overflow-y: auto;
    }
    
    .bulk-actions {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      display: flex;
      gap: 1rem;
      background: var(--color-background);
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      border: 1px solid #ddd;
    }
    
    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
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
      
      &.btn-danger {
        background: #dc3545;
        color: white;
        
        &:hover {
          background: #c82333;
        }
      }
    }
    
    @media (max-width: 768px) {
      .users-page {
        padding: 1rem;
      }
      
      .page-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }
      
      .filters-section {
        flex-direction: column;
        align-items: stretch;
      }
      
      .bulk-actions {
        position: static;
        margin-top: 2rem;
        justify-content: center;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UserCardComponent, 
    UserFormComponent, 
    FormsModule
  ]
})
export class UsersPageComponent implements OnInit {
  readonly userService = inject(UserService);
  
  // Local state
  readonly searchTerm = signal('');
  readonly selectedUsers = signal<User[]>([]);
  readonly showForm = signal(false);
  readonly editingUser = signal<User | null>(null);
  readonly saving = signal(false);
  
  // Computed
  readonly filteredUsers = computed(() => {
    const users = this.userService.users();
    const search = this.searchTerm().toLowerCase();
    
    if (!search) return users;
    
    return users.filter(user => 
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.company.name.toLowerCase().includes(search)
    );
  });
  
  ngOnInit(): void {
    this.loadUsers();
  }
  
  loadUsers(): void {
    this.userService.getUsers().subscribe();
  }
  
  onSearchChange(): void {
    // O search já é reativo via signal, não precisa fazer nada aqui
    // Mas pode adicionar debounce se necessário
  }
  
  showCreateForm(): void {
    this.editingUser.set(null);
    this.showForm.set(true);
  }
  
  editUser(user: User): void {
    this.editingUser.set(user);
    this.showForm.set(true);
  }
  
  closeForm(): void {
    this.showForm.set(false);
    this.editingUser.set(null);
    this.saving.set(false);
  }
  
  saveUser(userData: Partial<User>): void {
    this.saving.set(true);
    
    if (this.editingUser()) {
      // Update existing user
      this.userService.updateUser(this.editingUser()!.id, userData).subscribe({
        next: (updatedUser) => {
          console.log('User updated:', updatedUser);
          this.loadUsers(); // Reload list
          this.closeForm();
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.saving.set(false);
        }
      });
    } else {
      // Create new user
      this.userService.createUser(userData as Omit<User, 'id'>).subscribe({
        next: (newUser) => {
          console.log('User created:', newUser);
          this.loadUsers(); // Reload list
          this.closeForm();
        },
        error: (error) => {
          console.error('Error creating user:', error);
          this.saving.set(false);
        }
      });
    }
  }
  
  deleteUser(userId: number): void {
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        console.log('User deleted');
        this.loadUsers(); // Reload list
        this.removeUserFromSelection(userId);
      },
      error: (error) => {
        console.error('Error deleting user:', error);
      }
    });
  }
  
  toggleUserSelection(user: User): void {
    const current = this.selectedUsers();
    const index = current.findIndex(u => u.id === user.id);
    
    if (index >= 0) {
      // Remove from selection
      this.selectedUsers.set(current.filter(u => u.id !== user.id));
    } else {
      // Add to selection
      this.selectedUsers.set([...current, user]);
    }
  }
  
  isUserSelected(user: User): boolean {
    return this.selectedUsers().some(u => u.id === user.id);
  }
  
  clearSelection(): void {
    this.selectedUsers.set([]);
  }
  
  deleteSelectedUsers(): void {
    const selected = this.selectedUsers();
    if (selected.length === 0) return;
    
    const confirmMessage = `Tem certeza que deseja excluir ${selected.length} usuário(s)?`;
    if (!confirm(confirmMessage)) return;
    
    // Delete each user (in a real app, would batch this)
    selected.forEach(user => {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          console.log(`User ${user.name} deleted`);
        },
        error: (error) => {
          console.error(`Error deleting user ${user.name}:`, error);
        }
      });
    });
    
    this.clearSelection();
    this.loadUsers();
  }
  
  private removeUserFromSelection(userId: number): void {
    const current = this.selectedUsers();
    this.selectedUsers.set(current.filter(u => u.id !== userId));
  }
}
