import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Se receber 401 (não autorizado) ou 422 (token inválido/expirado)
        if (error.status === 401 || error.status === 422) {
          // Limpar token
          this.authService.logout();
          
          // Redirecionar para login
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: this.router.url }
          });
        }
        
        return throwError(() => error);
      })
    );
  }
}