import { AfterViewInit, Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { LoginResponse } from './login-response';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/general/alert/alert.service';
import { CurrentUserService } from '../current-user/current-user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit, AfterViewInit {

  loginGroup: FormGroup;
  futureUrl: string;
  hidePassword = true;


  // See the comment below in ngAfterViewInit()
  @ViewChild('userNameInput') userNameInputField: ElementRef;

  constructor(
    private alertService: AlertService,
    private changeDetectorRef: ChangeDetectorRef,
    private currentUserService: CurrentUserService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.loginGroup = this.formBuilder.group({
      userName: ['', [Validators.required ]],
      password: ['', [Validators.required ]]
    });
    // Remember where the user wanted to go.  If nowhere send him to the
    // main page ('/') when the login is successful.
    this.futureUrl = this.route.snapshot.queryParams.redirectUrl || '/';
  }

  ngAfterViewInit() {
    // NOTE: This seems to be overkill, but I could not get "autofocus" and "cdkInitialFocus" to work other
    // NOTE: than on the very first time the component is displayed.  The use of a ViewChild and explicitly
    // NOTE: setting the focus will work.  Seems ridiculous that I cannot either handle this all in the
    // NOTE: html template OR just be able to get to the native element through the FormGroup.  Sigh.

    // Set the focus to the User Name input
    this.userNameInputField.nativeElement.focus();
    // Indicate to the angular that we've changed something to prevent
    // errors from showing up in the console.
    this.changeDetectorRef.detectChanges();
  }


  onSubmit() {
    // reset any previous alerts
    this.alertService.clear();

    // Call the login service & try to login
    const userName: string = this.loginGroup.get('userName').value;
    this.userService.login(userName, this.loginGroup.get('password').value)
      .subscribe(

        lr  =>  {
          // If this goes well...
          // Set the current user
          this.currentUserService.setCurrentUser(userName, lr.token, lr.admin);
          // and navigate to the appropriate page
          this.router.navigate([this.futureUrl]);
        },
          // If this goes poorly, indicate that
        error => {
          this.alertService.error(error);
        }
      );
  }

  getErrorUserName(): string {
    return this.loginGroup.get('userName').hasError('required') ? 'You must provide a user name.' : '';
  }

  getErrorPassword(): string {
    return this.loginGroup.get('password').hasError('required') ? 'You must provide a password.' : '';
  }

}
