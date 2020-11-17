import { Component, OnInit, ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';


import { Ticker } from '../ticker';
import { TickerService } from '../ticker.service';
import { AlertService } from 'src/app/general/alert/alert.service';
import { WolfeGenericListDirective } from '../../wolfe-common/wolfe-generic-list-directive';
import { WolfeCheckboxInTableService } from 'src/app/wolfe-common/wolfe-checkbox-in-table.service';


@Component({
  selector: 'app-tickers',
  templateUrl: './tickers.component.html',
  styleUrls: ['./tickers.component.sass']
})

export class TickersComponent extends WolfeGenericListDirective<Ticker>  implements OnInit {

  displayedColumns: string[] = ['select', 'ticker', 'name', 'benchmark', 'createDate', 'updateDate'];

  constructor(
    router: Router,
    alertService: AlertService,
    portfolioService: TickerService,
    changeDetectorRefs: ChangeDetectorRef,
    public wcits: WolfeCheckboxInTableService
  ) {
    super(router,
          alertService,
          portfolioService,
          changeDetectorRefs,
          '/ticker',
          (t: Ticker): string => t.ticker);
  }
}
