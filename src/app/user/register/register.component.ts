import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormControl, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AlertService } from 'src/app/general/alert/alert.service';
import { UserService } from '../user.service';
import { CurrentUserService } from '../current-user/current-user.service';
import { AuthenticationResponse } from '../../wolfe-common/authentication-response';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {

  registerGroup: FormGroup;

  constructor(
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private currentUserService: CurrentUserService
  ) { }

  ngOnInit(): void {
    this.registerGroup = this.formBuilder.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required, this.checkConfirmationPassword(this)]],
      emailAddress: ['', [Validators.required, Validators.email]]
    });

    // In addition to the validation above, whenever the password field changes,
    // validate the confirmation password.  This handles the situation where one types 'a'
    // in the password field, 'b' in the confirm field, then changes the password field to 'b'
    // to match it.
    this.registerGroup.get('password').valueChanges
    .subscribe((value: string) => {
      this.registerGroup.get('confirmPassword').updateValueAndValidity();
    });

  }

  onSubmit() {
    // reset any previous alerts
    this.alertService.clear();

    // Call the user service to register this new user
    const userName: string = this.registerGroup.get('userName').value;
    const password: string = this.registerGroup.get('password').value;
    this.userService.register(userName,
                              password,
                              this.registerGroup.get('emailAddress').value)
      .subscribe(
        // If this goes well, login the user and then navigate to the welcome page
        success =>  {
          this.userService.login(userName, password)
            .subscribe(
              (lr: AuthenticationResponse) => {
                // Set the current user
                this.currentUserService.setCurrentUser(userName, undefined, lr.token, lr.admin, lr.refreshToken);
                // Navigate to the welcome page
                this.router.navigate(['/welcome']);
              },
              // If the login goes poorly (highly unlikely), then make something up
              error => this.alertService.error('An unexpected error occured when logging in the new user.')
            );
        },
        // If the registration goes poorly, show the error
        error => {
          this.alertService.error(error);
        }
      );
  }

  checkConfirmationPassword(registerComponent: RegisterComponent): ValidatorFn {
    return (confirmPasswordControl: FormControl) => {
      const registerGroup: FormGroup = registerComponent.registerGroup;
      // This does seem to get called with the controls are being built
      // We don't need to do any validation if everything is not fully formed
      if (registerGroup && registerGroup.controls) {
        const passwordControl = registerGroup.controls.password;
        if (passwordControl.value !== confirmPasswordControl.value) {
          return { notSame: true };
        }
      }
      return null;
    };
  }

  getErrorUserName(): string {
    return this.registerGroup.get('userName').hasError('required') ? 'You must provide a user name.' : '';
  }

  getErrorPassword(): string {
    return this.registerGroup.get('password').hasError('required') ? 'You must provide a password.' : '';
  }

  getErrorConfirmPassword(): string {
    const confirmPasswordControl: AbstractControl = this.registerGroup.get('confirmPassword');
    return confirmPasswordControl.hasError('required') ? 'You must confirm your password.' :
            confirmPasswordControl.hasError('notSame') ? 'Your confirmation password does not match.' : '';
  }

  getErrorEmailAddress(): string {
    const emailPasswordControl: AbstractControl = this.registerGroup.get('emailAddress');
    return emailPasswordControl.hasError('required') ? 'You must provide an email address.' :
            emailPasswordControl.hasError('email') ? 'A valid email address was not specified.' : '';
  }

}
