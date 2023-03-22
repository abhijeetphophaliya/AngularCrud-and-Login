import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenApiModel } from '../models/token-api.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userPayload: any;

  baseApiUrl: string = environment.baseApiUrl;

  constructor(private http: HttpClient, private router: Router) {
    this.userPayload = this.decodedToken();
  }

  loginUser(loginObj: any): Observable<any> {
    return this.http.post<any>(
      this.baseApiUrl + '/api/user/AuthenticateUser',
      loginObj
    );
  }

  signUpUser(userObj: any): Observable<any> {
    return this.http.post<any>(
      this.baseApiUrl + '/api/user/RegisterUser',
      userObj
    );
  }

  storeToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue);
  }


  storeRefreshToken(tokenValue: string) {
    localStorage.setItem('refreshToken', tokenValue);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  signOut() {
    localStorage.removeItem('token');
    this.router.navigate(['login']);
  }

  decodedToken() {
    const jwtHelper = new JwtHelperService();
    const token = this.getToken();
    if (token) {
      return jwtHelper.decodeToken(token);
    }
  }

  getFullnameFromToken() {
    if (this.userPayload) {
      return this.userPayload.unique_name;
    }
  }

  getRoleFromToken() {
    if (this.userPayload) {
      return this.userPayload.role;
    }
  }

  renewToken(tokenApi : TokenApiModel)
  {
    return this.http.post<any>(
      this.baseApiUrl + '/api/User/RefreshToken',
      tokenApi
    );
  }
}
