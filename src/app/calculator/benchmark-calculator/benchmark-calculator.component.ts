import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { TickerService } from 'src/app/ticker/ticker.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { AlertService } from 'src/app/general/alert/alert.service';
import { Ticker } from 'src/app/ticker/ticker';
import { Portfolio } from 'src/app/portfolio/portfolio';
import { PortfolioService } from 'src/app/portfolio/portfolio.service';
import { CalculatorService } from '../calculator.service';
import { MatSort } from '@angular/material/sort';
import { BusyService } from 'src/app/general/busy/busy.service';
import { WolfeCheckboxInTableService } from 'src/app/wolfe-common/wolfe-checkbox-in-table.service';
import { CookieService } from 'ngx-cookie-service';
import { Timeframe, TimeframeService } from '../timeframe.service';

@Component({
  selector: 'app-benchmark-calculator',
  templateUrl: './benchmark-calculator.component.html',
  styleUrls: ['./benchmark-calculator.component.sass']
})
export class BenchmarkCalculatorComponent implements OnInit {

  entryIsVisible = true;
  busy = false;
  firstTimeDisplayingTickers: boolean;

  selectedTimeframe: Timeframe;
  timeframes: string[] = Object.values(Timeframe);
  selectedStartDate: Date;
  selectedEndDate: Date;
  readonly TIMEFRAME_COOKIE_NAME: string = 'wolfe-software.com_benhcmark-analysis_timeframe';

  portfolioInitialData: any[] = [];
  portfolioDataSource = new MatTableDataSource(this.portfolioInitialData);
  portfolioSelection = new SelectionModel(true, []);
  portfolioDisplayedColumns: string[] = ['select', 'portfolioName'];
  readonly PORTFOLIO_COOKIE_NAME: string = 'wolfe-software.com_benchcmark-analysis_portfolios';

  tickerInitialData: any[] = [];
  tickerDataSource = new MatTableDataSource(this.tickerInitialData);
  tickerSelection = new SelectionModel(true, []);
  tickerDisplayedColumns: string[] = ['select', 'ticker', 'name'];
  readonly TICKER_COOKIE_NAME: string = 'wolfe-software.com_benchmark-analysis_tickers';

  benchmarkInitialData: any[] = [];
  benchmarkDataSource = new MatTableDataSource(this.benchmarkInitialData);
  benchmarkSelection = new SelectionModel(true, []);
  benchmarkDisplayedColumns: string[] = ['select', 'ticker', 'name'];
  readonly BENCHMARK_COOKIE_NAME: string = 'wolfe-software.com_benchmark-analysis_benchmarks';

  analysisResultsDataSource = new MatTableDataSource();
  analysisResultsDisplayedColumns: string[] = [ 'ticker',
                                                'startDate', 'startSize', 'startValue',
                                                'endDate', 'endSize', 'endValue',
                                                'return', 'benchmarkReturn', 'outperformance'];
  @ViewChild(MatSort) set content(analysisResultsSort: MatSort) {
    this.analysisResultsDataSource.sort = analysisResultsSort;
  }

  summaryInitialData: any[] = [];
  summaryDataSource = new MatTableDataSource(this.summaryInitialData);
  summaryDisplayedColumns: string[] = ['totalInflows', 'totalOutflows', 'return',
                                        'benchmark', 'benchmarkInflows', 'benchmarkOutflows', 'benchmarkReturn', 'totalOutperformance'];

  analysisResults: any = null;
  analysisResultsPresent = false;

  constructor(
    private alertService: AlertService,
    private busyService: BusyService,
    private calculatorService: CalculatorService,
    private changeDetectorRef: ChangeDetectorRef,
    private cookieService: CookieService,
    private portfolioService: PortfolioService,
    private tickerService: TickerService,
    private timeframeService: TimeframeService,
    public  wcitService: WolfeCheckboxInTableService
  ) { }

  ngOnInit(): void {

    // Set the selectedTimeframe to the value in the cookie; if no cookie, set to ALL_DATES
    this.selectedTimeframe = this.timeframeService.getTimeframeFromCookie(this.TIMEFRAME_COOKIE_NAME) || Timeframe.ALL_DATES;

    // Populate the Portfolio and Ticker List
    this.firstTimeDisplayingTickers = true;
    this.populatePortfolioAndTickerTables();

    // Populate the Benchmark List
    this.populateBenchmarkTable();
  }

