import { AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from 'src/app/general/alert/alert.service';
import { Stock } from 'src/app/stock/stock';
import { Portfolio } from 'src/app/portfolio/portfolio';
import { PortfolioService } from 'src/app/portfolio/portfolio.service';
import { CalculatorService } from '../calculator.service';
import { MatSort } from '@angular/material/sort';
import { BusyService } from 'src/app/general/busy/busy.service';
import { CookieService } from 'ngx-cookie-service';
import { WolfeCheckboxInTableService } from 'src/app/wolfe-common/wolfe-checkbox-in-table.service';
import { TimeframeService } from '../timeframe.service';
import { WolfeCalculatorBaseDirective } from '../wolfe-calculator-base-directive';
import { MatDialog } from '@angular/material/dialog';
import { LifecycleDialogComponent } from '../lifecycle-dialog/lifecycle-dialog.component';

const BUSY_ID = 1926;
const TIMEFRAME_COOKIE_NAME = 'wolfe-software.com_income-analysis_timeframe';
const PORTFOLIO_COOKIE_NAME = 'wolfe-software.com_income-analysis_portfolios';
const STOCK_COOKIE_NAME = 'wolfe-software.com_income-analysis_stocks';

@Component({
  selector: 'app-income-calculator',
  templateUrl: './income-calculator.component.html',
  styleUrls: ['./income-calculator.component.sass']
})
export class IncomeCalculatorComponent extends WolfeCalculatorBaseDirective implements OnInit {

  entryIsVisible = true;

  analysisResultsDataSource = new MatTableDataSource();
  analysisResultsDisplayedColumns: string[] = [   'ticker', 'proceeds', 'dividendPayments',
                                                  'optionsProceeds',
                                                  'totalGains', 'annualReturn'];

  snapshotInitialData: any[] = [];
  snapshotDataSource = new MatTableDataSource(this.snapshotInitialData);
  snapshotDisplayedColumns: string[] = ['snapshotTicker', 'shares', 'stockValue', 'putExposure', 'totalLongExposure', 'callExposure'];


  analysisResults: any = null;
  analysisResultsPresent = false;



  @ViewChildren(MatSort) set matSort(ms: QueryList<MatSort>) {
    this.analysisResultsDataSource.sort = ms.first;
    this.snapshotDataSource.sort = ms.last;
  }

  constructor(
    protected alertService: AlertService,
    protected busyService: BusyService,
    private   calculatorService: CalculatorService,
    protected cookieService: CookieService,
    protected portfolioService: PortfolioService,
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

  }

  /*******************  Methods that allow the template to take action **********************/

  performAnalysis() {
    // reset any previous alerts
    this.alertService.clear();
    // indicate that we're busy to our html template and to the Busy Service
    this.setBusyState(true);
    // Save cookies before starting the analysis
    this.saveTimeframePortfoliosAndStocksToCookies();

    this.calculatorService.analyzeIncome( this.timeframeService.calculateStartDate(this.selectedTimeframe, this.selectedStartDate),
                                          this.timeframeService.calculateEndDate(this.selectedTimeframe, this.selectedEndDate),
                                          this.portfolioSelection.selected.map((p: Portfolio) => p.id),
                                          this.stockSelection.selected.map((t: Stock) => t.id),
                                          true,
                                          true)
      .subscribe(
          // SUCCESS! ->  Show the results
          resultsFromService  =>  {
            this.analysisResults = resultsFromService;
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
    const lifecycle: any = this.analysisResults.lifeCycles.find(lc => lc.stock.ticker === item.ticker);
    this.lifecycleDialog.open(LifecycleDialogComponent, {data: lifecycle} );
  }


  /***** Methods that help determine the visibility of different parts of the page ******/

  toggleEntryVisibility() {
    this.entryIsVisible = !this.entryIsVisible;
  }

  shouldSubmitBeDisabled() {
    // If no portfolios are selected  OR  no stocks are selected, the submit button should be disabled
    return this.portfolioSelection.selected.length === 0 || this.stockSelection.selected.length === 0 || this.busy;
  }


  /**********************************  PRIVATE METHODS *********************************/


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
      displayableResults.push({ ticker: lifeCycle.stock.ticker,
                                proceeds: lifeCycle.profitsFromSecurities,
                                dividendPayments: lifeCycle.dividendsAccrued,
                                optionsProceeds: lifeCycle.optionProceedsAccrued,
                                totalGains: lifeCycle.totalGains,
                                averageCapitalAtRisk: lifeCycle.dailyAverageCapitalAtRisk,
                                annualReturn: lifeCycle.annualizedIncomeReturnOnInvestment,
                                includedInSnapshot: lifeCycle.includedInSnapshot,
                                });

    });
    this.analysisResultsDataSource.data = displayableResults;

  }

  private buildClosingSnapshotSection(resultsFromService) {
    const snapshotCalculations: any[] = resultsFromService.lifeCycles.filter(lc => lc.includedInSnapshot)
                                        .map(lc => { return {
                                          snapshotTicker: lc.stock.ticker,
                                          shares: lc.closingPosition.size,
                                          stockValue: lc.closingPosition.value,
                                          putExposure: lc.optionExposureToPutsAtRequestedEndDate,
                                          totalLongExposure: lc.totalLongExposure,
                                          callExposure: lc.optionExposureToCallsAtRequestedEndDate
                                        };
    });
    this.snapshotDataSource.data = snapshotCalculations;
  }


}
