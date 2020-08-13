import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CurrentUserService } from '../user/current-user/current-user.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {

  constructor(
    private currentUserService: CurrentUserService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      // NOTE the double equals (rather than triple) to take care of null and undefined
      if (this.currentUserService.userName == null) {
        this.router.navigate(['login'], {queryParams: {redirectUrl: state.url}});
        return false;
      }
      return true;
  }

}
