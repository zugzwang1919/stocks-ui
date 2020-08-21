import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { TickerTransaction } from '../ticker-transaction';
import { TickerTransactionService } from '../ticker-transaction.service';
import { AlertService } from 'src/app/general/alert/alert.service';
import { WolfeGenericListComponent } from '../../wolfe-common/wolfe-generic-list-component';

@Component({
  selector: 'app-ticker-transactions',
  templateUrl: './ticker-transactions.component.html',
  styleUrls: ['./ticker-transactions.component.sass']
})
export class TickerTransactionsComponent extends WolfeGenericListComponent<TickerTransaction>  implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['select', 'date', 'portfolio.portfolioName', 'stock.ticker', 'activity', 'tradeSize', 'amount'];

  constructor(
    router: Router,
    alertService: AlertService,
    tickerTransactionService: TickerTransactionService,
    changeDetectorRefs: ChangeDetectorRef
  ) {
    super(router,
          alertService,
          tickerTransactionService,
          changeDetectorRefs,
          '/ticker-transaction',
          (tt: TickerTransaction): string => 'The selected transaction was deleted' );
  }
}
