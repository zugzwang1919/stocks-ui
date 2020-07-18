import { Component, OnInit } from '@angular/core';
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
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.currentUserSubscription = this.currentUserService.userNameSubject
      .subscribe((value) => this.currentUserName = value);
  }

  handleLogout() {
    this.userService.logout();
  }

}
