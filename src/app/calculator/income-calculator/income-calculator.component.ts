import { Component, OnInit, ChangeDetectorRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
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
import { MatSort } from '@angular/material/sort';
import { ThrowStmt } from '@angular/compiler';
import { stringify } from 'querystring';
import { FormControl } from '@angular/forms';
import { BusyService } from 'src/app/general/busy/busy.service';


enum TimeFrame {
  ALL_DATES = 'All Dates',
  THIS_CALENDAR_YEAR = 'This Calendar Year',
  PREVIOUS_CALENDAR_YEAR = 'Previous Calendar Year',
  PREVIOUS_AND_THIS_CALENDAR_YEAR = 'Previous and This Calendar Year',
  LAST_TWELVE_MONTHS = 'Last Twelve Months',
  LAST_TWENTY_FOUR_MONTHS = 'Last Twenty-four Months',
  CUSTOM_DATES = 'Custom Dates'
}

@Component({
  selector: 'app-income-calculator',
  templateUrl: './income-calculator.component.html',
  styleUrls: ['./income-calculator.component.sass']
})
export class IncomeCalculatorComponent implements OnInit {

  entryIsVisible = true;
  busy = false;

  selectedTimeframe: TimeFrame =  TimeFrame.ALL_DATES;
  timeframes: string[] = [TimeFrame.ALL_DATES, TimeFrame.THIS_CALENDAR_YEAR,
                          TimeFrame.PREVIOUS_CALENDAR_YEAR, TimeFrame.PREVIOUS_AND_THIS_CALENDAR_YEAR,
                          TimeFrame.LAST_TWELVE_MONTHS, TimeFrame.LAST_TWENTY_FOUR_MONTHS, TimeFrame.CUSTOM_DATES];
  selectedStartDate: Date;
  selectedEndDate: Date;

  portfolioInitialData: any[] = [];
  portfolioDataSource = new MatTableDataSource(this.portfolioInitialData);
  portfolioSelection = new SelectionModel(true, []);
  portfolioDisplayedColumns: string[] = ['select', 'portfolioName'];

  tickerInitialData: any[] = [];
  tickerDataSource = new MatTableDataSource(this.tickerInitialData);
  tickerSelection = new SelectionModel(true, []);
  tickerDisplayedColumns: string[] = ['select', 'ticker', 'name'];

  analysisResultsDataSource = new MatTableDataSource();
  analysisResultsDisplayedColumns: string[] = [   'ticker', 'proceeds', 'dividendProceeds',
                                                  'optionsProceeds',
                                                  'totalGains', 'annualReturn'];

  snapshotInitialData: any[] = [];
  snapshotDataSource = new MatTableDataSource(this.snapshotInitialData);
  snapshotDisplayedColumns: string[] = ['ticker', 'shares', 'stockValue', 'putExposure', 'totalLongExposure', 'callExposure'];


  analysisResults: any = null;
  analysisResultsPresent = false;

  @ViewChild(MatSort) set content(snapshotSort: MatSort) {
    this.snapshotDataSource.sort = snapshotSort;
  }


  constructor(
    private alertService: AlertService,
    private busyService: BusyService,
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


  performAnalysis() {
    // reset any previous alerts
    this.alertService.clear();
    // indicate that we're busy to our html template and to the Busy Service
    this.setBusyState(true);


    // Try to create the new security/stock/etf/mutual fund/ticker


    this.calculatorService.analyzeIncome( this.getStartDate(),
                                          this.getEndDate(),
                                          this.portfolioSelection.selected.map((p: Portfolio) => p.id),
                                          this.tickerSelection.selected.map((t: Ticker) => t.id),
                                          true,
                                          true)
      .subscribe(
          // SUCCESS! ->  Show the results
          resultsFromService  =>  {
            this.updateResults(resultsFromService);
            // Notify everyone that we're no longer busy
            this.setBusyState(false);
          },
          // ERROR! -> Display the error
          error =>  {
            this.alertService.error(error);
            // Notify everyone that we're no longer busy
            this.setBusyState(false);
          }
      );
  }

  toggleEntryVisibility() {
    this.entryIsVisible = !this.entryIsVisible;
  }

  private updateResults(resultsFromService) {
    this.analysisResults = resultsFromService;
    this.analysisResultsPresent = true;
    this.entryIsVisible = false;

    // Build the Analysis Results
    this.buildAnalysisSection(resultsFromService);

    // Build the snapshot on the closing date
    this.buildClosingSnapshotSection(resultsFromService);

  }


  private buildAnalysisSection(resultsFromService) {
    const displayableResults = new Array();
    resultsFromService.lifeCycles.forEach( lifeCycle => {
      displayableResults.push({ data: '',
                                ticker: lifeCycle.stock.ticker,
                                activity: '',
                                size: '',
                                proceeds: lifeCycle.profitsFromSecurities,
                                dividendShares: '',
                                dividendPayments: lifeCycle.dividendsAccrued,
                                optionsActivity: '',
                                numberContracts: '',
                                optionsProceeds: lifeCycle.optionProceedsAccrued,
                                totalGains: lifeCycle.totalGains,
                                averageCapitalAtRisk: lifeCycle.dailyAverageCapitalAtRisk,
                                annualReturn: lifeCycle.annualizedIncomeReturnOnInvestment });
    });
    this.analysisResultsDataSource.data = displayableResults;

  }

  private buildClosingSnapshotSection(resultsFromService) {
    const snapshotCalculations: any[] = resultsFromService.lifeCycles.filter(lc => lc.includedInSnapshot)
                                        .map(lc => { return {
                                          ticker: lc.stock.ticker,
                                          shares: lc.closingPosition.size,
                                          stockValue: lc.closingPosition.value,
                                          putExposure: lc.optionExposureToPutsAtRequestedEndDate,
                                          totalLongExposure: lc.totalLongExposure,
                                          callExposure: lc.optionExposureToCallsAtRequestedEndDate
                                        };
    });
    this.snapshotDataSource.data = snapshotCalculations;
    // this.snapshotDataSource.sort = this.snapshotSort;
    // Indicate that the data in the table has changed
    this.changeDetectorRef.detectChanges();

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

  handlePortfolioSelectionChange(row: any) {
    // First, toggle the check box
    this.portfolioSelection.toggle(row);
    // Update the Ticker Section based on the porfolios selected
    this.updateTickerListBasedOnPortfoliosSelected();
  }

  updateTickerListBasedOnPortfoliosSelected() {
    // Update the Ticker Section based on the porfolios selected
    const portfolioIds: number[] = this.portfolioSelection.selected.map((p: Portfolio) => p.id);
    this.portfolioService.retrieveSecuritiesWithTransactionsInPorfolios(portfolioIds)
    .subscribe(
      tickers => {
          // Put the tickers in the DataSource
          this.tickerDataSource.data = tickers.sort((a, b) => a.ticker < b.ticker ? -1 : a.ticker > b.ticker ? 1 : 0);
          // Indicate that the data in the table has changed
          this.changeDetectorRef.detectChanges();
          // Reset the check boxes
          this.tickerSelection = new SelectionModel(true, []);
      },
      error => this.alertService.error(error)
    );
  }

  shouldCustomDatesBeVisible(): boolean {
    return this.selectedTimeframe === TimeFrame.CUSTOM_DATES;
  }


  masterTogglePortfolios() {
    // First toggle the portfolio items based on their current settings
    this.masterToggle(this.portfolioSelection, this.portfolioDataSource);
    // Update the Ticker Section based on the porfolios selected
    this.updateTickerListBasedOnPortfoliosSelected();
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(selectionModel: SelectionModel<any>, dataSource: MatTableDataSource<any>) {
    // First toggle the
    this.areAllSelected(selectionModel, dataSource) ?
        selectionModel.clear() :
        dataSource.data.forEach(row => selectionModel.select(row));
  }

  shouldSubmitBeDisabled() {
    // If no portfolios are selected  OR  no stocks are selected, the submit button should be disabled
    return this.portfolioSelection.selected.length === 0 || this.tickerSelection.selected.length === 0 || this.busy;
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

          // Indicate that the data in the table has changed
          changeDetectorRef.detectChanges();
          // Reset the check boxes
          selection = new SelectionModel(true, []);
        },
        // If the retrieval goes poorly, show the error
        error => alertService.error(error)
      );
  }

  private getStartDate(): Date {
    const now: Date = new Date();
    switch (this.selectedTimeframe) {
      case TimeFrame.THIS_CALENDAR_YEAR:
        return new Date(now.getFullYear() - 1, 11, 31);
      case TimeFrame.PREVIOUS_CALENDAR_YEAR:
      case TimeFrame.PREVIOUS_AND_THIS_CALENDAR_YEAR:
        return new Date(now.getFullYear() - 2, 11, 31);
      case TimeFrame.LAST_TWELVE_MONTHS:
        return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      case TimeFrame.LAST_TWENTY_FOUR_MONTHS:
        return new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
       case TimeFrame.CUSTOM_DATES:
        return this.selectedStartDate;
       case TimeFrame.ALL_DATES:
        return undefined;
    }
  }
  private getEndDate(): Date {
    const now: Date = new Date();
    switch (this.selectedTimeframe) {
      case TimeFrame.PREVIOUS_CALENDAR_YEAR:
        return new Date(now.getFullYear() - 1, 11, 31);
      case TimeFrame.CUSTOM_DATES:
        return this.selectedEndDate;
      case TimeFrame.THIS_CALENDAR_YEAR:
      case TimeFrame.PREVIOUS_AND_THIS_CALENDAR_YEAR:
      case TimeFrame.LAST_TWELVE_MONTHS:
      case TimeFrame.LAST_TWENTY_FOUR_MONTHS:
      case TimeFrame.ALL_DATES:
        return undefined;
    }
  }

  private setBusyState(input: boolean) {
    // Keep track of locally whether or not we're busy
    this.busy = input;
    // Tell the BusyService whether or note we're busy
    if (input) {
      this.busyService.busy(12);
    }
    else {
      this.busyService.finished(12);
    }
  }

}
