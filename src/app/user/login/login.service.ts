import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';

import { LoginResponse } from './login-response';
import { WolfeHttpService } from '../../common/wolfe-http.service';
import { UtilService } from '../../common/util.service';
import { CurrentUserService } from 'src/app/user/current-user/current-user.service';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private wolfeHttp: WolfeHttpService,
    private currentUser: CurrentUserService,
    private util: UtilService
  ) { }

    login(userName: string, password: string): Observable<LoginResponse> {

      let loginResponse: LoginResponse;
      console.log('Inside LoginService: Attempting to log in ' + userName);
      const loginUrl: string = this.util.buildUrl('/authenticate');
      const response: Observable<LoginResponse> = this.wolfeHttp.post(loginUrl, {userName, password}, null);
      response.subscribe(
          (data: LoginResponse) => {
            loginResponse = { ...data };
            console.log('Inside LoginService : Success');
            console.log('Inside LoginService : Login Response = ' + loginResponse);
            console.log('Inside LoginService : Token found = ' + loginResponse.token);
            // Successful login - set the current user info
            this.currentUser.setCurrentUser(userName, 'Bearer ' + loginResponse.token);
          },
          err => console.log('Inside LoginService : Error'),
          () => console.log('Inside LoginService: Subscription Terminated')
        );
      return response;
    }

    logout(): void {
      // Simply clear the current user
      this.currentUser.clean();
    }
}
