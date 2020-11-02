import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel} from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Portfolio } from '../portfolio';
import { PortfolioService } from '../portfolio.service';
import { AlertService } from 'src/app/general/alert/alert.service';
import { WolfeGenericListComponent } from '../../wolfe-common/wolfe-generic-list-component';
import { WolfeCheckboxInTableService } from 'src/app/wolfe-common/wolfe-checkbox-in-table.service';

@Component({
  selector: 'app-portfolios',
  templateUrl: './portfolios.component.html',
  styleUrls: ['./portfolios.component.sass']
})
export class PortfoliosComponent extends WolfeGenericListComponent<Portfolio>  implements OnInit {

  displayedColumns: string[] = ['select', 'portfolioName', 'createDate', 'updateDate'];

  constructor(
    router: Router,
    alertService: AlertService,
    portfolioService: PortfolioService,
    changeDetectorRefs: ChangeDetectorRef,
    public wcits: WolfeCheckboxInTableService
  ) {
    super(router,
          alertService,
          portfolioService,
          changeDetectorRefs,
          '/portfolio',
          (p: Portfolio): string => p.portfolioName);
  }
}
