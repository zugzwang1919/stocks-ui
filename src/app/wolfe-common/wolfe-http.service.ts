import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError, repeatWhen, retryWhen, tap, switchMap } from 'rxjs/operators';

import { CurrentUserService } from '../user/current-user/current-user.service';
import { environment } from '../../environments/environment';
import { AuthenticationResponse } from './authentication-response';

@Injectable({
  providedIn: 'root'
})

export class WolfeHttpService {

  private MINUTES_BETWEEN_TOKEN_CHECK = 2;
  private MILLIS_BETWEEN_TOKEN_CHEDK = this.MINUTES_BETWEEN_TOKEN_CHECK * 60 * 1000;
  constructor(
    private httpClient: HttpClient,
    private currentUserService: CurrentUserService
  ) {
    // Start a timer that will keep the access token current where appropriate
    setInterval(() => {
      this.updateTokensIfAppropriate();
    }, this.MILLIS_BETWEEN_TOKEN_CHEDK);
  }


  get(urlPath: string, params?: any): Observable<any> {
    const url: string = this.buildUrl(urlPath);
    return this.retryableHttpExecutor(() => {
      return this.httpClient.get<any>(url, {
        params,
        headers: this.createAppropriateHeaders()
      });
    });
  }

  post(urlPath: string, params, data) {
    const url: string = this.buildUrl(urlPath);
    return this.retryableHttpExecutor(() => {
      return this.httpClient.post<any>(url, data, {
            params,
            headers: this.createAppropriateHeaders()
        });
    });
  }

  put(urlPath: string, data) {
    const url: string = this.buildUrl(urlPath);
    return this.retryableHttpExecutor(() => {
      return this.httpClient.put(url, data, {
        headers: this.createAppropriateHeaders()
      });
    });
  }

  delete(urlPath: string, params?: any) {
    const url: string = this.buildUrl(urlPath);
    return this.retryableHttpExecutor(() => {
      return this.httpClient.delete(url,  {
        params,
        headers: this.createAppropriateHeaders()
      });
    });
  }

  // This is
  private retryableHttpExecutor(workerFunction: () => Observable<any>): Observable<any> {
    // Make the original request (Get, Put, Post, or Delete)
    return this.simpleHttpExecutor(workerFunction)
      .pipe(
        catchError((requestError) => {
          // If we get back a 401  && there has been an active user (i.e., this is not a login)
          if (requestError.status === 401 && this.currentUserService.refreshToken) {
            // Take the refresh token and try to get a new token
            return this.httpClient.post<any>(this.buildUrl('/refreshtoken'), null,
              { params: { refreshToken: this.currentUserService.refreshToken},
                headers: this.createAppropriateHeaders() })
              .pipe(
                // tap() will be activated if the request to create a new token is successful
                // inside tap() we should not change the Observable
                tap( ar => {
                  this.currentUserService.token = ar.token;
                  this.currentUserService.refreshToken = ar.refreshToken;
                }),
                // catchError() will be activated if the request to get a new token fails
                catchError(refreshError => {
                  this.currentUserService.clean();
                  return throwError('You have been logged out due to inactivity.');
                }),
                // Since we have successfully updated the token, let's RETRY the orignal request
                // NOTE: We use switchMap here.  We don't want to modify the existing Observable or
                // NOTE: we would use map().  We actually want to create a new Observable
                switchMap(() => {
                  return this.simpleHttpExecutor(workerFunction)
                    .pipe(
                      // Tweak the error if we get one on the retry
                      catchError(retryError => {
                        return this.tweakError(retryError);
                      })
                    );
                })
              );
          }
          // Tweak the non-401 error on the original request
          else {
            return this.tweakError(requestError);
          }
        })
      );
  }

  // Helper to build a full url to our server given the path portion
  private buildUrl(urlPath: string): string {
    return 'http://' + environment.serverName + ':' + environment.serverPort + urlPath;
  }

  // This method provides a way that common code can be excuted around any HTTP Request
  // Right now, all we do is record the time of any successful completion
  private simpleHttpExecutor(workerFunction: () => Observable<any>): Observable<any> {
    return workerFunction()
      .pipe(
        tap(() => this.handleAllSuccessfulRequests())
      );
  }

  // This method handles all successful requests.  It should be noted that this method
  // will not modify the content of the pipe
  private handleAllSuccessfulRequests() {
    this.currentUserService.mostRecentSuccessfulServerInteraction = new Date();
  }

  // This method will help other services interpret the HTTP response that comes back from our
  // server.  Should the server ever change the way that it provides the UI an error, this
  // should be the only place that will need to change.
  private tweakError(errorResponse: HttpErrorResponse): Observable<never> {
    // If our backend created the response, there should be something in errorResponse.error.message
    // If not, there will hopefully be something in errorResponse.message
    return throwError(errorResponse.error.message || errorResponse.message);
  }

  // This method creates the headers that are required to talk to our serve
  private createAppropriateHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    // I thought that I would need to add headers like "Content-Type" and "Accept", but it looks like
    // AngularJS's http implementation is doing all of tha for me.  If I need to add those
    // type of headers, this is the place to do it.

    // If the user has logged in, add the authorization headers
    const token: string = this.currentUserService.token;
    if (token != null) {
      headers = headers.append('Authorization', 'Bearer ' + token);
    }

    return headers;
  }


  // This method is all about keeping the access token current as long as the user has been active
  // It will likely be called from within a timer
  private updateTokensIfAppropriate() {
    // If we've successfully interacted with the server in the last period, go ahead and proactively get a new token
    if (this.currentUserService.mostRecentSuccessfulServerInteraction &&
      // NOTE: I remove 15 seconds, just out of a concern that the request to refresh the token will be the only
      // NOTE: activity that will cause a refresh of the token over and over again
      new Date().getTime() - this.currentUserService.mostRecentSuccessfulServerInteraction.getTime()  < (+this.MINUTES_BETWEEN_TOKEN_CHECK - 0.25) * 60 * 1000)  {
      this.post('/refreshtoken', {refreshToken: this.currentUserService.refreshToken}, null)
        .subscribe(

          (ar: AuthenticationResponse)  =>  {
            // If this goes well...
            // Save the new token and refresh token
            this.currentUserService.token = ar.token;
            this.currentUserService.refreshToken = ar.refreshToken;
          },
            // This shouldn't ever occur, so I guess we'll stick something in the console
          error => {
            console.log('Scheduled: Surprisingly, an error occurred while trying to "automatically" get a new token.');
          }
        );
    }
  }


}

