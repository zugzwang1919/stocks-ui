import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { UtilService } from '../common/util.service';
import { Ticker } from './ticker';
import { WolfeHttpService } from '../common/wolfe-http.service';

@Injectable({
  providedIn: 'root'
})
export class TickerService {

  constructor(
    private util: UtilService,
    private wolfeHttpService: WolfeHttpService
  ) { }

  retrieveAll(): Observable<Ticker[]> {

    const retrieveAllTickersUrl: string = this.util.buildUrl('/stock');
    return  this.wolfeHttpService.get(retrieveAllTickersUrl)
      .pipe(
        catchError(this.util.handleStandardError)
      );
  }


}
