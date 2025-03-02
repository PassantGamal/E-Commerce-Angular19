import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { jwtDecode } from './../../../../../node_modules/jwt-decode';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}
  private readonly httpClient = inject(HttpClient);
  private readonly _Router = inject(Router);
  userData: any = null;
  sendRegisterForm(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/auth/signup`,
      data
    );
  }
  sendLoginForm(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/auth/signin`,
      data
    );
  }
  saveUserData(): void {
    if (
      localStorage.getItem('userToken') !== null &&
      localStorage.getItem('token') !== null
    ) {
      this.userData = jwtDecode(localStorage.getItem('userToken')!);
      this.userData = jwtDecode(localStorage.getItem('token')!);
    }
  }
  logout(): void {
    localStorage.removeItem('userToken');
    localStorage.removeItem('token');
    this.userData = null;
    this._Router.navigate(['/login']);
  }
  setEmailVerify(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/auth/forgotPasswords`,
      data
    );
  }
  setCodeVerify(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/auth/verifyResetCode`,
      data
    );
  }
  setResetPass(data: object): Observable<any> {
    return this.httpClient.put(
      `${environment.baseUrl}/api/v1/auth/resetPassword`,
      data
    );
  }
}
