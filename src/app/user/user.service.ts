import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { LoginResponse } from './login/login-response';
import { WolfeHttpService } from '../common/wolfe-http.service';
import { UtilService } from '../common/util.service';
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

      const loginUrl: string = this.util.buildUrl('/authenticate');
      return  this.wolfeHttp.post(loginUrl, {userName, password}, null)
        .pipe(
          catchError(this.handleLoginError)
        );
    }

    register(userName: string, password: string, emailAddress: string): Observable<User> {

      const registerUrl: string = this.util.buildUrl('/user');
      const body = {
        username: userName,
        password,
        emailaddress: emailAddress
      };
      return this.wolfeHttp.post(registerUrl, null, body)
        .pipe(
          catchError(this.handleRegisterError)
        );
    }

    private handleLoginError(errorResponse: HttpErrorResponse) {
      return throwError('User name and password are not valid.');
    }

    private handleRegisterError(errorResponse: HttpErrorResponse) {
        return throwError(errorResponse.error.message);
    }

    logout(): void {
      // Simply clear the current user
      this.currentUser.clean();
    }
}
