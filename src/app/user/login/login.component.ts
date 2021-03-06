import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,  Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { AuthenticationResponse } from '../../wolfe-common/authentication-response';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/general/alert/alert.service';
import { CurrentUserService } from '../current-user/current-user.service';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider, AmazonLoginProvider } from 'angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  socialUser: SocialUser;
  loginGroup: FormGroup;
  futureUrl: string;
  hidePassword = true;



  constructor(
    private alertService: AlertService,
    private socialAuthService: SocialAuthService,
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
    this.futureUrl = this.route.snapshot.queryParams.redirectUrl;

  }



  // "Normal" Login with User / Password maintained by our server

  onSubmit() {
    // reset any previous alerts
    this.alertService.clear();

    // Call the login service & try to login
    const userName: string = this.loginGroup.get('userName').value;
    this.userService.login(userName, this.loginGroup.get('password').value)
      .subscribe(

        (loginResponse: AuthenticationResponse)  =>  {
          // If this goes well...
          // Set the current user
          this.currentUserService.setCurrentUser(userName, undefined, loginResponse.token, loginResponse.admin, loginResponse.refreshToken);
          // and navigate to the next page if the user was heading somewhere.
          // if they weren't headed anywhere, just send them back to the main page ('/')
          this.router.navigate([this.futureUrl || '/']);
        },
        // If this goes poorly, show the error
        error => {
          this.alertService.error(error);
        }
      );
  }

  // OAuth2 logins with Google, Facebook, Amazon

  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((socialUser: SocialUser) => {
        // If the user is logging in
        this.userService.loginWithGoogle(socialUser.idToken)
          .subscribe(
            (loginResponse: AuthenticationResponse) => {
              // Only update this page (socialUser) and the CurrentUserComponent if the server accepts the request
              this.socialUser = socialUser;
              this.currentUserService.setCurrentUser(undefined, socialUser, loginResponse.token, loginResponse.admin, loginResponse.refreshToken);
              // and navigate to the next page if the user was heading somewhere.
              // if they weren't headed anywhere, just send them back to the main page ('/')
              this.router.navigate([this.futureUrl || '/']);
            },
            // If this goes poorly, show the error
            error => {
              this.alertService.error(error);
            }
          );
      });
  }

  signInWithFB(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then(x => console.log(x));
  }

  signInWithAmazon(): void {
    this.socialAuthService.signIn(AmazonLoginProvider.PROVIDER_ID).then(x => console.log(x));
  }


  // Methods used by the html template

  getErrorUserName(): string {
    return this.loginGroup.get('userName').hasError('required') ? 'You must provide a user name.' : '';
  }

  getErrorPassword(): string {
    return this.loginGroup.get('password').hasError('required') ? 'You must provide a password.' : '';
  }

}
