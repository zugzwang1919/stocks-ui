import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CurrentUserService } from '../user/current-user/current-user.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class WolfeHttpService {

  constructor(
    private httpClient: HttpClient,
    private currentUserService: CurrentUserService
  ) { }

  get(urlPath: string, params?: any) {
    const url: string = this.buildUrl(urlPath);
    const headers = new HttpHeaders();
    return this.httpClient.get<any>(url, {
      params,
      headers: this.createAppropriateHeaders()
    });
  }

  post(urlPath: string, params, data) {
    const url: string = this.buildUrl(urlPath);
    return this.wolfeHttpExecutor(() => {
      const headers = new Headers();
      return this.httpClient.post<any>(url, data, {
            params,
            headers: this.createAppropriateHeaders()
        });
    });
  }

  put(urlPath: string, data) {
    const url: string = this.buildUrl(urlPath);
    return this.wolfeHttpExecutor(() => {
      const headers = new Headers();
      return this.httpClient.put(url, data, {
        headers: this.createAppropriateHeaders()
      });
    });
  }

  delete(urlPath: string) {
    const url: string = this.buildUrl(urlPath);
    return this.wolfeHttpExecutor(() => {
      const headers = new Headers();
      return this.httpClient.delete(url,  {
        headers: this.createAppropriateHeaders()
      });
    });
  }


  // Helper to build a full url to our server given the path portion
  private buildUrl(urlPath: string): string {
    return 'http://' + environment.serverName + ':' + environment.serverPort + urlPath;
  }

  // This method can be used by the methods above to massage the errors that come back from the
  // server into a consumable string
  private wolfeHttpExecutor(workerFunction: () => Observable<any>): Observable<any> {
    return workerFunction()
      .pipe(
        catchError(this.handleWolfeError)
      );
  }

  // This method will help other services interpret the HTTP response that comes back from our
  // server.  Should the server ever change the way that it provides the UI an error, this
  // should be the only place that will need to change.
  private handleWolfeError(errorResponse: HttpErrorResponse): Observable<never> {
    return throwError(errorResponse.error.message);
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
    const headersHasStuff: boolean = headers.has('Authorization');
    return headers;
  }



}

