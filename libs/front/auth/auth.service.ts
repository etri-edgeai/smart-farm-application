import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { AuthUtils } from './auth.utils';
import { UserService } from '@front/services/user.service';
import { FarmService } from '@front/services/farm.service';

@Injectable()
export class AuthService {
  private _authenticated = false;

  constructor(
    private _httpClient: HttpClient,
    private _userService: UserService,
    private _farmService: FarmService,
  ) {}

  set accessToken(token: string) {
    localStorage.setItem('accessToken', token);
  }

  get accessToken(): string {
    return localStorage.getItem('accessToken') ?? '';
  }

  forgotPassword(email: string): Observable<any> {
    return this._httpClient.post('api/auth/forgot-password', email);
  }

  resetPassword(password: string): Observable<any> {
    return this._httpClient.post('api/auth/reset-password', password);
  }

  signIn(credentials: { email: string; password: string }): Observable<any> {
    // Throw error, if the user is already logged in
    if (this._authenticated) {
      return throwError(() => new Error('User is already logged in.'));
    }

    return this._httpClient.post('/api/auth/login', credentials).pipe(
      switchMap((response: any) => {
        this.afterSignIn(response);
        // Return a new observable with the response
        return of(response);
      })
    );
  }

  signInUsingToken(): Observable<any> {
    // Sign in using the token
    return this._httpClient
      //.post('api/auth/sign-in-with-token', {
      .post('/api/auth/profile', {
        //accessToken: this.accessToken, // header의 authorization에 이미 존재함
      })
      .pipe(
        catchError(() =>
          // Return false
          of(false)
        ),
        switchMap((response: any) => {
          this.afterSignIn(response);
          return of(true);
        })
      );
  }

  afterSignIn(response: any) {
    // Replace the access token with the new one if it's available on
    // the response object.
    //
    // This is an added optional step for better security. Once you sign
    // in using the token, you should generate a new one on the server
    // side and attach it to the response object. Then the following
    // piece of code can replace the token with the refreshed one.
    if (response.accessToken) {
      this.accessToken = response.accessToken;
    }

    // Set the authenticated flag to true
    this._authenticated = true;
    // Store the user on the user service
    this._userService.user = response.user;
  }

  signOut(): Observable<any> {
    // Remove the access token from the local storage
    localStorage.removeItem('accessToken');

    // Set the authenticated flag to false
    this._authenticated = false;

    // Return the observable
    return of(true);
  }

  signUp(user: { name: string; email: string; password: string; company: string }): Observable<any> {
    return this._httpClient.post('api/auth/sign-up', user);
  }

  unlockSession(credentials: { email: string; password: string }): Observable<any> {
    return this._httpClient.post('api/auth/unlock-session', credentials);
  }

  check(): Observable<boolean> {
    // Check if the user is logged in
    if (this._authenticated) {
      return of(true);
    }

    // Check the access token availability
    if (!this.accessToken) {
      return of(false);
    }

    // Check the access token expire date
    if (AuthUtils.isTokenExpired(this.accessToken)) {
      return of(false);
    }

    // If the access token exists and it didn't expire, sign in using it
    return this.signInUsingToken();
  }
}
