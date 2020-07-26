import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CurrentUserService } from './current-user.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-current-user',
  templateUrl: './current-user.component.html',
  styleUrls: ['./current-user.component.sass']
})
export class CurrentUserComponent implements OnInit {

  currentUserName: string;
  currentUserSubscription: Subscription;

  constructor(
    private currentUserService: CurrentUserService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.currentUserSubscription = this.currentUserService.userNameSubject
      .subscribe((value) => this.currentUserName = value);
  }

  handleLogout() {
    this.userService.logout();
    // Navigate to the Welcome screen
    this.router.navigate(['/welcome']);
  }

}