  performAnalysis() {
    // reset any previous alerts
    this.alertService.clear();
    // indicate that we're busy to our html template and to the Busy Service
    this.setBusyState(true);
    // Save cookies before starting the analysis
    this.saveAllValuesToCookies();

    // Perform the analysis
    this.calculatorService.analyzeVsBenchmarks( this.timeframeService.calculateStartDate(this.selectedTimeframe, this.selectedStartDate),
                                                this.timeframeService.calculateEndDate(this.selectedTimeframe, this.selectedEndDate),
                                                this.portfolioSelection.selected.map((p: Portfolio) => p.id),
                                                this.tickerSelection.selected.map((t: Ticker) => t.id),
                                                this.benchmarkSelection.selected.map((t: Ticker) => t.id),
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

  /******************** Handle the setting and querying regarding the visibility of elements ********************/

  toggleEntryVisibility() {
    this.entryIsVisible = !this.entryIsVisible;
  }

  shouldCustomDatesBeVisible(): boolean {
    return this.selectedTimeframe === Timeframe.CUSTOM_DATES;
  }

  shouldSubmitButtonBeDisabled(): boolean {
    return this.portfolioSelection.selected.length === 0 ||
    this.tickerSelection.selected.length === 0 ||
    this.benchmarkSelection.selected.length === 0 ||
    this.busy;
  }

  /*****  Methods that handle clicks in the Porfolio Table *****/

  updateTickerListBasedOnPortfoliosSelected() {

    // Update the Ticker Section based on the porfolios selected
    const portfolioIds: number[] = this.portfolioSelection.selected.map((p: Portfolio) => p.id);
    this.portfolioService.retrieveSecuritiesWithTransactionsInPorfolios(portfolioIds)
    .subscribe(
      tickers => {
          // Put the tickers in the DataSource
          this.tickerDataSource.data = tickers.sort(this.tickerSortFunction);
          // Indicate that the data in the table has changed
          this.changeDetectorRef.detectChanges();
          // If this is the first time showing the tickers, use the cookies to set up the selection
          let selectedTickers: Ticker[] = [];
          if (this.firstTimeDisplayingTickers) {
            // Set the checkboxes based on cookie values
            const tickerCookie: string = this.cookieService.get(this.TICKER_COOKIE_NAME);
            if (tickerCookie.length > 0 ) {
              const ids: number[] = tickerCookie.split(',').map(idAsString => +idAsString);
              // It's possible that the ticker was deleted since the cookie was saved.
              // Filter out any "undefined" results from the find() below.
              selectedTickers = ids.map(id => tickers.find((t: Ticker) => t.id === id)).filter((t: Ticker) => t);
            }
            this.firstTimeDisplayingTickers = false;
          }
          // Set the check boxes to the appropriate values
          this.tickerSelection = new SelectionModel(true, selectedTickers);
      },
      error => this.alertService.error(error)
    );
  }

  handlePortfolioSelectionChange(row: any) {
    // First, toggle the check box
    this.portfolioSelection.toggle(row);
    // Update the Ticker Section based on the porfolios selected
    this.updateTickerListBasedOnPortfoliosSelected();
  }

  masterTogglePortfolios() {
    // First toggle the portfolio items based on their current settings
    this.wcitService.masterToggle(this.portfolioSelection, this.portfolioDataSource);
    // Update the Ticker Section based on the porfolios selected
    this.updateTickerListBasedOnPortfoliosSelected();
  }

  /******************** PRIVATE METHODS ********************/

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
            // Portfolio could theoretically have been deleted since the cookie was created.
            // Filter out an "undefined results" when we try to "find" the portfolio
            selectedPortfolios = ids.map(id => this.portfolioDataSource.data.find((p: Portfolio) => p.id === id)).filter((p: Portfolio) => p);
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

  private populateBenchmarkTable() {
    this.tickerService.retrieveAllBenchmarks()
    .subscribe(
      // If this goes well, update the list of Benchmarks
      benchmarks =>  {
        this.benchmarkDataSource.data = benchmarks.sort(this.tickerSortFunction);
        // Set the checkboxes based on cookie values
        const benchmarkCookie: string = this.cookieService.get(this.BENCHMARK_COOKIE_NAME);
        let selectedBenchmarks: Ticker[] = [];
        if (benchmarkCookie.length > 0 ) {
        const ids: number[] = benchmarkCookie.split(',').map(idAsString => +idAsString);
        // The benchmark could theoretically have been deleted since the cookie was created.
        // Filter out any "undefined results" when we try to "find" the portfolio
        selectedBenchmarks = ids.map(id => this.benchmarkDataSource.data.find((t: Ticker) => t.id === id)).filter((t: Ticker) => t);
        }
        // Reset the check boxes
        this.benchmarkSelection = new SelectionModel(true, selectedBenchmarks);
        // Indicate that the data in the table has changed
        this.changeDetectorRef.detectChanges();

      },
      // If the retrieval goes poorly, show the error
      error => this.alertService.error(error)
    );
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

    // Save the benchmarks that were selected.
    const benchmarkIds: string =  this.benchmarkSelection.selected.map(b => b.id).join();
    this.cookieService.set(this.BENCHMARK_COOKIE_NAME, benchmarkIds, oneYearFromToday);

  }

  private updateResults(resultsFromService) {
    this.analysisResults = resultsFromService;
    this.analysisResultsPresent = true;
    this.entryIsVisible = false;

    // Build the Analysis Results
    this.buildAnalysisSection(resultsFromService);

    // Build the snapshot on the closing date
    this.buildSummarySection(resultsFromService);

  }


  private buildAnalysisSection(resultsFromService) {
    const displayableResults = new Array();
    resultsFromService.calculatorResults.listOfSingleSecurityResults.forEach( singleSecurityResult => {
      const tickerLifeCycle = singleSecurityResult.baseLifeCycle;
      const benchmarkLifeCycle = singleSecurityResult.benchmarkLifeCycles[0];
      displayableResults.push({ ticker: tickerLifeCycle.stock.ticker,
                                startDate: tickerLifeCycle.openingPosition.date,
                                startSize: tickerLifeCycle.openingPosition.size,
                                startValue: tickerLifeCycle.openingPosition.value,
                                endDate: tickerLifeCycle.closingPosition.date,
                                endSize: tickerLifeCycle.closingPosition.size,
                                endValue: tickerLifeCycle.closingPosition.value,
                                return: tickerLifeCycle.simpleReturn,
                                benchmarkReturn: benchmarkLifeCycle.simpleReturn,
                                outperformance: singleSecurityResult.outperformances[0] });
    });
    this.analysisResultsDataSource.data = displayableResults;
    // Indicate that the data in the table has changed
    this.changeDetectorRef.detectChanges();

  }

  private buildSummarySection(resultsFromService) {
    const ar = resultsFromService.calculatorResults.accumulatedResults;
    const summaryResults: any[] = ar.listOfBenchmarkData
                                        .map(benchmark => { return {
                                          totalInflows: ar.baseTotalInflows,
                                          totalOutflows: ar.baseTotalOutflows,
                                          return: ar.baseTotalReturn,
                                          benchmark: benchmark.benchmarkSecurity.ticker,
                                          benchmarkInflows: benchmark.benchmarkTotalInflows,
                                          benchmarkOutflows: benchmark.benchmarkTotalOutflows,
                                          benchmarkReturn: benchmark.benchmarkTotalReturn,
                                          totalOutperformance: (ar.baseTotalReturn - benchmark.benchmarkTotalReturn)
                                        };
    });
    this.summaryDataSource.data = summaryResults;
    // Indicate that the data in the table has changed
    this.changeDetectorRef.detectChanges();

  }

  private setBusyState(input: boolean) {
    // Keep track of locally whether or not we're busy
    this.busy = input;
    // Tell the BusyService whether or note we're busy
    if (input) {
      this.busyService.busy(1925);
    }
    else {
      this.busyService.finished(1925);
    }
  }

  //
  // Function to sort Tickers by their Ticker Symbol in DESCENDING order
  // i.e., AAPL, GOOG, MSFT, SPY
  //
  private tickerSortFunction: ((a: Ticker, b: Ticker) => number) = (a: Ticker, b: Ticker) =>
                              a.ticker < b.ticker ? -1 : a.ticker > b.ticker ? 1 : 0
}
