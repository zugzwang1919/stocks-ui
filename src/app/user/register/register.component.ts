import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormControl, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

import { AlertService } from 'src/app/general/alert/alert.service';
import { UserService } from '../user.service';
import { compileFactoryFunction } from '@angular/compiler';

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
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.registerGroup = this.formBuilder.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required, this.checkConfirmationPassword(this)]],
      emailAddress: ['', [Validators.required, Validators.email]]
    });

  }

  onSubmit() {
    // reset any previous alerts
    this.alertService.clear();

    // Call the user service to register this new user
    this.userService.register(this.registerGroup.get('userName').value,
                              this.registerGroup.get('password').value,
                              this.registerGroup.get('emailAddress').value)
      .subscribe(
        // If this goes well, for now, navigate to the login page
        success =>  this.router.navigate(['/login']),
        // If this goes poorly, indicate that
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
