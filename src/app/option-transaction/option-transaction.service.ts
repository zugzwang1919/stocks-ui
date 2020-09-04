import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';

import { OptionTransaction } from './option-transaction';
import { WolfeGenericService } from '../wolfe-common/wolfe-generic-service';
import { WolfeHttpService } from '../wolfe-common/wolfe-http.service';

@Injectable({
  providedIn: 'root'
})
export class OptionTransactionService extends WolfeGenericService<OptionTransaction> {

  constructor(
    private datePipe: DatePipe,
    wolfeHttpService: WolfeHttpService
  ) {
    super(wolfeHttpService, '/option-transaction');
  }

  // NOTE: retrieve(), retrieveAll(), and delete() are picked up
  //       from the base class

  create(date: Date, portfolioId: number, optionId: number, activity: string, numberOfContracts: string | number, amount: string | number): Observable<OptionTransaction> {
    // Build the parameters
    const params = this.buildParams(date, portfolioId, optionId, activity, numberOfContracts, amount);
    // Post the request
    return this.wolfeHttpService.post('/option-transaction', params, null);
  }

  update(id: number, date: Date, portfolioId: number, optionId: number, activity: string,
         numberOfContracts: string | number, amount: string | number): Observable<OptionTransaction> {
    // Build the parameters
    const params = this.buildParams(date, portfolioId, optionId, activity, numberOfContracts, amount);
    // Post the request
    return this.wolfeHttpService.post('/option-transaction/' + id, params, null);
  }

  private buildParams(date: Date, portfolioId: number, optionId: number, activity: string, numberOfContracts: string | number, amount: string | number) {
    const params: any = {};
    params.date = this.datePipe.transform(date, 'yyyy-MM-dd');
    params.portfolioId = portfolioId;
    params.optionId = optionId;
    params.activity = activity;
    params.numberOfContracts = numberOfContracts.toString().replace(',', '');  // NOTE: using toString() in the event a number is passed in
    params.amount = amount.toString().replace('$', '').replace(',', '');   // NOTE: using toString() in the event a number is passed in
    return params;
  }

  // Override so that we can provide a fully functional Option object
  buildFullyFuctionalModel(thinOptionTransaction: any): OptionTransaction {
    return new OptionTransaction(thinOptionTransaction);
  }

}
