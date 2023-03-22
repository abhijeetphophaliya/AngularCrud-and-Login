import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ResetPassword } from '../models/reset-password-model';

@Injectable({
  providedIn: 'root',
})
export class ResetPasswordService {
  baseApiUrl: string = environment.baseApiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  sendResetPasswordLink(email: string): Observable<any> {
    return this.http.post<any>(
      this.baseApiUrl + `/api/User/send-reset-email/${email}`,
      {}
    );
  }

  resetPassword(resetPassword: ResetPassword): Observable<any> {
    return this.http.post<any>(
      this.baseApiUrl + `/api/User/reset-password`,
      resetPassword
    );
  }
}
