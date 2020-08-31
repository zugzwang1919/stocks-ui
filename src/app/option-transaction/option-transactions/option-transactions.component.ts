import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { OptionTransaction } from '../option-transaction';
import { OptionTransactionService } from '../option-transaction.service';
import { AlertService } from 'src/app/general/alert/alert.service';
import { WolfeGenericListComponent } from '../../wolfe-common/wolfe-generic-list-component';

@Component({
  selector: 'app-option-transactions',
  templateUrl: './option-transactions.component.html',
  styleUrls: ['./option-transactions.component.sass']
})
export class OptionTransactionsComponent extends WolfeGenericListComponent<OptionTransaction> implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['select', 'date', 'portfolio.portfolioName', 'option.name', 'activity', 'numberOfContracts', 'amount'];

  constructor(
    router: Router,
    alertService: AlertService,
    optionTransactionService: OptionTransactionService,
    changeDetectorRefs: ChangeDetectorRef
  ) {
    super(router,
          alertService,
          optionTransactionService,
          changeDetectorRefs,
          '/option-transaction',
          (ot: OptionTransaction): string => 'The selected option transaction was deleted' );
  }
}
