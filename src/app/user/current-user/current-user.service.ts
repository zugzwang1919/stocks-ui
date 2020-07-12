import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  constructor() { }

  private _userName: string;
  private _token: string;
  userNameSubject: Subject<string> = new Subject();

  get token(): string { return this._token; }
  get userName(): string { return this._userName; }

  clean() {
    this._userName = undefined;
    this._token = undefined;
    this.userNameSubject.next(this._userName);
  }

  setCurrentUser(userName: string, token: string) {
    this._userName = userName;
    this._token = token;
    this.userNameSubject.next(this._userName);
  }

}
