import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TickerService } from 'src/app/ticker/ticker.service';
import { WolfeGenericService } from 'src/app/wolfe-common/wolfe-generic-service';
import { WolfeTrackedItem } from 'src/app/wolfe-common/wolfe-tracked-item';
import { DataSource } from '@angular/cdk/table';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { AlertService } from 'src/app/general/alert/alert.service';
import { Ticker } from 'src/app/ticker/ticker';
import { Portfolio } from 'src/app/portfolio/portfolio';
import { PortfolioService } from 'src/app/portfolio/portfolio.service';
import { CalculatorService } from '../calculator.service';

@Component({
  selector: 'app-income-calculator',
  templateUrl: './income-calculator.component.html',
  styleUrls: ['./income-calculator.component.sass']
})
export class IncomeCalculatorComponent implements OnInit {


  selectedTimeframe = 'All Dates';
  timeframes: string[] = ['All Dates', 'This Calendar Year', 'Previous Calendar Year', 'Previous and This Calendar Year',
                          'Last Twelve Months', 'Last Twenty-four Months', 'Custom Dates'];

  portfolioInitialData: any[] = [];
  portfolioDataSource = new MatTableDataSource(this.portfolioInitialData);
  portfolioSelection = new SelectionModel(true, []);
  portfolioDisplayedColumns: string[] = ['select', 'portfolioName'];

  tickerInitialData: any[] = [];
  tickerDataSource = new MatTableDataSource(this.tickerInitialData);
  tickerSelection = new SelectionModel(true, []);
  tickerDisplayedColumns: string[] = ['select', 'ticker', 'name'];



  constructor(
    private alertService: AlertService,
    private calculatorService: CalculatorService,
    private changeDetectorRef: ChangeDetectorRef,
    private portfolioService: PortfolioService,
    private tickerService: TickerService
  ) { }

  ngOnInit(): void {

    // Populate the Portfolio List
    this.populateSelectionTable(this.portfolioService, this.portfolioDataSource,
                                (a, b) => a.portfolioName < b.portfolioName ? -1 : a.portfolioName > b.portfolioName ? 1 : 0,
                                this.changeDetectorRef, this.portfolioSelection, this.alertService);
    // Populate the Ticker List
    this.populateSelectionTable(this.tickerService, this.tickerDataSource,
                                (a, b) => a.ticker < b.ticker ? -1 : a.ticker > b.ticker ? 1 : 0,
                                this.changeDetectorRef, this.tickerSelection, this.alertService);
  }

  onSubmit() {
    // reset any previous alerts
    this.alertService.clear();


    // Try to create the new security/stock/etf/mutual fund/ticker


    this.calculatorService.analyzeIncome( undefined,
                                          undefined,
                                          this.portfolioSelection.selected.map((p: Portfolio) => p.id),
                                          this.tickerSelection.selected.map((t: Ticker) => t.id),
                                          true,
                                          true)
      .subscribe(
          // SUCCESS! ->  navigate to the Porfolio List Page
          results  =>  { return; },
          // ERROR! -> Display the error
          error => this.alertService.error(error)
      );
  }
  private populateSelectionTable(retrievalService: WolfeGenericService<WolfeTrackedItem>, dataSource: MatTableDataSource<WolfeTrackedItem>,
                                 sortFunction: (a: any, b: any) => number,
                                 changeDetectorRef: ChangeDetectorRef, selection: SelectionModel<WolfeTrackedItem>,
                                 alertService: AlertService) {
    retrievalService.retrieveAll()
      .subscribe(
        // If this goes well, update the list of Tickers
        items =>  {

          // Flatten the data that was returned by the service so that it can be sorted
          // and then associate it with the DataSource
          // FIXME: Eventually allow the possibility of flattening the structure
          dataSource.data = sortFunction ? items.sort(sortFunction) : items;
          // dataSource.data = items.map(this.flattenItemIfNecessary);

          // Indicate that the data in the table has changed
          changeDetectorRef.detectChanges();
          // Reset the check boxes
          selection = new SelectionModel(true, []);
        },
        // If the retrieval goes poorly, show the error
        error => alertService.error(error)
      );
  }


  /** Whether the number of selected elements matches the total number of rows. */
  areAllSelected(selectionModel: SelectionModel<any>, dataSource: MatTableDataSource<any>) {
    const numSelected = selectionModel.selected.length;
    const numRows = dataSource.data.length;
    return numSelected === numRows;
  }

  checkboxLabel(selectionModel: SelectionModel<any>, dataSource: MatTableDataSource<any>, row?: WolfeTrackedItem): string {
    if (!row) {
        return `${this.areAllSelected(selectionModel, dataSource) ? 'select' : 'deselect'} all`;
    }
    return (selectionModel.isSelected(row) ? 'deselect ' : 'select ')  + row.id;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(selectionModel: SelectionModel<any>, dataSource: MatTableDataSource<any>) {
    this.areAllSelected(selectionModel, dataSource) ?
        selectionModel.clear() :
        dataSource.data.forEach(row => selectionModel.select(row));
  }



}
