import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { CurrentUserComponent } from './current-user/current-user.component';
import { RegisterComponent } from './register/register.component';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';

import { environment } from '../..//environments/environment';
import { WolfeAngularModule } from '../wolfe-angular/wolfe-angular.module';
import { WolfeMaterialModule } from '../wolfe-material/wolfe-material.module';
import { WolfeCommonModule } from '../wolfe-common/wolfe-common.module';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  declarations: [
    LoginComponent,
    CurrentUserComponent,
    RegisterComponent,
    ProfileComponent],
  imports: [
    // The Angular Modules that we tend to use
    WolfeAngularModule,
    // The Material Modules that we tend to use
    WolfeMaterialModule,
    // Common Services, Pipes, Directives, and Classes that we've authored
    WolfeCommonModule,
    // Third party modules that this module uses
    SocialLoginModule
  ],
  exports: [
    CurrentUserComponent,
    LoginComponent,
    ProfileComponent,
    RegisterComponent
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.googleClientId)
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('clientId')
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ],
})
export class UserModule { }
