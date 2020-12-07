import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { StockTransaction } from '../stock-transaction';
import { StockTransactionService } from '../stock-transaction.service';
import { AlertService } from 'src/app/general/alert/alert.service';
import { WolfeGenericListDirective } from '../../wolfe-common/wolfe-generic-list-directive';
import { WolfeCheckboxInTableService } from 'src/app/wolfe-common/wolfe-checkbox-in-table.service';
import { Portfolio } from 'src/app/portfolio/portfolio';
import { Stock } from 'src/app/stock/stock';
import { MatSelectChange } from '@angular/material/select';
import { PortfolioService } from 'src/app/portfolio/portfolio.service';
import { StockService } from 'src/app/stock/stock.service';
import { WolfeGenericFilteredListDirective } from 'src/app/wolfe-common/wolfe-generic-filtered-list.directive';


@Component({
  selector: 'app-stock-transactions',
  templateUrl: './stock-transactions.component.html',
  styleUrls: ['./stock-transactions.component.sass']
})
export class StockTransactionsComponent extends WolfeGenericFilteredListDirective<StockTransaction>  implements OnInit {

  displayedColumns: string[] = ['select', 'date', 'portfolioName', 'ticker', 'activity', 'tradeSize', 'amount'];


  constructor(
    router: Router,
    alertService: AlertService,
    portfolioService: PortfolioService,
    stockService: StockService,
    stockTransactionService: StockTransactionService,
    public wcits: WolfeCheckboxInTableService
  ) {
    super(router,
          alertService,
          stockTransactionService,
          '/stock-transaction',
          portfolioService,
          stockService);
  }





  filterFunction(flattenedStockTransaction: any): boolean {

    if (this.selectedPortfolio === -1 && this.selectedStock === -1 ) {
      return true;
    }
    if (this.selectedPortfolio !== -1 && this.selectedStock !== -1) {
      return  flattenedStockTransaction.portfolioId === this.selectedPortfolio &&
              flattenedStockTransaction.stockId === this.selectedStock;
    }
    if (this.selectedPortfolio !== -1) {
      return flattenedStockTransaction.portfolioId === this.selectedPortfolio;
    }
    if (this.selectedStock !== -1 ) {
      return flattenedStockTransaction.stockId === this.selectedStock;
    }

    throw Error('Impossible state encountered in filterFunction of stock-transaction component.');

  }

  flattenItemIfNecessary(st: StockTransaction): any {
    const flatItem: any = {};
    flatItem.id = st.id;
    flatItem.createDate = st.createDate;
    flatItem.updateDate = st.updateDate;
    flatItem.portfolioId = st.portfolio.id;
    flatItem.portfolioName = st.portfolio.portfolioName;
    flatItem.date = st.date;
    flatItem.stockId = st.stock.id;
    flatItem.ticker = st.stock.ticker;
    flatItem.activity = st.activity;
    flatItem.tradeSize = st.tradeSize;
    flatItem.amount = st.amount;
    return flatItem;
  }
}
