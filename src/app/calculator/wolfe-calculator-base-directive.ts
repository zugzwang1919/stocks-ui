import { SelectionModel } from '@angular/cdk/collections';
import { Directive} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CookieService } from 'ngx-cookie-service';
import { AlertService } from '../general/alert/alert.service';
import { BusyService } from '../general/busy/busy.service';
import { Portfolio } from '../portfolio/portfolio';
import { PortfolioService } from '../portfolio/portfolio.service';
import { Ticker } from '../ticker/ticker';
import { WolfeCheckboxInTableService } from '../wolfe-common/wolfe-checkbox-in-table.service';
import { Timeframe, TimeframeService } from './timeframe.service';

@Directive()
export class WolfeCalculatorBaseDirective {
    protected busy = false;
    private firstTimeDisplayingTickers = true;

    public  selectedTimeframe: Timeframe;
    public  timeframes: string[] = Object.values(Timeframe);
    public  selectedStartDate: Date;
    public  selectedEndDate: Date;

    private portfolioInitialData: Portfolio[] = [];
    public  portfolioDataSource = new MatTableDataSource(this.portfolioInitialData);
    public  portfolioSelection = new SelectionModel(true, []);
    public  portfolioDisplayedColumns: string[] = ['select', 'portfolioName'];

    private tickerInitialData: Ticker[] = [];
    public  tickerDataSource = new MatTableDataSource(this.tickerInitialData);
    public  tickerSelection = new SelectionModel(true, []);
    public  tickerDisplayedColumns: string[] = ['select', 'ticker', 'name'];

    constructor(
        protected portfolioService: PortfolioService,
        protected timeframeService: TimeframeService,
        protected busyService: BusyService,
        protected cookieService: CookieService,
        public    wcitService: WolfeCheckboxInTableService,
        protected alertService: AlertService,
        protected busyId: number,
        protected portfolioCookieName: string,
        protected tickerCookieName: string,
        protected timeframeCookieName: string
    )
    {}

    /********************  Methods used by template for display puroses ********************/

    shouldCustomDatesBeVisible(): boolean {
        return this.selectedTimeframe === Timeframe.CUSTOM_DATES;
    }

    singleTogglePortfolioRow(row: any) {
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

    /********************  Methods used by template and these methods ********************/

    updateTickerListBasedOnPortfoliosSelected() {

        // Update the Ticker Section based on the porfolios selected
        const portfolioIds: number[] = this.portfolioSelection.selected.map((p: Portfolio) => p.id);
        this.portfolioService.retrieveSecuritiesWithTransactionsInPorfolios(portfolioIds)
        .subscribe(
          tickers => {
              // Put the tickers in the DataSource
              this.tickerDataSource.data = tickers.sort(this.tickerSortFunction);

              // If this is the first time showing the tickers, use the cookies to set up the selection
              let selectedTickers: Ticker[] = [];
              if (this.firstTimeDisplayingTickers) {
                // Set the checkboxes based on cookie values
                const tickerCookie: string = this.cookieService.get(this.tickerCookieName);
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



    /******************** PROTECTED METHODS ********************/

    protected populateTimeframe() {
        // Set the selectedTimeframe to the value in the cookie; if no cookie, set to ALL_DATES
        this.selectedTimeframe = this.timeframeService.getTimeframeFromCookie(this.timeframeCookieName) || Timeframe.ALL_DATES;
    }

    protected populatePortfolioAndTickerTables() {
        this.portfolioService.retrieveAll()
        .subscribe(
            // If this goes well, update the list of Tickers
            portfolios =>  {

            // Put the returned portfolio data in the portfolio DataSource
            this.portfolioDataSource.data = portfolios.sort((p1: Portfolio, p2: Portfolio) => p1.portfolioName < p2.portfolioName ? -1 : p1.portfolioName > p2.portfolioName ? 1 : 0);

            // Set the checkboxes based on cookie values
            const portfolioCookie: string = this.cookieService.get(this.portfolioCookieName);
            let selectedPortfolios: Portfolio[] = [];
            if (portfolioCookie.length > 0 ) {
                const ids: number[] = portfolioCookie.split(',').map(idAsString => +idAsString);
                // Portfolio could theoretically have been deleted since the cookie was created.
                // Filter out an "undefined results" when we try to "find" the portfolio
                selectedPortfolios = ids.map(id => this.portfolioDataSource.data.find((p: Portfolio) => p.id === id)).filter((p: Portfolio) => p);
            }

            // Create a new Selection Model
            this.portfolioSelection = new SelectionModel<Portfolio>(true, selectedPortfolios );

            // Now that we have the portfolio list created, set up the tickers
            this.updateTickerListBasedOnPortfoliosSelected();
            },
            // If the retrieval goes poorly, show the error
            error => this.alertService.error(error)
        );
    }

    protected setBusyState(input: boolean) {
        // Keep track of locally whether or not we're busy
        this.busy = input;
        // Tell the BusyService whether or note we're busy
        if (input) {
            this.busyService.busy(this.busyId);
        }
        else {
            this.busyService.finished(this.busyId);
        }
    }

    protected saveTimeframePortfoliosAndTickersToCookies(): void {
        // Make the cookie valid for a year
        const oneYearFromToday: Date = this.oneYearFromToday();

        // Save the timeframe that was selected
        this.cookieService.set(this.timeframeCookieName, this.selectedTimeframe, oneYearFromToday);

        // Save the portfolios that were selected.
        const portfolioIds: string =  this.portfolioSelection.selected.map(p => p.id).join();
        this.cookieService.set(this.portfolioCookieName, portfolioIds, oneYearFromToday);

        // Save the tickers that were selected.
        const tickerIds: string =  this.tickerSelection.selected.map(t => t.id).join();
        this.cookieService.set(this.tickerCookieName, tickerIds, oneYearFromToday);
    }

    protected oneYearFromToday(): Date {
        const oneYearFromToday: Date = new Date();
        oneYearFromToday.setFullYear(oneYearFromToday.getFullYear() + 1);
        return oneYearFromToday;
    }

    //
    // Function to sort Tickers by their Ticker Symbol in DESCENDING order
    // i.e., AAPL, GOOG, MSFT, SPY
    //
    protected tickerSortFunction: ((a: Ticker, b: Ticker) => number) = (a: Ticker, b: Ticker) =>
                                    a.ticker < b.ticker ? -1 : a.ticker > b.ticker ? 1 : 0

}
