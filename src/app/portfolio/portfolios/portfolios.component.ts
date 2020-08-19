import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel} from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Portfolio } from '../portfolio';
import { PortfolioService } from '../portfolio.service';
import { AlertService } from 'src/app/general/alert/alert.service';
import { WolfeListOfThings } from '../../wolfe-common/wolfe-list-of-things';

@Component({
  selector: 'app-portfolios',
  templateUrl: './portfolios.component.html',
  styleUrls: ['./portfolios.component.sass']
})
export class PortfoliosComponent extends WolfeListOfThings<Portfolio>  implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['select', 'portfolioName', 'createDate', 'updateDate'];

  constructor(
    router: Router,
    alertService: AlertService,
    portfolioService: PortfolioService,
    changeDetectorRefs: ChangeDetectorRef
  ) {
    super(router,
          alertService,
          portfolioService,
          changeDetectorRefs,
          '/portfolio',
          (p: Portfolio): string => p.portfolioName );
  }
}
