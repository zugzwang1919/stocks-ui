import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  constructor() { }

  private _userName: string;
  private _token: string;
  private _isAdmin: boolean;
  userNameSubject: Subject<string> = new Subject();

  get token(): string { return this._token; }
  get userName(): string { return this._userName; }
  get isAdmin(): boolean { return this._isAdmin; }

  clean() {
    this._userName = undefined;
    this._token = undefined;
    this._isAdmin = undefined;
    this.userNameSubject.next(this._userName);
  }

  setCurrentUser(userName: string, token: string, isAdmin: boolean) {
    this._userName = userName;
    this._token = token;
    this._isAdmin = isAdmin;
    this.userNameSubject.next(this._userName);
  }

}
