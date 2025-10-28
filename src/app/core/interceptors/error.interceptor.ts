import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Erro desconhecido';

      switch (error.status) {
        case 0:
          errorMessage = 'Erro de conexão. Verifique sua internet.';
          break;
        case 400:
          errorMessage = 'Dados inválidos enviados.';
          break;
        case 401:
          errorMessage = 'Não autorizado. Faça login novamente.';
          authService.logout();
          break;
        case 403:
          errorMessage = 'Acesso negado.';
          router.navigate(['/unauthorized']);
          break;
        case 404:
          errorMessage = 'Recurso não encontrado.';
          break;
        case 500:
          errorMessage = 'Erro interno do servidor.';
          break;
        case 503:
          errorMessage = 'Serviço temporariamente indisponível.';
          break;
        default:
          errorMessage = `Erro ${error.status}: ${error.message}`;
      }

      // Log do erro para debug
      console.error('HTTP Error:', {
        status: error.status,
        message: errorMessage,
        url: req.url,
        method: req.method,
        error: error
      });

      // Criar erro personalizado
      const customError = new Error(errorMessage);
      (customError as any).status = error.status;
      (customError as any).originalError = error;

      return throwError(() => customError);
    })
  );
};