import { Routes } from '@angular/router';
import { authGuard, adminGuard, guestGuard } from './core/guards/auth.guards';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./features/auth/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'users',
    loadComponent: () => import('./features/users/pages/users-page.component').then(m => m.UsersPageComponent),
    canActivate: [authGuard]
  },
  {
    path: 'forms',
    loadComponent: () => import('./features/forms/forms-demo.component').then(m => m.FormsDemoComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin-panel.component').then(m => m.AdminPanelComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'pwa-demo',
    loadComponent: () => import('./features/pwa/pwa-demo.component').then(m => m.PwaDemoComponent),
    canActivate: [authGuard],
    title: 'PWA Demo'
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
