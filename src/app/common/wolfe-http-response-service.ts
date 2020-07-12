import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

import { WolfeHttpResponse } from './wolfe-http-response';

@Injectable({
  providedIn: 'root'
})


export class WolfeHttpResponseService {
  private serviceReturnCode: ServiceReturnCode;
  private message: string;

/*
  constructor(res: Response) {
    switch (res.status) {
      case 200:
        this.serviceReturnCode = ServiceReturnCode.OK;
        this.message = 'Success!';
        break;
      case 301:
        this.serviceReturnCode = ServiceReturnCode.AUTHENTICATION_ERROR;
        this.message = res.json();
        break;
      default:
        this.serviceReturnCode = ServiceReturnCode.ERROR;
        this.message = res.json().message;
        break;
    }
  }
*/
  buildWolfeHttpResponse(httpResponse: Observable<HttpResponse<any>>): Observable<WolfeHttpResponse> {
    const observableWolfeHttpResponse = new Subject<WolfeHttpResponse>();

    httpResponse.subscribe(
      res => {
        console.log('Inside WolfeHttpResponsServie - Success');
        const newResponse: WolfeHttpResponse = new WolfeHttpResponse();
        newResponse.wolfeHttpResponseCode = WolfeHttpResponse.WolfeHttpResponseCode.OK;
        newResponse.message = 'Success!!!';
        observableWolfeHttpResponse.next(newResponse);
      },
      err => {
        console.log('Error!');
        const newResponse: WolfeHttpResponse = new WolfeHttpResponse();
        newResponse.wolfeHttpResponseCode = WolfeHttpResponse.WolfeHttpResponseCode.ERROR;
        newResponse.message = err.message;
        observableWolfeHttpResponse.next(newResponse);
      },
      () => console.log('Subscription closed on Http Response')
    );

    return observableWolfeHttpResponse;
  }

  getMessage(): string {
    return this.message;
  }

  setMessage(newMessage: string): void {
    this.message = newMessage;
  }


  /*
  getServiceReturnCode() : ServiceReturnCode {
    return this.getServiceReturnCode;
  }
  */

}

enum ServiceReturnCode {
  OK,
  AUTHENTICATION_ERROR,
  ERROR
}
