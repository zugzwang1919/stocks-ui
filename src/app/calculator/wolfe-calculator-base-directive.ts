import { SelectionModel } from '@angular/cdk/collections';
import { Directive} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CookieService } from 'ngx-cookie-service';
import { AlertService } from '../general/alert/alert.service';
import { BusyService } from '../general/busy/busy.service';
import { Portfolio } from '../portfolio/portfolio';
import { PortfolioService } from '../portfolio/portfolio.service';
import { Stock } from '../stock/stock';
import { WolfeCheckboxInTableService } from '../wolfe-common/wolfe-checkbox-in-table.service';
import { Timeframe, TimeframeService } from './timeframe.service';

@Directive()
export class WolfeCalculatorBaseDirective {
    protected busy = false;
    private firstTimeDisplayingStocks = true;

    public  selectedTimeframe: Timeframe;
    public  timeframes: string[] = Object.values(Timeframe);
    public  selectedStartDate: Date;
    public  selectedEndDate: Date;

    private portfolioInitialData: Portfolio[] = [];
    public  portfolioDataSource = new MatTableDataSource(this.portfolioInitialData);
    public  portfolioSelection = new SelectionModel(true, []);
    public  portfolioDisplayedColumns: string[] = ['select', 'portfolioName'];

    private stockInitialData: Stock[] = [];
    public  stockDataSource = new MatTableDataSource(this.stockInitialData);
    public  stockSelection = new SelectionModel(true, []);
    public  stockDisplayedColumns: string[] = ['select', 'ticker', 'name'];

    constructor(
        protected portfolioService: PortfolioService,
        protected timeframeService: TimeframeService,
        protected busyService: BusyService,
        protected cookieService: CookieService,
        public    wcitService: WolfeCheckboxInTableService,
        protected alertService: AlertService,
        protected busyId: number,
        protected portfolioCookieName: string,
        protected stockCookieName: string,
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
        // Update the Stock Section based on the porfolios selected
        this.updateStockListBasedOnPortfoliosSelected();
    }

    masterTogglePortfolios() {
        // First toggle the portfolio items based on their current settings
        this.wcitService.masterToggle(this.portfolioSelection, this.portfolioDataSource);
        // Update the Stock Section based on the porfolios selected
        this.updateStockListBasedOnPortfoliosSelected();
    }

    /********************  Methods used by template and these methods ********************/

    updateStockListBasedOnPortfoliosSelected() {

        // Update the Stock Section based on the porfolios selected
        const portfolioIds: number[] = this.portfolioSelection.selected.map((p: Portfolio) => p.id);
        this.portfolioService.retrieveSecuritiesWithTransactionsInPorfolios(portfolioIds)
        .subscribe(
          stocks => {
              // Sort the stocks
              const sortedStocks: Stock[] = stocks.sort(this.stockSortFunction);
              // Stick them in the datasource
              this.stockDataSource.data = stocks.sort(this.stockSortFunction);
              // Start off by assuming that all stocks will be selected
              let selectedStocks: Stock[] = sortedStocks;

              // If this is the first time showing the stocks, use the cookies to set up the selection
              if (this.firstTimeDisplayingStocks) {
                // Set the checkboxes based on cookie values
                const stockCookie: string = this.cookieService.get(this.stockCookieName);
                if (stockCookie.length > 0 ) {
                  const ids: number[] = stockCookie.split(',').map(idAsString => +idAsString);
                  // It's possible that the stock was deleted since the cookie was saved.
                  // Filter out any "undefined" results from the find() below.
                  selectedStocks = ids.map(id => stocks.find((t: Stock) => t.id === id)).filter((t: Stock) => t);
                }
                this.firstTimeDisplayingStocks = false;
              }
              // Create a new set of check boxes (they will be updated with selected values as set above)
              this.stockSelection = new SelectionModel(true, selectedStocks);
          },
          error => this.alertService.error(error)
        );
      }



    /******************** PROTECTED METHODS ********************/

    protected populateTimeframe() {
        // Set the selectedTimeframe to the value in the cookie; if no cookie, set to ALL_DATES
        this.selectedTimeframe = this.timeframeService.getTimeframeFromCookie(this.timeframeCookieName) || Timeframe.ALL_DATES;
    }

    protected populatePortfolioAndStockTables() {
        this.portfolioService.retrieveAll()
        .subscribe(
            // If this goes well, update the list of Stocks
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

            // Now that we have the portfolio list created, set up the stocks
            this.updateStockListBasedOnPortfoliosSelected();
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

    protected saveTimeframePortfoliosAndStocksToCookies(): void {
        // Make the cookie valid for a year
        const oneYearFromToday: Date = this.oneYearFromToday();

        // Save the timeframe that was selected
        this.cookieService.set(this.timeframeCookieName, this.selectedTimeframe, oneYearFromToday);

        // Save the portfolios that were selected.
        const portfolioIds: string =  this.portfolioSelection.selected.map(p => p.id).join();
        this.cookieService.set(this.portfolioCookieName, portfolioIds, oneYearFromToday);

        // Save the stocks that were selected.
        const stockIds: string =  this.stockSelection.selected.map(t => t.id).join();
        this.cookieService.set(this.stockCookieName, stockIds, oneYearFromToday);
    }

    protected oneYearFromToday(): Date {
        const oneYearFromToday: Date = new Date();
        oneYearFromToday.setFullYear(oneYearFromToday.getFullYear() + 1);
        return oneYearFromToday;
    }

    //
    // Function to sort Stocks by their Stock Symbol in DESCENDING order
    // i.e., AAPL, GOOG, MSFT, SPY
    //
    protected stockSortFunction: ((a: Stock, b: Stock) => number) = (a: Stock, b: Stock) =>
                                   a.ticker < b.ticker ? -1 : a.ticker > b.ticker ? 1 : 0

}
