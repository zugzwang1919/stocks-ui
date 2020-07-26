import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  // STRING  utils
  isEmptyNullOrUndefined(inputString: string): boolean {
    return !(this.hasContent(inputString));
  }

  hasContent(inputString: string): boolean {
    return inputString && (inputString !== '');
  }

  // Help other services build an HTTP URL to talk to our server
  buildUrl(inputString: string): string {
    return 'http://' + environment.serverName + ':' + environment.serverPort + inputString;
  }

  // This method will help other services interpret the HTTP response that comes back from our
  // server.  Should the server ever change the way that it provides the UI an error, this
  // should be the only place that will need to change.
  handleStandardError(errorResponse: HttpErrorResponse): Observable<never> {
    return throwError(errorResponse.error.message);
  }
}
