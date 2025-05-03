import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { get_all_users_url, login_user_url } from '../../environment';
import { User, UserData, UserResponse } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private httClient: HttpClient) {}

  loginUser(email: string, password: string): Observable<UserData> {
    return this.httClient
      .post<any>(login_user_url, { email, password })
      .pipe(map((response) => response.data as UserData));
  }

  getAllUsers(): Observable<UserResponse> {
    return this.httClient.get<UserResponse>(get_all_users_url, {
      withCredentials: true,
    });
  }
}
