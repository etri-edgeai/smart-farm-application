import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { UserDto } from '@libs/models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _user = new BehaviorSubject<UserDto>(null);

  constructor(private _httpClient: HttpClient) {}

  set user(value: UserDto) {
    // Store the value
    this._user.next(value);
  }

  get user() {
    return this._user.getValue();
  }

  get user$(): Observable<UserDto> {
    return this._user.asObservable();
  }

  /**
   * Get the current logged in user data
   */
  get(): Observable<UserDto> {
    return this._httpClient.get<UserDto>('api/common/user').pipe(
      tap((user) => {
        this._user.next(user);
      })
    );
  }

  /**
   * Update the user
   *
   * @param user
   */
  update(user: UserDto): Observable<any> {
    return this._httpClient.patch<UserDto>('api/common/user', { user }).pipe(
      map((response) => {
        this._user.next(response);
      })
    );
  }
}
