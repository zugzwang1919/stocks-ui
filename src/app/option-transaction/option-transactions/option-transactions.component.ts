import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { OptionTransaction } from '../option-transaction';
import { OptionTransactionService } from '../option-transaction.service';
import { AlertService } from 'src/app/general/alert/alert.service';
import { WolfeGenericListDirective } from '../../wolfe-common/wolfe-generic-list-directive';
import { WolfeCheckboxInTableService } from 'src/app/wolfe-common/wolfe-checkbox-in-table.service';
import { PortfolioService } from 'src/app/portfolio/portfolio.service';
import { StockService } from 'src/app/stock/stock.service';
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
    stockService: StockService
  ) {
    super(router,
          alertService,
          optionTransactionService,
          '/option-transaction',
          portfolioService,
          stockService
          );
  }


  filterFunction(flattenedOptionTransaction: any): boolean {

    if (this.selectedPortfolio === -1 && this.selectedStock === -1 ) {
      return true;
    }
    if (this.selectedPortfolio !== -1 && this.selectedStock !== -1) {
      return  flattenedOptionTransaction.portfolioId === this.selectedPortfolio &&
              flattenedOptionTransaction.optionStockId === this.selectedStock;
    }
    if (this.selectedPortfolio !== -1) {
      return flattenedOptionTransaction.portfolioId === this.selectedPortfolio;
    }
    if (this.selectedStock !== -1 ) {
      return flattenedOptionTransaction.optionStockId === this.selectedStock;
    }

    throw Error('Impossible state encountered in filterFunction of stock-transaction component.');

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
    flatItem.optionStockId = ot.option.stock.id;
    flatItem.numberOfContracts = ot.numberOfContracts;
    flatItem.amount = ot.amount;
    return flatItem;
  }


}
