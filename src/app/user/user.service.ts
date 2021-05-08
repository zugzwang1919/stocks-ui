import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { LoginResponse } from './login/login-response';
import { WolfeHttpService } from '../wolfe-common/wolfe-http.service';
import { UtilService } from '../wolfe-common/util.service';
import { CurrentUserService } from 'src/app/user/current-user/current-user.service';
import { User } from './user';
import { Profile } from './profile';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private wolfeHttp: WolfeHttpService,
    private currentUserService: CurrentUserService,
    private util: UtilService
  ) { }

    login(userName: string, password: string): Observable<LoginResponse> {
      return  this.wolfeHttp.post('/authenticate', {userName, password}, null);
    }

    quickLogin(): Observable<LoginResponse> {
      return this.wolfeHttp.post('/quickauthenticate', null, null);
    }

    register(userName: string, password: string, emailAddress: string): Observable<User> {
      const body = {
        username: userName,
        password,
        emailaddress: emailAddress
      };
      return this.wolfeHttp.post('/user', null, body);
    }

    loginWithGoogle(token: string): Observable<LoginResponse> {
      return this.wolfeHttp.post('/authenticatewithgoogle', {token}, null);
    }

    logout(): void {
      // Simply clear the current user
      this.currentUserService.clean();
    }

    retrieveProfile(): Observable<Profile> {
      return this.wolfeHttp.get('/profile');
    }
}
