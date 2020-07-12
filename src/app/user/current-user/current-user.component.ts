import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { CurrentUserService } from './current-user.service';
import { LoginService } from '../login/login.service';

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
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.currentUserSubscription = this.currentUserService.userNameSubject
      .subscribe((value) => this.currentUserName = value);
  }

  handleLogout() {
    alert('We got the logout request!');
    this.loginService.logout();
  }

}
