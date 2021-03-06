import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


import { Portfolio } from './portfolio';
import { Stock } from '../stock/stock';
import { WolfeGenericService } from '../wolfe-common/wolfe-generic-service';
import { WolfeHttpService } from '../wolfe-common/wolfe-http.service';
import { throwIfEmpty } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class PortfolioService extends WolfeGenericService<Portfolio> {

  constructor(
    wolfeHttpService: WolfeHttpService
  ) {
    super(wolfeHttpService, '/portfolio');
  }

  // NOTE: retrieve(), retrieveAll(), and delete() are picked up
  //       from the base class

  create(portfolioName: string): Observable<Portfolio> {
    return this.wolfeHttpService.post('/portfolio', { portfolioName }, null);
  }

  update(id: number, portfolioName: string): Observable<Portfolio> {
    return this.wolfeHttpService.post('/portfolio/' + id, { portfolioName }, null);
  }

  // Override so that we can provide a fully functional Portfolio object
  buildFullyFuctionalModel(thinPortfolio: any): Portfolio {
    return new Portfolio(thinPortfolio);
  }

  retrieveSecuritiesWithTransactionsInPorfolios(portfolioIds: number[]): Observable<Stock[]> {
    return this.wolfeHttpService.get('/portfolio/tickers', { portfolioIds} );
  }
}
