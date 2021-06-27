import { Injectable } from '@angular/core';
import { SocialUser } from 'angularx-social-login';
import { BehaviorSubject, Subject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {


  private _userName: string;
  private _socialUser: SocialUser;
  private _token: string;
  private _refreshToken: string;
  private _mostRecentSuccessfulServerInteraction: Date;
  private _isAdmin: boolean;
  userNameSubject: Subject<string> = new Subject();
  socialUserSubject: BehaviorSubject<SocialUser> = new BehaviorSubject(undefined);

  get token(): string { return this._token; }
  set token(newToken: string) { this._token = newToken; }
  get refreshToken(): string { return this._refreshToken; }
  set refreshToken(newRefreshToken: string) { this._refreshToken = newRefreshToken; }
  get mostRecentSuccessfulServerInteraction(): Date { return this._mostRecentSuccessfulServerInteraction; }
  set mostRecentSuccessfulServerInteraction(value: Date) { this._mostRecentSuccessfulServerInteraction = value; }
  get userName(): string { return this._userName; }
  get isAdmin(): boolean { return this._isAdmin; }


  isUserCurrentlyLoggedIn(): boolean {
    return (this._userName != null ) || (this._socialUser != null);
  }

  clean() {
    this.setCurrentUser(undefined, undefined, undefined, undefined, undefined);
  }

  setCurrentUser(userName: string, socialUser: SocialUser, token: string, isAdmin: boolean, refreshToken: string) {
    this._userName = userName;
    this._socialUser = socialUser;
    this._token = token;
    this._isAdmin = isAdmin;
    this._refreshToken = refreshToken;
    this._mostRecentSuccessfulServerInteraction = undefined;
    this.userNameSubject.next(this._userName);
    this.socialUserSubject.next(this._socialUser);
  }



}
