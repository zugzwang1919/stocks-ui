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

  selectedTimeframe: TimeFrame =  TimeFrame.ALL_DATES;
  timeframes: string[] = [TimeFrame.ALL_DATES, TimeFrame.THIS_CALENDAR_YEAR,
                          TimeFrame.PREVIOUS_CALENDAR_YEAR, TimeFrame.PREVIOUS_AND_THIS_CALENDAR_YEAR,
                          TimeFrame.LAST_TWELVE_MONTHS, TimeFrame.LAST_TWENTY_FOUR_MONTHS, TimeFrame.CUSTOM_DATES];

  portfolioInitialData: any[] = [];
  portfolioDataSource = new MatTableDataSource(this.portfolioInitialData);
  portfolioSelection = new SelectionModel(true, []);
  portfolioDisplayedColumns: string[] = ['select', 'portfolioName'];

  tickerInitialData: any[] = [];
  tickerDataSource = new MatTableDataSource(this.tickerInitialData);
  tickerSelection = new SelectionModel(true, []);
  tickerDisplayedColumns: string[] = ['select', 'ticker', 'name'];

  analysisResultsDataSource = new MatTableDataSource();
  analysisResultsDisplayedColumns: string[] = ['date', 'ticker', 'activity', 'size', 'proceeds', 'dividendShares', 'dividendProceeds',
                                               'optionsActivity', 'numberContracts', 'optionsProceeds',
                                               'totalGains', 'averageCapitalAtRisk', 'annualReturn'];

  snapshotDataSource = new MatTableDataSource();
  snapshotDisplayedColumns: string[] = ['ticker', 'shares', 'stockValue', 'putExposure', 'totalLongExposure', 'callExposure'];



  analysisResultsPresent = false;

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

  performAnalysis() {
    // reset any previous alerts
    this.alertService.clear();


    // Try to create the new security/stock/etf/mutual fund/ticker


    this.calculatorService.analyzeIncome( this.getStartDate(),
                                          this.getEndDate(),
                                          this.portfolioSelection.selected.map((p: Portfolio) => p.id),
                                          this.tickerSelection.selected.map((t: Ticker) => t.id),
                                          true,
                                          true)
      .subscribe(
          // SUCCESS! ->  Show the results
          resultsFromService  =>  this.updateResults(resultsFromService),
          // ERROR! -> Display the error
          error => this.alertService.error(error)
      );
  }

  private updateResults(resultsFromService) {
    this.analysisResultsPresent = true;

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
                                optionsProceeds: lifeCycle.optionsProceedsAccrued,
                                totalGains: lifeCycle.totalGains,
                                averageCapitalAtRisk: lifeCycle.dailyAverageCapitalAtRisk,
                                annualReturn: lifeCycle.annualizedIncomeReturnOnInvestment });
    });
    this.analysisResultsDataSource.data = displayableResults;

  }

  private buildClosingSnapshotSection(resultsFromService) {
    const snapshotCalculations = new Array();
    resultsFromService.lifeCycles.forEach( lifeCycle => {
      snapshotCalculations.push({ ticker: lifeCycle.stock.ticker,
                                  shares: lifeCycle.closingPosition.size,
                                  stockValue: lifeCycle.closingPosition.value,
                                  putExposure: lifeCycle.optionExposureToPutsAtRequestedEndDate,
                                  totalLongExposure: lifeCycle.totalLongExposure,
                                  callExposure: lifeCycle.optionExposureToCallsAtRequestedEndDate});

    });
    this.snapshotDataSource.data = snapshotCalculations;

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

  shouldSubmitBeDisabled() {
    // If no portfolios are selected  OR  no stocks are selected, the submit button should be disabled
    return this.portfolioSelection.selected.length === 0 || this.tickerSelection.selected.length === 0;
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
      case TimeFrame.ALL_DATES:
      // FIXME
      case TimeFrame.CUSTOM_DATES:
        return undefined;
    }
  }
  private getEndDate(): Date {
    const now: Date = new Date();
    switch (this.selectedTimeframe) {
      case TimeFrame.PREVIOUS_CALENDAR_YEAR:
        return new Date(now.getFullYear() - 1, 11, 31);
      case TimeFrame.THIS_CALENDAR_YEAR:
      case TimeFrame.PREVIOUS_AND_THIS_CALENDAR_YEAR:
      case TimeFrame.LAST_TWELVE_MONTHS:
      case TimeFrame.LAST_TWENTY_FOUR_MONTHS:
      case TimeFrame.ALL_DATES:
      // FIXME
      case TimeFrame.CUSTOM_DATES:
        return undefined;
    }
  }
}
