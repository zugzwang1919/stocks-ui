import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { SocialUser } from 'angularx-social-login';


import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/general/alert/alert.service';
import { BusyService } from 'src/app/general/busy/busy.service';
import { CurrentUserService } from '../current-user/current-user.service';
import { AuthenticationSupported, Profile } from '../profile';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit, OnDestroy {


  busy = false;
  routeSubscription: Subscription;
  profile: Profile = new Profile();
  usesIdPwAuthentication: boolean;
  usesGoogleAuthentication: boolean;
  socialUser: SocialUser;
  private currentSocialUserSubscription: Subscription;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected alertService: AlertService,
    protected busyService: BusyService,
    protected currentUserService: CurrentUserService,
    protected userService: UserService
  ) {}


  ngOnInit(): void {

    this.routeSubscription = this.activatedRoute.url.subscribe((urlSegments) => this.initialize(urlSegments));
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
    this.currentSocialUserSubscription.unsubscribe();
  }


  private initialize(urlSegments: UrlSegment[]) {
    // reset any previous alerts
    this.alertService.clear();

    // indicate that we're busy
    this.setBusyStatus(true);

    this.userService.retrieveProfile()
    .subscribe(
      (profile: Profile)  =>  {
        // If this goes well...
        // Update our local copy of the profile.
        this.setBusyStatus(false);
        // Set the values that the template will reference
        this.profile = profile;
        this.usesIdPwAuthentication = this.containsAuthentication(AuthenticationSupported.ID_PW);
        this.usesGoogleAuthentication = this.containsAuthentication(AuthenticationSupported.GOOGLE);
        // Now get some of the info from the current user
        // this.currentUserService.socialUserSubject.next(this.socialUser);

      },
      error => {
        // If this goes poorly...
        // Indicate that we're not waiting any more
        this.setBusyStatus(false);
        // Display the error
        this.alertService.error(error);
      }
    );

    this.currentSocialUserSubscription = this.currentUserService.socialUserSubject
    .subscribe((socialUser: SocialUser) => {
      this.socialUser = socialUser;
    });

   }

  private setBusyStatus(requestedSetting: boolean) {
    this.busy = requestedSetting;
    if (requestedSetting) {
      this.busyService.busy(8154);
    }
    else {
      this.busyService.finished(8154);
    }
  }

  private containsAuthentication(authenticationTypeOfInterest: AuthenticationSupported): boolean {
    return this.profile.authenticationsSupported.find(at => at === authenticationTypeOfInterest) !== undefined;
  }
}
