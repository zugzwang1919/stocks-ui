import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { OptionTransaction } from '../option-transaction';
import { OptionTransactionService } from '../option-transaction.service';
import { AlertService } from 'src/app/general/alert/alert.service';
import { WolfeGenericListDirective } from '../../wolfe-common/wolfe-generic-list-directive';
import { WolfeCheckboxInTableService } from 'src/app/wolfe-common/wolfe-checkbox-in-table.service';
import { PortfolioService } from 'src/app/portfolio/portfolio.service';
import { TickerService } from 'src/app/ticker/ticker.service';
import { WolfeGenericFilteredListDirective } from 'src/app/wolfe-common/wolfe-generic-filtered-list.directive';

@Component({
  selector: 'app-option-transactions',
  templateUrl: './option-transactions.component.html',
  styleUrls: ['./option-transactions.component.sass']
})
export class OptionTransactionsComponent extends WolfeGenericFilteredListDirective<OptionTransaction> implements OnInit {

  displayedColumns: string[] = ['select', 'date', 'portfolioName', 'optionName', 'activity', 'numberOfContracts', 'amount'];

  constructor(
    router: Router,
    alertService: AlertService,
    optionTransactionService: OptionTransactionService,
    public wcits: WolfeCheckboxInTableService,
    portfolioService: PortfolioService,
    tickerService: TickerService
  ) {
    super(router,
          alertService,
          optionTransactionService,
          '/option-transaction',
          portfolioService,
          tickerService
          );
  }


  filterFunction(flattenedOptionTransaction: any): boolean {

    if (this.selectedPortfolio === -1 && this.selectedTicker === -1 ) {
      return true;
    }
    if (this.selectedPortfolio !== -1 && this.selectedTicker !== -1) {
      return  flattenedOptionTransaction.portfolioId === this.selectedPortfolio &&
              flattenedOptionTransaction.optionTickerId === this.selectedTicker;
    }
    if (this.selectedPortfolio !== -1) {
      return flattenedOptionTransaction.portfolioId === this.selectedPortfolio;
    }
    if (this.selectedTicker !== -1 ) {
      return flattenedOptionTransaction.optionTickerId === this.selectedTicker;
    }

    throw Error('Impossible state encountered in filterFunction of ticker-transaction component.');

  }

  flattenItemIfNecessary(ot: OptionTransaction): any {
    const flatItem: any = {};
    flatItem.id = ot.id;
    flatItem.createDate = ot.createDate;
    flatItem.updateDate = ot.updateDate;
    flatItem.portfolioId = ot.portfolio.id;
    flatItem.portfolioName = ot.portfolio.portfolioName;
    flatItem.date = ot.date;
    flatItem.activity = ot.activity;
    flatItem.optionName = ot.option.getName();
    flatItem.optionTickerId = ot.option.stock.id;
    flatItem.numberOfContracts = ot.numberOfContracts;
    flatItem.amount = ot.amount;
    return flatItem;
  }


}
