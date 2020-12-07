import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { Stock } from '../stock';
import { StockService } from '../stock.service';
import { AlertService } from 'src/app/general/alert/alert.service';
import { WolfeGenericListDirective } from '../../wolfe-common/wolfe-generic-list-directive';
import { WolfeCheckboxInTableService } from 'src/app/wolfe-common/wolfe-checkbox-in-table.service';


@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.sass']
})

export class StocksComponent extends WolfeGenericListDirective<Stock>  implements OnInit {

  displayedColumns: string[] = ['select', 'ticker', 'name', 'benchmark', 'createDate', 'updateDate'];

  constructor(
    router: Router,
    alertService: AlertService,
    portfolioService: StockService,
    public wcits: WolfeCheckboxInTableService
  ) {
    super(router,
          alertService,
          portfolioService,
          '/stock');
  }
}
