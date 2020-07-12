import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { LoginResponse } from './login-response';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/general/alert/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  loginGroup: FormGroup;
  futureUrl: string;

  constructor(
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private loginService: LoginService,
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
    this.futureUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit() {
    // reset any previous alerts
    this.alertService.clear();

    // Call the login service & try to login
    this.loginService.login(this.loginGroup.get('userName').value, this.loginGroup.get('password').value)
      .subscribe(
        // If this goes well, for now, navigate to the home page
        success =>  this.router.navigate([this.futureUrl]),
        // If this goes poorly, indicate that
        error => {
          this.alertService.error('The user name / password combination was not valid.');
        }
      );
  }

  getErrorUserName(): string {
    return this.loginGroup.controls['userName'].hasError('required') ? 'You must provide a user name.' : '';
  }

  getErrorPassword(): string {
    return this.loginGroup.controls['password'].hasError('required') ? 'You must provide a password.' : '';
  }

}
