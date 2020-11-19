import { Component, OnInit } from '@angular/core';
import { CurrentUserService } from 'src/app/user/current-user/current-user.service';
import { UserService } from 'src/app/user/user.service';
import { AlertService } from '../alert/alert.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.sass']
})
export class MainPageComponent implements OnInit {

  constructor(
    private alertService: AlertService,
    private userService: UserService,
    private currentUserService: CurrentUserService
  ) { }

  ngOnInit(): void {
  }

  quickLogin() {
    // reset any previous alerts
    this.alertService.clear();

    // Call the service for a "quick login"
    this.userService.quickLogin()
      .subscribe(

        lr  =>  {
          // If this goes well...
          // Set the current user
          this.currentUserService.setCurrentUser(lr.username, lr.token, lr.admin);
        },
          // If this goes poorly, indicate that
        error => {
          this.alertService.error(error);
        }
      );
  }
}
