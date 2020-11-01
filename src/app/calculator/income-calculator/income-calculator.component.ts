import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { TickerService } from 'src/app/ticker/ticker.service';
import { WolfeTrackedItem } from 'src/app/wolfe-common/wolfe-tracked-item';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { AlertService } from 'src/app/general/alert/alert.service';
import { Ticker } from 'src/app/ticker/ticker';
import { Portfolio } from 'src/app/portfolio/portfolio';
import { PortfolioService } from 'src/app/portfolio/portfolio.service';
import { CalculatorService } from '../calculator.service';
import { MatSort } from '@angular/material/sort';
import { BusyService } from 'src/app/general/busy/busy.service';
import { CookieService } from 'ngx-cookie-service';
import { WolfeCheckboxInTableService } from 'src/app/wolfe-common/wolfe-checkbox-in-table.service';


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
  firstTimeDisplayingTickers: boolean;


  selectedTimeframe: TimeFrame =  TimeFrame.ALL_DATES;
  timeframes: string[] = [TimeFrame.ALL_DATES, TimeFrame.THIS_CALENDAR_YEAR,
                          TimeFrame.PREVIOUS_CALENDAR_YEAR, TimeFrame.PREVIOUS_AND_THIS_CALENDAR_YEAR,
                          TimeFrame.LAST_TWELVE_MONTHS, TimeFrame.LAST_TWENTY_FOUR_MONTHS, TimeFrame.CUSTOM_DATES];
  selectedStartDate: Date;
  selectedEndDate: Date;
  readonly TIMEFRAME_COOKIE_NAME: string = 'wolfe-software.com_income-analysis_timeframe';
  readonly CUSTOM_START_DATE_COOKIE_NAME: string = 'wolfe-software.com_income-analysis_custom-start-date';
  readonly CUSTOM_END_DATE_COOKIE_NAME: string = 'wolfe-software.com_income-analysis_custom-end-date';

  portfolioInitialData: any[] = [];
  portfolioDataSource = new MatTableDataSource(this.portfolioInitialData);
  portfolioSelection = new SelectionModel(true, []);
  portfolioDisplayedColumns: string[] = ['select', 'portfolioName'];
  readonly PORTFOLIO_COOKIE_NAME: string = 'wolfe-software.com_income-analysis_portfolios';

  tickerInitialData: any[] = [];
  tickerDataSource = new MatTableDataSource(this.tickerInitialData);
  tickerSelection = new SelectionModel(true, []);
  tickerDisplayedColumns: string[] = ['select', 'ticker', 'name'];
  readonly TICKER_COOKIE_NAME: string = 'wolfe-software.com_income-analysis_tickers';

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
    private cookieService: CookieService,
    private portfolioService: PortfolioService,
    public  wcitService: WolfeCheckboxInTableService,
  ) { }

  ngOnInit(): void {
    // Reset the timeframe based on cookie values
    this.setTimeframeValues();
    // Indicate that this is the first time through
    this.firstTimeDisplayingTickers = true;
    // Populate the Portfolio and Ticker List
    this.populatePortfolioAndTickerTables();

  }

  performAnalysis() {
    // reset any previous alerts
    this.alertService.clear();
    // indicate that we're busy to our html template and to the Busy Service
    this.setBusyState(true);
    // Save cookies before starting the analysis
    this.saveAllValuesToCookies();

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

  /***** Methods that help determine the visibility of different parts of the page ******/

  toggleEntryVisibility() {
    this.entryIsVisible = !this.entryIsVisible;
  }

  shouldCustomDatesBeVisible(): boolean {
    return this.selectedTimeframe === TimeFrame.CUSTOM_DATES;
  }

  shouldSubmitBeDisabled() {
    // If no portfolios are selected  OR  no stocks are selected, the submit button should be disabled
    return this.portfolioSelection.selected.length === 0 || this.tickerSelection.selected.length === 0 || this.busy;
  }


  /***** Methods dealing with users clicking on check boxes in the portfolio table  *****/



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
          // If this is the first time showing the tickers, use the cookies to set up the selection
          let selectedTickers: Ticker[] = [];
          if (this.firstTimeDisplayingTickers) {
            // Set the checkboxes based on cookie values
            const tickerCookie: string = this.cookieService.get(this.TICKER_COOKIE_NAME);
            if (tickerCookie.length > 0 ) {
              const ids: number[] = tickerCookie.split(',').map(idAsString => +idAsString);
              selectedTickers = ids.map(id => tickers.find(t => t.id === id));
            }
            this.firstTimeDisplayingTickers = false;
          }
          // Set the check boxes to the appropriate values
          this.tickerSelection = new SelectionModel(true, selectedTickers);
      },
      error => this.alertService.error(error)
    );
  }


  /*****  Methods that just help manage checkboxes imbedded in the Porfolio Table *****/

  singleTogglePortfolio(portfolio: Portfolio) {
    // First, toggle the check box
    this.portfolioSelection.toggle(portfolio);
    // Update the Ticker Section based on the porfolios selected
    this.updateTickerListBasedOnPortfoliosSelected();
  }

  masterTogglePortfolios() {
    // First toggle the portfolio items based on their current settings
    this.wcitService.masterToggle(this.portfolioSelection, this.portfolioDataSource);
    // Update the Ticker Section based on the porfolios selected
    this.updateTickerListBasedOnPortfoliosSelected();
  }




  /**********************************  PRIVATE METHODS *********************************/


  private setTimeframeValues() {
    const timeframeCookie: string = this.cookieService.get(this.TIMEFRAME_COOKIE_NAME);
    // NOTE: This seems like a painful way to handle enums
    if (timeframeCookie.length > 0) {
      const tfKey: string = Object.keys(TimeFrame).find(x => TimeFrame[x] === timeframeCookie);
      this.selectedTimeframe = TimeFrame[tfKey];
    }
  }

  private populatePortfolioAndTickerTables() {
    this.portfolioService.retrieveAll()
      .subscribe(
        // If this goes well, update the list of Tickers
        portfolios =>  {

          // Put the returned portfolio data in the portfolio DataSource
          this.portfolioDataSource.data = portfolios.sort((p1: Portfolio, p2: Portfolio) => p1.portfolioName < p2.portfolioName ? -1 : p1.portfolioName > p2.portfolioName ? 1 : 0);

          // Set the checkboxes based on cookie values
          const portfolioCookie: string = this.cookieService.get(this.PORTFOLIO_COOKIE_NAME);
          let selectedPortfolios: Portfolio[] = [];
          if (portfolioCookie.length > 0 ) {
            const ids: number[] = portfolioCookie.split(',').map(idAsString => +idAsString);
            selectedPortfolios = ids.map(id => this.portfolioDataSource.data.find(item => item.id === id));
          }

          // Create a new Selection Model
          this.portfolioSelection = new SelectionModel<Portfolio>(true, selectedPortfolios );

          // Indicate that the data in the table has changed
          this.changeDetectorRef.detectChanges();

          // Now that we have the portfolio list created, set up the tickers
          this.updateTickerListBasedOnPortfoliosSelected();
        },
        // If the retrieval goes poorly, show the error
        error => this.alertService.error(error)
      );
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
    this.changeDetectorRef.detectChanges();

  }

  private saveAllValuesToCookies(): void {
    // Make the cookie valid for a year
    const oneYearFromToday: Date = new Date();
    oneYearFromToday.setFullYear(oneYearFromToday.getFullYear() + 1);

    // Save the timeframe that was selected
    this.cookieService.set(this.TIMEFRAME_COOKIE_NAME, this.selectedTimeframe, oneYearFromToday);

    // Save the portfolios that were selected.
    const portfolioIds: string =  this.portfolioSelection.selected.map(p => p.id).join();
    this.cookieService.set(this.PORTFOLIO_COOKIE_NAME, portfolioIds, oneYearFromToday);

    // Save the tickers that were selected.
    const tickerIds: string =  this.tickerSelection.selected.map(t => t.id).join();
    this.cookieService.set(this.TICKER_COOKIE_NAME, tickerIds, oneYearFromToday);
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
