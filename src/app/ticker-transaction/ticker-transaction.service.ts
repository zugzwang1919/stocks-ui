import { Injectable } from '@angular/core';

import { TickerTransaction } from './ticker-transaction';
import { WolfeRDService } from '../wolfe-common/wolfe-rd';
import { WolfeHttpService } from '../wolfe-common/wolfe-http.service';


@Injectable({
  providedIn: 'root'
})
export class TickerTransactionService extends WolfeRDService<TickerTransaction>{

  constructor(
    wolfeHttpService: WolfeHttpService
  ) {
    super(wolfeHttpService, '/stock-transaction');
  }

  // NOTE: retrieve(), retrieveAll(), and delete() are picked up
  //       from the base class

}
