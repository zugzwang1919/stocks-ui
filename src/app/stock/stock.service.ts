import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { UtilService } from '../wolfe-common/util.service';
import { Stock } from './stock';
import { WolfeGenericService } from '../wolfe-common/wolfe-generic-service';
import { WolfeHttpService } from '../wolfe-common/wolfe-http.service';

@Injectable({
  providedIn: 'root'
})
export class StockService extends WolfeGenericService<Stock> {

  constructor(
    wolfeHttpService: WolfeHttpService
  ) {
    super(wolfeHttpService, '/stock');
  }

  // NOTE: retrieve(), retrieveAll(), and delete() are picked up
  //       from the base class

  retrieveAllBenchmarks() {
    return this.wolfeHttpService.get('/stock/benchmarks');
  }

  create(tickerSymbol: string, name: string, isBenchmark: boolean): Observable<Stock> {
    const params = { ticker: tickerSymbol, name, benchmark: isBenchmark };
    return this.wolfeHttpService.post('/stock', params, null);
  }

  update(id: number, name: string, isBenchmark: boolean): Observable<Stock> {
    const params = { name, benchmark: isBenchmark };
    return this.wolfeHttpService.post('/stock/' + id, params, null);
  }

  // Override so that we can provide a fully functional Stock object
  buildFullyFuctionalModel(shallowStock: any): Stock {
    const t: Stock = new Stock(shallowStock);
    return t;
  }

}
