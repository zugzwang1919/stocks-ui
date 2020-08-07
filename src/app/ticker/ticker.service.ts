import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { UtilService } from '../wolfe-common/util.service';
import { Ticker } from './ticker';
import { WolfeHttpService } from '../wolfe-common/wolfe-http.service';

@Injectable({
  providedIn: 'root'
})
export class TickerService {

  constructor(
    private util: UtilService,
    private wolfeHttpService: WolfeHttpService
  ) { }

  create(tickerSymbol: string, name: string, isBenchmark: boolean): Observable<Ticker> {
    const createTickerUrl: string = this.util.buildUrl('/stock');
    const params = { ticker: tickerSymbol, name, benchmark: isBenchmark };
    return this.wolfeHttpService.post(createTickerUrl, params, null)
      .pipe(
        catchError(this.util.handleStandardError)
      );
  }

  retrieveAll(): Observable<Ticker[]> {
    const retrieveAllTickersUrl: string = this.util.buildUrl('/stock');
    return  this.wolfeHttpService.get(retrieveAllTickersUrl)
      .pipe(
        catchError(this.util.handleStandardError)
      );
  }

  retrieve(id: number): Observable<Ticker> {
    const retrieveOneTickerUrl: string = this.util.buildUrl('/stock/' + id);
    return  this.wolfeHttpService.get(retrieveOneTickerUrl)
      .pipe(
        catchError(this.util.handleStandardError)
      );
  }

  update(id: number, name: string, isBenchmark: boolean): Observable<Ticker> {
    const updateOneTickerUrl: string = this.util.buildUrl('/stock/' + id);
    const params = { name, benchmark: isBenchmark };
    return this.wolfeHttpService.post(updateOneTickerUrl, params, null)
      .pipe(
        catchError(this.util.handleStandardError)
      );


  }

  delete(id: number): Observable<any> {
    const deleteOneTickerUrl: string = this.util.buildUrl('/stock/' + id);
    return  this.wolfeHttpService.delete(deleteOneTickerUrl)
      .pipe(
        catchError(this.util.handleStandardError)
      );
  }


}
