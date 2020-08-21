import { Component, OnInit, ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';


import { Ticker } from '../ticker';
import { TickerService } from '../ticker.service';
import { AlertService } from 'src/app/general/alert/alert.service';
import { WolfeGenericListComponent } from '../../wolfe-common/wolfe-generic-list-component';


@Component({
  selector: 'app-tickers',
  templateUrl: './tickers.component.html',
  styleUrls: ['./tickers.component.sass']
})

export class TickersComponent extends WolfeGenericListComponent<Ticker>  implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['select', 'ticker', 'name', 'benchmark', 'createDate', 'updateDate'];

  constructor(
    router: Router,
    alertService: AlertService,
    portfolioService: TickerService,
    changeDetectorRefs: ChangeDetectorRef
  ) {
    super(router,
          alertService,
          portfolioService,
          changeDetectorRefs,
          '/ticker',
          (t: Ticker): string => t.ticker );
  }
}
