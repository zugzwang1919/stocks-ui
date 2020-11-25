import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  constructor() { }

  private _userName: string;
  private _userImageUrl: string;
  private _token: string;
  private _isAdmin: boolean;
  userNameSubject: Subject<string> = new Subject();
  userImageUrlSubject: Subject<string> = new Subject();

  get token(): string { return this._token; }
  get userName(): string { return this._userName; }
  get isAdmin(): boolean { return this._isAdmin; }

  isUserCurrentlyLoggedIn(): boolean {
    return (this._userName != null ) || (this._userImageUrl != null);
  }

  clean() {
    this._userName = undefined;
    this._userImageUrl = undefined;
    this._token = undefined;
    this._isAdmin = undefined;
    this.userNameSubject.next(this._userName);
    this.userImageUrlSubject.next(this._userImageUrl);
  }

  setCurrentUser(userName: string, userImageUrl: string, token: string, isAdmin: boolean) {
    this._userName = userName;
    this._userImageUrl = userImageUrl;
    this._token = token;
    this._isAdmin = isAdmin;
    this.userNameSubject.next(this._userName);
    this.userImageUrlSubject.next(this._userImageUrl);
  }

}
