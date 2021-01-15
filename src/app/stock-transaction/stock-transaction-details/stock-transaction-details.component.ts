import { Component, OnDestroy, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup,  Validators } from '@angular/forms';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';

import { AlertService } from '../../general/alert/alert.service';
import { Portfolio } from '../../portfolio/portfolio';
import { PortfolioService } from 'src/app/portfolio/portfolio.service';
import { Stock } from '../../stock/stock';
import { StockService } from 'src/app/stock/stock.service';
import { StockTransactionService } from '../stock-transaction.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-stock-transaction-details',
  templateUrl: './stock-transaction-details.component.html',
  styleUrls: ['./stock-transaction-details.component.sass']
})

export class StockTransactionDetailsComponent implements OnInit, OnDestroy {

  stockTransactionDetailsGroup: FormGroup;

  retrievedStockTransactionId: number;
  attemptingToCreate: boolean;
  busy: boolean;
  activatedRouteUrlSubscription: Subscription;
  activities = [ 'BUY', 'SELL' ];
  portfolios: Portfolio[] = [];
  stocks: Stock[] = [];

  constructor(
    private alertService: AlertService,
    private currencyPipe: CurrencyPipe,
    private formBuilder: FormBuilder,
    private portfolioService: PortfolioService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private stockService: StockService,
    private stockTransactionService: StockTransactionService
    ) { }

  ngOnInit(): void {
    this.stockTransactionDetailsGroup = this.formBuilder.group({
      date: ['', [Validators.required ]],
      portfolio: ['', [Validators.required]],
      stock: ['', [Validators.required]],
      activity: ['', [Validators.required]],
      tradeSize: ['', [Validators.required ]],
      amount: ['', [Validators.required ]]
    });
    this.busy = false;

    this.populateStockDropDown();
    this.populatePortfolioDropDown();

    this.activatedRouteUrlSubscription = this.activatedRoute.url.subscribe( (UrlSegments: UrlSegment[]) => this.initialize(UrlSegments) );
  }

  ngOnDestroy(): void {
    this.activatedRouteUrlSubscription.unsubscribe();
  }

  onSubmit() {
    // reset any previous alerts
    this.alertService.clear();

    // indicate that we're busy
    this.busy = true;

    // Try to create the new security/stock/etf/mutual fund
    if (this.attemptingToCreate) {
      this.stockTransactionService.create( this.stockTransactionDetailsGroup.get('date').value,
                                            this.stockTransactionDetailsGroup.get('portfolio').value,
                                            this.stockTransactionDetailsGroup.get('stock').value,
                                            this.stockTransactionDetailsGroup.get('activity').value,
                                            this.stockTransactionDetailsGroup.get('tradeSize').value,
                                            this.stockTransactionDetailsGroup.get('amount').value)
        .subscribe(
          success  =>  {
            // If this goes well...
            // Indicate that we're not waiting any more
            this.busy = false;
            // navigate to the appropriate page
            this.router.navigate(['/stock-transaction']);
          },
          error => {
            // If this goes poorly...
            // Indicate that we're not waiting any more
            this.busy = false;
            // Display the error
            this.alertService.error(error);
          }
        );
    }
    else {
      this.stockTransactionService.update( this.retrievedStockTransactionId,
                                            this.stockTransactionDetailsGroup.get('date').value,
                                            this.stockTransactionDetailsGroup.get('portfolio').value,
                                            this.stockTransactionDetailsGroup.get('stock').value,
                                            this.stockTransactionDetailsGroup.get('activity').value,
                                            this.stockTransactionDetailsGroup.get('tradeSize').value,
                                            this.stockTransactionDetailsGroup.get('amount').value)
        .subscribe(
          stockTransaction  =>  {
            // If this goes well...
            // Indicate that we're not waiting any more
            this.busy = false;
            // Display a success message
            this.alertService.success('This trasaction was successfully updated.');
          },
          error => {
            // If this goes poorly...
            // Indicate that we're not waiting any more
            this.busy = false;
            // Display the error
            this.alertService.error(error);
          }
        );
    }
  }

  getErrorDate(): string {
    return this.stockTransactionDetailsGroup.get('date').hasError('required') ? 'Please enter a date' : '';
  }

  getErrorPortfolio(): string {
    return this.stockTransactionDetailsGroup.get('portfolio').hasError('required') ? 'Please select a portfolio' : '';
  }

  getErrorActivity(): string {
    return this.stockTransactionDetailsGroup.get('activity').hasError('required') ? 'Please select either BUY or SELL' : '';
  }

  getErrorStock(): string {
    return this.stockTransactionDetailsGroup.get('stock').hasError('required') ? 'Please select a stock symbol' : '';
  }

  getErrorTradeSize(): string {
    return this.stockTransactionDetailsGroup.get('tradeSize').hasError('required') ? 'Please enter number of shares' : '';
  }

  getErrorAmount(): string {
    return this.stockTransactionDetailsGroup.get('amount').hasError('required') ? 'Please enter a dollar amount.' : '';
  }

  private initialize(urlSegments: UrlSegment[]) {
    this.attemptingToCreate = urlSegments[1].toString() === 'create';
    // If we've received an edit request (i.e., a non-create request)
    if (!this.attemptingToCreate) {
      // Retrieve the requested stock transaction & save its ID
      const id: number = +(urlSegments[1].toString());
      this.stockTransactionService.retrieve(id)
      .subscribe(
        // If this goes well, update the data in the form
        foundStockTransaction =>  {
          this.retrievedStockTransactionId = foundStockTransaction.id;
          // Set the data in the form to be the data that was returned from the service
          this.stockTransactionDetailsGroup.get('date').setValue(foundStockTransaction.date);
          this.stockTransactionDetailsGroup.get('portfolio').setValue(foundStockTransaction.portfolio.id);
          this.stockTransactionDetailsGroup.get('stock').setValue(foundStockTransaction.stock.id);
          this.stockTransactionDetailsGroup.get('activity').setValue(foundStockTransaction.activity);
          this.stockTransactionDetailsGroup.get('tradeSize').setValue(foundStockTransaction.tradeSize);
          this.stockTransactionDetailsGroup.get('amount').setValue(this.currencyPipe.transform(foundStockTransaction.amount));
        },
        // If the retrieval goes poorly, show the error
        error => this.alertService.error(error)
      );

    }
  }

  private populatePortfolioDropDown() {
    this.portfolioService.retrieveAll()
      .subscribe(
        porfolios => this.portfolios = porfolios,
        error => this.alertService.error(error)
      );
  }

  private populateStockDropDown() {
    this.stockService.retrieveAll()
      .subscribe(
        stocks => this.stocks = stocks,
        error => this.alertService.error(error)
      );
  }

}
