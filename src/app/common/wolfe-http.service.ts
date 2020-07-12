import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WolfeHttpResponseService } from './wolfe-http-response-service';
import { WolfeHttpResponse } from './wolfe-http-response';
import { CurrentUserService } from '../user/current-user/current-user.service';

@Injectable({
  providedIn: 'root'
})

export class WolfeHttpService {

  constructor(
    private httpClient: HttpClient,
    private wolfeHttpResponseService: WolfeHttpResponseService,
    private currentUserService: CurrentUserService
  ) { }

  createAppropriateHeaders(): HttpHeaders {
    const headers = new HttpHeaders();
    // I thought that I would need to add headers like "Content-Type" and "Accept", but it looks like
    // AngularJS's http implementation is doing all of tha for me.  If I need to add those
    // type of headers, this is the place to do it.

    // If the user has logged in, add the authorization headers
    const token: string = this.currentUserService.token;
    if (token != null) {
      headers.append('Authorization', token);
    }
    return headers;
  }

  get(url) {
    const headers = new HttpHeaders();
    return this.httpClient.get(url, {
      headers: this.createAppropriateHeaders()
    });
  }

  post(url, params, data) {
    const headers = new Headers();
    return this.httpClient.post<any>(url, data, {
          params,
          headers: this.createAppropriateHeaders()
      });
  }

  put(url, data) {
    const headers = new Headers();
    return this.httpClient.put(url, data, {
      headers: this.createAppropriateHeaders()
    });
  }

  delete(url) {
    const headers = new Headers();
    return this.httpClient.delete(url,  {
      headers: this.createAppropriateHeaders()
    });
  }

}

