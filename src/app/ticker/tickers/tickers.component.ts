import { Component, OnInit, ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
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
export class TickersComponent implements OnInit, AfterViewInit {

  initialData: Ticker[] = [{ticker: 'AAPL', name: 'Apple', benchmark: false, createDate: 'yesterday', updateDate: 'tomorrow'},
                            {ticker: 'GOOG', name: 'Google', benchmark: false, createDate: 'yesterday', updateDate: 'tomorrow'}  ];

  dataSource =  new MatTableDataSource<Ticker>();
  displayedColumns: string[] = ['ticker', 'name', 'benchmark', 'createDate', 'updateDate'];

 /*
  @ViewChild(MatSort, {static: false}) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  */
 @ViewChild(MatSort) sort: MatSort;


  constructor(
    private alertService: AlertService,
    private tickerService: TickerService,
    private changeDetectorRefs: ChangeDetectorRef
  ) { }


  ngOnInit(): void {
    this.tickerService.retrieveAll()
      .subscribe(
        // If this goes well, update the list of Tickers
        tickers =>  {
          // Set the data in the table to be the data that was returned from the service
          this.dataSource.data = tickers;
          // Indicate that the data in the table has changed
          this.changeDetectorRefs.detectChanges();
          // this.dataSource.sort = this.sort;
          // Indicate to MatSort that changes have been made, so the user can sort the new data
          // this.dataSource.sort._stateChanges.next();
        },
        // If the registration goes poorly, show the error
        error => this.alertService.error(error)
      );
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
}
