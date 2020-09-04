import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TickerTransaction } from './ticker-transaction';
import { WolfeGenericService } from '../wolfe-common/wolfe-generic-service';
import { WolfeHttpService } from '../wolfe-common/wolfe-http.service';


@Injectable({
  providedIn: 'root'
})
export class TickerTransactionService extends WolfeGenericService<TickerTransaction> {

  constructor(
    private datePipe: DatePipe,
    wolfeHttpService: WolfeHttpService
  ) {
    super(wolfeHttpService, '/stock-transaction');
  }

  // NOTE: retrieve(), retrieveAll(), and delete() are picked up
  //       from the base class

  create(date: Date, portfolioId: number, stockId: number, activity: string, tradeSize: string | number, amount: string | number): Observable<TickerTransaction> {
    // Build the parameters
    const params = this.buildParams(date, portfolioId, stockId, activity, tradeSize, amount);
    // Post the request
    return this.wolfeHttpService.post('/stock-transaction', params, null);
  }

  update(id: number, date: Date, portfolioId: number, stockId: number, activity: string, tradeSize: string | number, amount: string | number): Observable<TickerTransaction> {
    // Build the parameters
    const params = this.buildParams(date, portfolioId, stockId, activity, tradeSize, amount);
    // Post the request
    return this.wolfeHttpService.post('/stock-transaction/' + id, params, null);
  }

  private buildParams(date: Date, portfolioId: number, stockId: number, activity: string, tradeSize: string | number, amount: string | number) {
    const params: any = {};
    params.date = this.datePipe.transform(date, 'yyyy-MM-dd');
    params.portfolioId = portfolioId;
    params.stockId = stockId;
    params.activity = activity;
    params.tradeSize = tradeSize.toString().replace(',', '');  // NOTE: using toString() in the event a number is passed in
    params.amount = amount.toString().replace('$', '').replace(',', '');   // NOTE: using toString() in the event a number is passed in
    return params;
  }

  // Override so that we can provide a fully functional Ticker object
  buildFullyFuctionalModel(shallowTickerTransaction: any): TickerTransaction {
    return new TickerTransaction(shallowTickerTransaction);
  }

}
