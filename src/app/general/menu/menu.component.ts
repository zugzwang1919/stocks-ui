import { Component, OnInit } from '@angular/core';
import { CurrentUserService } from 'src/app/user/current-user/current-user.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.sass']
})
export class MenuComponent implements OnInit {



  constructor(
    private currentUserService: CurrentUserService
  ) { }

  isAdmin: boolean;

  ngOnInit(): void {
    this.currentUserService.userNameSubject
      .subscribe(
        currentUserChanged  =>  {
          this.isAdmin = this.currentUserService.isAdmin;
        },
          // If this goes poorly, indicate that
        error => {
          // this.alertService.error(error);
        }
      );

  }

}
