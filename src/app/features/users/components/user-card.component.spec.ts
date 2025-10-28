import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { UserCardComponent } from './user-card.component';
import { User } from '../../../core/services/user.service';

describe('UserCardComponent', () => {
  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;

  const mockUser: User = {
    id: 1,
    name: 'João Silva',
    email: 'joao@example.com',
    phone: '(11) 99999-9999',
    website: 'joao.com',
    company: {
      name: 'Empresa Teste Ltda'
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UserCardComponent);
    component = fixture.componentInstance;
    
    // Definir inputs obrigatórios
    fixture.componentRef.setInput('user', mockUser);
    fixture.componentRef.setInput('selected', false);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user information', () => {
    const compiled = fixture.nativeElement;
    
    expect(compiled.textContent).toContain('João Silva');
    expect(compiled.textContent).toContain('joao@example.com');
    expect(compiled.textContent).toContain('Empresa Teste Ltda');
  });

  it('should generate correct user initials', () => {
    expect(component.userInitials()).toBe('JS');
  });

  it('should generate user initials for single name', () => {
    const userWithSingleName = { ...mockUser, name: 'João' };
    fixture.componentRef.setInput('user', userWithSingleName);
    fixture.detectChanges();
    
    expect(component.userInitials()).toBe('J');
  });

  it('should limit initials to 2 characters', () => {
    const userWithManyNames = { ...mockUser, name: 'João Pedro Silva Santos' };
    fixture.componentRef.setInput('user', userWithManyNames);
    fixture.detectChanges();
    
    expect(component.userInitials()).toBe('JP');
  });

  it('should format website URL correctly', () => {
    expect(component.websiteUrl()).toBe('https://joao.com');
  });

  it('should handle website URL with protocol', () => {
    const userWithHttpWebsite = { ...mockUser, website: 'http://joao.com' };
    fixture.componentRef.setInput('user', userWithHttpWebsite);
    fixture.detectChanges();
    
    expect(component.websiteUrl()).toBe('http://joao.com');
  });

  it('should show selected state', () => {
    fixture.componentRef.setInput('selected', true);
    fixture.detectChanges();
    
    expect(component.isSelected()).toBeTrue();
    
    const cardElement = fixture.nativeElement.querySelector('.user-card');
    expect(cardElement.classList.contains('selected')).toBeTrue();
  });

  it('should emit edit event', () => {
    spyOn(component.edit, 'emit');
    
    component.onEdit();
    
    expect(component.edit.emit).toHaveBeenCalledWith(mockUser);
  });

  it('should emit select event', () => {
    spyOn(component.selectUser, 'emit');
    
    component.onSelect();
    
    expect(component.selectUser.emit).toHaveBeenCalledWith(mockUser);
  });

  it('should emit delete event after confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(component.delete, 'emit');
    
    component.onDelete();
    
    expect(window.confirm).toHaveBeenCalledWith('Tem certeza que deseja excluir João Silva?');
    expect(component.delete.emit).toHaveBeenCalledWith(1);
  });

  it('should not emit delete event if not confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    spyOn(component.delete, 'emit');
    
    component.onDelete();
    
    expect(component.delete.emit).not.toHaveBeenCalled();
  });

  it('should show correct button text for selection', () => {
    const compiled = fixture.nativeElement;
    let selectButton = compiled.querySelector('.btn-secondary');
    
    expect(selectButton.textContent.trim()).toBe('Selecionar');
    
    // Quando selecionado
    fixture.componentRef.setInput('selected', true);
    fixture.detectChanges();
    
    selectButton = compiled.querySelector('.btn-secondary');
    expect(selectButton.textContent.trim()).toBe('Desselecionar');
  });
});