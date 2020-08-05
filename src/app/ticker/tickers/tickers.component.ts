import { Component, OnInit, ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
import { SelectionModel} from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Ticker } from '../ticker';
import { TickerService } from '../ticker.service';
import { AlertService } from 'src/app/general/alert/alert.service';

@Component({
  selector: 'app-tickers',
  templateUrl: './tickers.component.html',
  styleUrls: ['./tickers.component.sass']
})
export class TickersComponent implements OnInit, AfterViewInit  {

  initialData: Ticker[] = [{ticker: 'AAPL', name: 'Apple', benchmark: false, createDate: new Date(), updateDate: new Date() },
                            {ticker: 'GOOG', name: 'Google', benchmark: false, createDate: new Date(), updateDate: new Date() }  ];

  dataSource =  new MatTableDataSource<Ticker>(this.initialData);
  selection = new SelectionModel<Ticker>(true, []);
  displayedColumns: string[] = ['select', 'ticker', 'name', 'benchmark', 'createDate', 'updateDate'];

 @ViewChild(MatSort) sort: MatSort;


  constructor(
    private alertService: AlertService,
    private tickerService: TickerService,
    private changeDetectorRefs: ChangeDetectorRef
  ) { }


  ngOnInit(): void {
    this.updateTickers();
  }

  /*
  After the View has been rendered, attach the sorting mechanism to the table
  TODO: I'm not sure why this can't be done during ngOnInit()
  */
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  deleteSelectedTickers() {
    const ticker = this.selection.selected[0];
    this.tickerService.delete(ticker.id)
      .subscribe(
        success => {
            this.alertService.success(ticker.ticker + ' was successfully deleted');
            this.updateTickers();
        },
        error => this.alertService.error(error)
      );
  }

  editSelectedTicker() {
    this.alertService.error('You\'re trying to edit a ticker!');
  }

  updateTickers() {
    this.tickerService.retrieveAll()
      .subscribe(
        // If this goes well, update the list of Tickers
        tickers =>  {
          // Set the data in the table to be the data that was returned from the service
          this.dataSource.data = tickers;
          // Indicate that the data in the table has changed
          this.changeDetectorRefs.detectChanges();
          // Reset the check boxes
          this.selection = new SelectionModel<Ticker>(true, []);
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
  checkboxLabel(row?: Ticker): string {
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
