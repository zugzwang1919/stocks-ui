import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel} from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { TickerTransaction } from '../ticker-transaction';
import { TickerTransactionService } from '../ticker-transaction.service';
import { AlertService } from 'src/app/general/alert/alert.service';

@Component({
  selector: 'app-ticker-transactions',
  templateUrl: './ticker-transactions.component.html',
  styleUrls: ['./ticker-transactions.component.sass']
})
export class TickerTransactionsComponent implements OnInit, AfterViewInit {

  initialData: TickerTransaction[] = [];
  dataSource = new MatTableDataSource<TickerTransaction>(this.initialData);
  selection = new SelectionModel<TickerTransaction>(true, []);
  displayedColumns: string[] = ['select', 'portfolio.portfolioName', 'stock.ticker', 'activity', 'tradeSize', 'amount'];
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private alertService: AlertService,
    private changeDetectorRef: ChangeDetectorRef,
    private tickerTransactionService: TickerTransactionService
  ) { }

  ngOnInit(): void {
    this.updateTickerTransactions();
  }

  /*
  After the View has been rendered, attach the sorting mechanism to the table
  TODO: I'm not sure why this can't be done during ngOnInit()
  */
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }


  private updateTickerTransactions() {
    this.tickerTransactionService.retrieveAll()
      .subscribe(
        // If this goes well, update the list of TickerTransactions
        tickerTransactions =>  {
          // Set the data in the table to be the data that was returned from the service
          this.dataSource.data = tickerTransactions;
          // Indicate that the data in the table has changed
          this.changeDetectorRef.detectChanges();
          // Reset the check boxes
          this.selection = new SelectionModel<TickerTransaction>(true, []);
        },
        // If the retrieval goes poorly, show the error
        error => this.alertService.error(error)
      );
  }

  deleteSelectedTickerTransaction() {

  }

  editSelectedTickerTransaction() {

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
  checkboxLabel(row?: TickerTransaction): string {
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
