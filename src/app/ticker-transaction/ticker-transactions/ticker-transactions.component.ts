import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TickerTransaction } from '../ticker-transaction';
import { TickerTransactionService } from '../ticker-transaction.service';
import { AlertService } from 'src/app/general/alert/alert.service';
import { WolfeGenericListDirective } from '../../wolfe-common/wolfe-generic-list-directive';
import { WolfeCheckboxInTableService } from 'src/app/wolfe-common/wolfe-checkbox-in-table.service';
import { Portfolio } from 'src/app/portfolio/portfolio';
import { Ticker } from 'src/app/ticker/ticker';
import { MatSelectChange } from '@angular/material/select';
import { PortfolioService } from 'src/app/portfolio/portfolio.service';
import { TickerService } from 'src/app/ticker/ticker.service';
import { WolfeGenericFilteredListDirective } from 'src/app/wolfe-common/wolfe-generic-filtered-list.directive';


@Component({
  selector: 'app-ticker-transactions',
  templateUrl: './ticker-transactions.component.html',
  styleUrls: ['./ticker-transactions.component.sass']
})
export class TickerTransactionsComponent extends WolfeGenericFilteredListDirective<TickerTransaction>  implements OnInit {

  displayedColumns: string[] = ['select', 'date', 'portfolioName', 'ticker', 'activity', 'tradeSize', 'amount'];


  constructor(
    router: Router,
    alertService: AlertService,
    portfolioService: PortfolioService,
    tickerService: TickerService,
    tickerTransactionService: TickerTransactionService,
    public wcits: WolfeCheckboxInTableService
  ) {
    super(router,
          alertService,
          tickerTransactionService,
          '/ticker-transaction',
          portfolioService,
          tickerService);
  }





  filterFunction(flattenedTickerTransaction: any): boolean {

    if (this.selectedPortfolio === -1 && this.selectedTicker === -1 ) {
      return true;
    }
    if (this.selectedPortfolio !== -1 && this.selectedTicker !== -1) {
      return  flattenedTickerTransaction.portfolioId === this.selectedPortfolio &&
              flattenedTickerTransaction.tickerId === this.selectedTicker;
    }
    if (this.selectedPortfolio !== -1) {
      return flattenedTickerTransaction.portfolioId === this.selectedPortfolio;
    }
    if (this.selectedTicker !== -1 ) {
      return flattenedTickerTransaction.tickerId === this.selectedTicker;
    }

    throw Error('Impossible state encountered in filterFunction of ticker-transaction component.');

  }

  flattenItemIfNecessary(tt: TickerTransaction): any {
    const flatItem: any = {};
    flatItem.id = tt.id;
    flatItem.createDate = tt.createDate;
    flatItem.updateDate = tt.updateDate;
    flatItem.portfolioId = tt.portfolio.id;
    flatItem.portfolioName = tt.portfolio.portfolioName;
    flatItem.date = tt.date;
    flatItem.tickerId = tt.stock.id;
    flatItem.ticker = tt.stock.ticker;
    flatItem.activity = tt.activity;
    flatItem.tradeSize = tt.tradeSize;
    flatItem.amount = tt.amount;
    return flatItem;
  }
}
