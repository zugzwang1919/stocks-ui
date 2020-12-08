import { Component, OnInit, ViewChild } from '@angular/core';
import { StockService } from 'src/app/stock/stock.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { AlertService } from 'src/app/general/alert/alert.service';
import { Stock } from 'src/app/stock/stock';
import { Portfolio } from 'src/app/portfolio/portfolio';
import { PortfolioService } from 'src/app/portfolio/portfolio.service';
import { CalculatorService } from '../calculator.service';
import { MatSort } from '@angular/material/sort';
import { BusyService } from 'src/app/general/busy/busy.service';
import { WolfeCheckboxInTableService } from 'src/app/wolfe-common/wolfe-checkbox-in-table.service';
import { CookieService } from 'ngx-cookie-service';
import { TimeframeService } from '../timeframe.service';
import { WolfeCalculatorBaseDirective } from '../wolfe-calculator-base-directive';
import { BenchmarkAnalysisResponse } from '../benchmark-analysis-response';
import { MatDialog } from '@angular/material/dialog';
import { LifecycleDialogComponent } from '../lifecycle-dialog/lifecycle-dialog.component';

const BUSY_ID = 1925;
const TIMEFRAME_COOKIE_NAME = 'wolfe-software.com_benhcmark-analysis_timeframe';
const PORTFOLIO_COOKIE_NAME = 'wolfe-software.com_benchcmark-analysis_portfolios';
const STOCK_COOKIE_NAME = 'wolfe-software.com_benchmark-analysis_stocks';
const BENCHMARK_COOKIE_NAME = 'wolfe-software.com_benchmark-analysis_benchmarks';

@Component({
  selector: 'app-benchmark-calculator',
  templateUrl: './benchmark-calculator.component.html',
  styleUrls: ['./benchmark-calculator.component.sass']
})
export class BenchmarkCalculatorComponent extends WolfeCalculatorBaseDirective implements OnInit {

  entryIsVisible = true;

  benchmarkAnalysisResponse: BenchmarkAnalysisResponse;


  benchmarkInitialData: any[] = [];
  benchmarkDataSource = new MatTableDataSource(this.benchmarkInitialData);
  benchmarkSelection = new SelectionModel(true, []);
  benchmarkDisplayedColumns: string[] = ['select', 'ticker', 'name'];


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
    protected alertService: AlertService,
    protected busyService: BusyService,
    private   calculatorService: CalculatorService,
    protected cookieService: CookieService,
    protected portfolioService: PortfolioService,
    private   stockService: StockService,
    protected timeframeService: TimeframeService,
    public    wcitService: WolfeCheckboxInTableService,
    public    lifecycleDialog: MatDialog)
  {
    super(portfolioService,
          timeframeService,
          busyService,
          cookieService,
          wcitService,
          alertService,
          BUSY_ID,
          PORTFOLIO_COOKIE_NAME,
          STOCK_COOKIE_NAME,
          TIMEFRAME_COOKIE_NAME);
  }

  ngOnInit(): void {

    // Set the selectedTimeframe appropriately
    this.populateTimeframe();

    // Populate the Portfolio and Stock List
    this.populatePortfolioAndStockTables();

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
                                                this.stockSelection.selected.map((t: Stock) => t.id),
                                                this.benchmarkSelection.selected.map((t: Stock) => t.id),
                                                true,
                                                true)
      .subscribe(
          // SUCCESS! ->  Show the results
          (resultsFromService: BenchmarkAnalysisResponse)  =>  {
            // Keep the results around
            this.benchmarkAnalysisResponse = resultsFromService;
            // Update the tabular results
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

  showLifecycle(item: any) {
    const lifecycle: any = item.startToEndLifecycle;
    this.lifecycleDialog.open(LifecycleDialogComponent, {data: lifecycle} );
  }

  /******************** Handle the setting and querying regarding the visibility of elements ********************/

  toggleEntryVisibility() {
    this.entryIsVisible = !this.entryIsVisible;
  }

  shouldSubmitButtonBeDisabled(): boolean {
    return this.portfolioSelection.selected.length === 0 ||
    this.stockSelection.selected.length === 0 ||
    this.benchmarkSelection.selected.length === 0 ||
    this.busy;
  }



  private populateBenchmarkTable() {
    this.stockService.retrieveAllBenchmarks()
    .subscribe(
      // If this goes well, update the list of Benchmarks
      benchmarks =>  {
        this.benchmarkDataSource.data = benchmarks.sort(this.stockSortFunction);
        // Set the checkboxes based on cookie values
        const benchmarkCookie: string = this.cookieService.get(BENCHMARK_COOKIE_NAME);
        let selectedBenchmarks: Stock[] = [];
        if (benchmarkCookie.length > 0 ) {
        const ids: number[] = benchmarkCookie.split(',').map(idAsString => +idAsString);
        // The benchmark could theoretically have been deleted since the cookie was created.
        // Filter out any "undefined results" when we try to "find" the portfolio
        selectedBenchmarks = ids.map(id => this.benchmarkDataSource.data.find((t: Stock) => t.id === id)).filter((t: Stock) => t);
        }
        // Reset the check boxes
        this.benchmarkSelection = new SelectionModel(true, selectedBenchmarks);

      },
      // If the retrieval goes poorly, show the error
      error => this.alertService.error(error)
    );
  }

  private saveAllValuesToCookies(): void {

    // Save the benchmarks that were selected.
    const benchmarkIds: string =  this.benchmarkSelection.selected.map(b => b.id).join();
    this.cookieService.set(BENCHMARK_COOKIE_NAME, benchmarkIds, this.oneYearFromToday());

    // Save the timeframe, portfolios, and stocks
    this.saveTimeframePortfoliosAndStocksToCookies();

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
      const stockLifeCycle = singleSecurityResult.baseLifeCycle;
      const benchmarkLifeCycle = singleSecurityResult.benchmarkLifeCycles[0];
      displayableResults.push({ startToEndLifecycle: singleSecurityResult.baseLifeCycle,
                                ticker: stockLifeCycle.stock.ticker,
                                startDate: stockLifeCycle.openingPosition.date,
                                startSize: stockLifeCycle.openingPosition.size,
                                startValue: stockLifeCycle.openingPosition.value,
                                endDate: stockLifeCycle.closingPosition.date,
                                endSize: stockLifeCycle.closingPosition.size,
                                endValue: stockLifeCycle.closingPosition.value,
                                return: stockLifeCycle.simpleReturn,
                                benchmarkReturn: benchmarkLifeCycle.simpleReturn,
                                outperformance: singleSecurityResult.outperformances[0] });
    });
    this.analysisResultsDataSource.data = displayableResults;

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

  }

}
