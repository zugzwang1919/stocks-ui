import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { OptionTransaction } from '../option-transaction';
import { OptionTransactionService } from '../option-transaction.service';
import { AlertService } from 'src/app/general/alert/alert.service';
import { WolfeGenericListDirective } from '../../wolfe-common/wolfe-generic-list-directive';
import { WolfeCheckboxInTableService } from 'src/app/wolfe-common/wolfe-checkbox-in-table.service';

@Component({
  selector: 'app-option-transactions',
  templateUrl: './option-transactions.component.html',
  styleUrls: ['./option-transactions.component.sass']
})
export class OptionTransactionsComponent extends WolfeGenericListDirective<OptionTransaction> implements OnInit {

  displayedColumns: string[] = ['select', 'date', 'portfolioName', 'optionName', 'activity', 'numberOfContracts', 'amount'];

  constructor(
    router: Router,
    alertService: AlertService,
    optionTransactionService: OptionTransactionService,
    public wcits: WolfeCheckboxInTableService
  ) {
    super(router,
          alertService,
          optionTransactionService,
          '/option-transaction');
  }


  flattenItemIfNecessary(ot: OptionTransaction): any {
    const flatItem: any = {};
    flatItem.id = ot.id;
    flatItem.createDate = ot.createDate;
    flatItem.updateDate = ot.updateDate;
    flatItem.portfolioName = ot.portfolio.portfolioName;
    flatItem.date = ot.date;
    flatItem.activity = ot.activity;
    flatItem.optionName = ot.option.getName();
    flatItem.numberOfContracts = ot.numberOfContracts;
    flatItem.amount = ot.amount;
    return flatItem;
  }


}
