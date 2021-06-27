import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CurrentUserService } from './current-user.service';
import { UserService } from '../user.service';
import { SocialUser } from 'angularx-social-login';

@Component({
  selector: 'app-current-user',
  templateUrl: './current-user.component.html',
  styleUrls: ['./current-user.component.sass']
})
export class CurrentUserComponent implements OnInit {

  currentUserName: string;
  currentUserImageUrl: string;
  currentUserSubscription: Subscription;
  currentUserImageUrlSubscription: Subscription;
  constructor(
    private currentUserService: CurrentUserService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.currentUserSubscription = this.currentUserService.userNameSubject
      .subscribe((value) => {
        this.currentUserName = value;
        // If the userName has been deleted, it's indicative of the user being logged out or timed out
        // If this occurs, let's navigate to the login page
        if (!this.currentUserName) {
          this.router.navigate(['/login']);
        }
      });
    this.currentUserImageUrlSubscription = this.currentUserService.socialUserSubject
      .subscribe((socialUser: SocialUser) => {
        this.currentUserImageUrl = socialUser && socialUser.photoUrl || undefined;
      });
  }

  handleLogout() {
    this.userService.logout();
    // Navigate to the Login screen
    this.router.navigate(['/login']);
  }

}
