import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);

    const token = authService.getAccessToken();
    const authReq = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            // Don't try to refresh on the refresh/login endpoints themselves
            if (error.status === 401 && !req.url.includes('/auth/refresh') && !req.url.includes('/auth/login')) {
                return authService.refreshToken().pipe(
                    switchMap(res => {
                        const retryReq = req.clone({ setHeaders: { Authorization: `Bearer ${res.token}` } });
                        return next(retryReq);
                    }),
                    catchError(refreshError => {
                        authService.logout();
                        return throwError(() => refreshError);
                    })
                );
            }
            return throwError(() => error);
        })
    );
};