import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Portfolio } from '../portfolio';
import { PortfolioService } from '../portfolio.service';
import { AlertService } from 'src/app/general/alert/alert.service';
import { WolfeGenericListDirective } from '../../wolfe-common/wolfe-generic-list-directive';
import { WolfeCheckboxInTableService } from 'src/app/wolfe-common/wolfe-checkbox-in-table.service';

@Component({
  selector: 'app-portfolios',
  templateUrl: './portfolios.component.html',
  styleUrls: ['./portfolios.component.sass']
})
export class PortfoliosComponent extends WolfeGenericListDirective<Portfolio>  implements OnInit {

  displayedColumns: string[] = ['select', 'portfolioName', 'createDate', 'updateDate'];

  constructor(
    router: Router,
    alertService: AlertService,
    portfolioService: PortfolioService,
    public wcits: WolfeCheckboxInTableService
  ) {
    super(router,
          alertService,
          portfolioService,
          '/portfolio');
  }
}
