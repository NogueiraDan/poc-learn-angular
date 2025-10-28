import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const currentUser = authService.currentUser();

  // Se usuário está logado, adicionar Authorization header
  if (currentUser) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer fake-jwt-token-${currentUser.id}`,
        'Content-Type': 'application/json'
      }
    });
    return next(authReq);
  }

  return next(req);
};