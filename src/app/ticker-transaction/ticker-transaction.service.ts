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

  create(date: Date, portfolioId: number, stockId: boolean, activity: string, tradeSize: string, amount: string | number): Observable<TickerTransaction> {
    // Massage the data to get it into the correct format
    const dateString: string = this.datePipe.transform(date, 'yyyy-MM-dd');
    const amountString: string = amount.toString().replace('$', '').replace(',', '');   // NOTE: using toString() in the event a number is passed in
    // Build the parameters
    const params = { date: dateString, portfolioId, stockId, activity, tradeSize, amount: amountString };
    // Post the request
    return this.wolfeHttpService.post('/stock-transaction', params, null);
  }

  update(id: number, date: Date, portfolioId: number, stockId: boolean, activity: string, tradeSize: string, amount: string | number): Observable<TickerTransaction> {
    // Massage the data to get it into the correct format
    const dateString: string = this.datePipe.transform(date, 'yyyy-MM-dd');
    const amountString: string = amount.toString().replace('$', '').replace(',', '');   // NOTE: using toString() in the event a number is passed in
    // Build the parameters
    const params = { id, date: dateString, portfolioId, stockId, activity, tradeSize, amount: amountString };
    // Post the request
    return this.wolfeHttpService.post('/stock-transaction/' + id, params, null);
  }
}
