import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

import { AlertService } from 'src/app/general/alert/alert.service';
import { UserService } from '../user.service';

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
      confirmPassword: ['', [Validators.required]],
      emailAddress: ['', [Validators.required]]
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


  getErrorUserName(): string {
    return '';
  }

  getErrorPassword(): string {
    return '';
  }

  getErrorConfirmPassword(): string {
    return '';
  }

  getErrorEmailAddress(): string {
    return '';
  }

}
