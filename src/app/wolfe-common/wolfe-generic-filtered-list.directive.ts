import { Directive, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { AlertService } from '../general/alert/alert.service';
import { Portfolio } from '../portfolio/portfolio';
import { PortfolioService } from '../portfolio/portfolio.service';
import { Ticker } from '../ticker/ticker';
import { TickerService } from '../ticker/ticker.service';
import { WolfeMaterialModule } from '../wolfe-material/wolfe-material.module';
import { WolfeGenericListDirective } from './wolfe-generic-list-directive';
import { WolfeGenericService } from './wolfe-generic-service';
import { WolfeTrackedItem } from './wolfe-tracked-item';

@Directive()
export class WolfeGenericFilteredListDirective<T extends WolfeTrackedItem> extends WolfeGenericListDirective<T> implements OnInit {

  ALL_PORTFOLIO: Portfolio = {id: -1, portfolioName: 'ALL'};
  portfolios: Portfolio[] = [this.ALL_PORTFOLIO];
  selectedPortfolio = -1;

  ALL_TICKERS: Ticker = {id: -1, ticker: 'ALL', name: '', benchmark: false};
  tickers: Ticker[] = [this.ALL_TICKERS];
  selectedTicker = -1;

  constructor(
    protected router: Router,
    protected alertService: AlertService,
    protected wolfeTrackedItemService: WolfeGenericService<T>,
    protected prefixOfEditPath: string,
    private   portfolioService: PortfolioService,
    private   tickerService: TickerService
    ) {
    super(router,
      alertService,
      wolfeTrackedItemService,
      prefixOfEditPath);
  }

  ngOnInit() {
    // First let the super class init
    super.ngOnInit();
    // Add the portfolios to the Filter drop down
    this.portfolioService.retrieveAll()
    .subscribe(
      foundPortfolios => foundPortfolios.forEach(fp => this.portfolios.push(fp)),
      error => this.alertService.error(error)
    );
    // Add the tickers to the Filter drop down
    this.tickerService.retrieveAll()
    .subscribe(
      foundTickers => foundTickers.forEach(ft => this.tickers.push(ft)),
      error => this.alertService.error(error)
    );
  }

  onFilterChange(ev: MatSelectChange) {
    console.log('inside onFilterChange()');
    this.performFilter(this.filterFunction.bind(this));
    console.log('leaving onFilterChange()');
  }

  filterFunction(item: any): boolean{
    // OK.  I guess by default, don't filter anything out, but we're really expecting
    // the subclass to provide an implementation.
    return true;
  }

}
