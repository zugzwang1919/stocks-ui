import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel} from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Portfolio } from '../portfolio';
import { PortfolioService } from '../portfolio.service';
import { AlertService } from 'src/app/general/alert/alert.service';
@Component({
  selector: 'app-portfolios',
  templateUrl: './portfolios.component.html',
  styleUrls: ['./portfolios.component.sass']
})
export class PortfoliosComponent implements OnInit, AfterViewInit {

  initialData: Portfolio[] = [];
  dataSource = new MatTableDataSource<Portfolio>(this.initialData);
  selection = new SelectionModel<Portfolio>(true, []);
  displayedColumns: string[] = ['select', 'portfolioName', 'createDate', 'updateDate'];

  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private router: Router,
    private alertService: AlertService,
    private portfolioService: PortfolioService,
    private changeDetectorRefs: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.updatePortfolios();
  }

  /*
  After the View has been rendered, attach the sorting mechanism to the table
  TODO: I'm not sure why this can't be done during ngOnInit()
  */
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  deleteSelectedPortfolio() {
    // Before we take any action, clear any error messages that have been previously displayed
    this.alertService.clear();
    // There should be exactly one ticker selected to get here
    const portfolio: Portfolio = this.selection.selected[0];
    this.portfolioService.delete(portfolio.id)
      .subscribe(
        success => {
            this.alertService.success(portfolio.id + ' was successfully deleted');
            this.updatePortfolios();
        },
        error => this.alertService.error(error)
      );
  }

  editSelectedPortfolio() {
    // navigate to the appropriate page
    this.router.navigate(['/portfolio/' + this.selection.selected[0].id]);
  }

  updatePortfolios() {
    this.portfolioService.retrieveAll()
      .subscribe(
        // If this goes well, update the list of Tickers
        portfolios =>  {
          // Set the data in the table to be the data that was returned from the service
          this.dataSource.data = portfolios;
          // Indicate that the data in the table has changed
          this.changeDetectorRefs.detectChanges();
          // Reset the check boxes
          this.selection = new SelectionModel<Portfolio>(true, []);
        },
        // If the registration goes poorly, show the error
        error => this.alertService.error(error)
      );
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Portfolio): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} ticker id ${row.id}`;
  }

  isExactlyOneSelected(): boolean {
    return this.selection.selected.length === 1;
  }

  areAnySelected(): boolean {
    return this.selection.selected.length !== 0;
  }

}
