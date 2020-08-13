import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { UtilService } from '../wolfe-common/util.service';
import { Ticker } from './ticker';
import { WolfeRDService } from '../wolfe-common/wolfe-rd';
import { WolfeHttpService } from '../wolfe-common/wolfe-http.service';

@Injectable({
  providedIn: 'root'
})
export class TickerService extends WolfeRDService<Ticker> {

  constructor(
    wolfeHttpService: WolfeHttpService
  ) {
    super(wolfeHttpService, '/stock');
  }

  // NOTE: retrieve(), retrieveAll(), and delete() are picked up
  //       from the base class

  create(tickerSymbol: string, name: string, isBenchmark: boolean): Observable<Ticker> {
    const params = { ticker: tickerSymbol, name, benchmark: isBenchmark };
    return this.wolfeHttpService.post('/stock', params, null);
  }

  update(id: number, name: string, isBenchmark: boolean): Observable<Ticker> {
    const params = { name, benchmark: isBenchmark };
    return this.wolfeHttpService.post('/stock/' + id, params, null);
  }

}
