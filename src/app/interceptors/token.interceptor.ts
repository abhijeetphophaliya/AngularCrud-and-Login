import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

import { NgToastService } from 'ng-angular-popup';
import { TokenApiModel } from '../models/token-api.model';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    public authService: AuthService,
    private router: Router,
    private toast: NgToastService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const myToken = this.authService.getToken();

    if (myToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${myToken}`,
        },
      });
    }
    return next.handle(request).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status == 401) {
            return this.handleUnAuthorizedError(request, next);
          } else {
            const errorMessage = err.error.message;
            return throwError(() => new Error(errorMessage));
          }
        }
        return throwError(() => new Error('something went wrong'));
      })
    );
  }

  handleUnAuthorizedError(req: HttpRequest<any>, next: HttpHandler) {
    let tokenApiModel = new TokenApiModel();
    tokenApiModel.accessToken = this.authService.getToken() as string;
    tokenApiModel.refreshToken = this.authService.getRefreshToken() as string;
    return this.authService.renewToken(tokenApiModel).pipe(
      switchMap((data: TokenApiModel) => {
        this.authService.storeRefreshToken(data.refreshToken);
        this.authService.storeToken(data.accessToken);

        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${data.accessToken}`,
          },
        });

        return next.handle(req);
      }),
      catchError((err) => {
        return throwError(() => {
          this.toast.warning({
            detail: 'Warning',
            summary: 'Token is expired login again',
          });
          this.router.navigate(['login']);
        });
      })
    );
  }
}
