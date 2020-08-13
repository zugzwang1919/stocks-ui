import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { LoginResponse } from './login/login-response';
import { WolfeHttpService } from '../wolfe-common/wolfe-http.service';
import { UtilService } from '../wolfe-common/util.service';
import { CurrentUserService } from 'src/app/user/current-user/current-user.service';
import { User } from './user';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private wolfeHttp: WolfeHttpService,
    private currentUser: CurrentUserService,
    private util: UtilService
  ) { }

    login(userName: string, password: string): Observable<LoginResponse> {
      return  this.wolfeHttp.post('/authenticate', {userName, password}, null);
    }

    register(userName: string, password: string, emailAddress: string): Observable<User> {
      const body = {
        username: userName,
        password,
        emailaddress: emailAddress
      };
      return this.wolfeHttp.post('/user', null, body);
    }

    logout(): void {
      // Simply clear the current user
      this.currentUser.clean();
    }
}
