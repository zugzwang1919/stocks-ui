import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup,  Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { distinctUntilChanged } from 'rxjs/operators';

import { AlertService } from '../../general/alert/alert.service';
import { CurrentUserService} from '../../user/current-user/current-user.service';
import { Portfolio } from '../../portfolio/portfolio';
import { PortfolioService } from 'src/app/portfolio/portfolio.service';
import { Ticker } from '../../ticker/ticker';
import { TickerService } from 'src/app/ticker/ticker.service';
import { TickerTransactionService } from '../ticker-transaction.service';
import { TickerTransaction, TickerTransactionActivity } from '../ticker-transaction';




@Component({
  selector: 'app-ticker-transaction-details',
  templateUrl: './ticker-transaction-details.component.html',
  styleUrls: ['./ticker-transaction-details.component.sass']
})
export class TickerTransactionDetailsComponent implements OnInit {



  tickerTransactionDetailsGroup: FormGroup;

  retrievedTickerTransactionId: number;
  attemptingToCreate: boolean;
  busy: boolean;

  activities = [ 'BUY', 'SELL' ];
  portfolios: Portfolio[] = [];
  tickers: Ticker[] = [];

  constructor(
    private alertService: AlertService,
    private currentUserService: CurrentUserService,
    private currencyPipe: CurrencyPipe,
    private formBuilder: FormBuilder,
    private portfolioService: PortfolioService,
    private route: ActivatedRoute,
    private router: Router,
    private tickerService: TickerService,
    private tickerTransactionService: TickerTransactionService
    ) { }

  ngOnInit(): void {
    this.attemptingToCreate = this.route.snapshot.url[1].toString() === 'create';
    this.tickerTransactionDetailsGroup = this.formBuilder.group({
      date: ['', [Validators.required ]],
      portfolio: ['', [Validators.required]],
      ticker: ['', [Validators.required]],
      activity: ['', [Validators.required]],
      tradeSize: ['', [Validators.required ]],
      amount: ['', [Validators.required ]]
    });
    this.busy = false;

    this.populateTickerDropDown();
    this.populatePortfolioDropDown();

    // If we've received an edit request (i.e., a non-create request)
    if (!this.attemptingToCreate) {
      // Retrieve the requested ticker & drop it into our "ticker variable"
      const id: number = +(this.route.snapshot.url[1].toString());
      this.tickerTransactionService.retrieve(id)
      .subscribe(
        // If this goes well, update the data in the form
        foundTickerTransaction =>  {
          this.retrievedTickerTransactionId = foundTickerTransaction.id;
          // Set the data in the form to be the data that was returned from the service
          this.tickerTransactionDetailsGroup.get('date').setValue(foundTickerTransaction.date);
          this.tickerTransactionDetailsGroup.get('portfolio').setValue(foundTickerTransaction.portfolio.id);
          this.tickerTransactionDetailsGroup.get('ticker').setValue(foundTickerTransaction.stock.id);
          this.tickerTransactionDetailsGroup.get('activity').setValue(foundTickerTransaction.activity);
          this.tickerTransactionDetailsGroup.get('tradeSize').setValue(foundTickerTransaction.tradeSize);
          this.tickerTransactionDetailsGroup.get('amount').setValue(this.currencyPipe.transform(foundTickerTransaction.amount));
        },
        // If the retrieval goes poorly, show the error
        error => this.alertService.error(error)
      );

    }
  }

  onSubmit() {
    // reset any previous alerts
    this.alertService.clear();

    // indicate that we're busy
    this.busy = true;

    // Try to create the new security/stock/etf/mutual fund/ticker
    if (this.attemptingToCreate) {
      this.tickerTransactionService.create( this.tickerTransactionDetailsGroup.get('date').value,
                                            this.tickerTransactionDetailsGroup.get('portfolio').value,
                                            this.tickerTransactionDetailsGroup.get('ticker').value,
                                            this.tickerTransactionDetailsGroup.get('activity').value,
                                            this.tickerTransactionDetailsGroup.get('tradeSize').value,
                                            this.tickerTransactionDetailsGroup.get('amount').value)
        .subscribe(
          success  =>  {
            // If this goes well...
            // Indicate that we're not waiting any more
            this.busy = false;
            // navigate to the appropriate page
            this.router.navigate(['/ticker-transaction']);
          },
          error => {
            // If this goes poorly...
            // Indicate that we're not waiting any more
            this.busy = false;
            // Display the error
            this.alertService.error(error);
          }
        );
    } else {
      this.tickerTransactionService.update( this.retrievedTickerTransactionId,
                                            this.tickerTransactionDetailsGroup.get('date').value,
                                            this.tickerTransactionDetailsGroup.get('portfolio').value,
                                            this.tickerTransactionDetailsGroup.get('ticker').value,
                                            this.tickerTransactionDetailsGroup.get('activity').value,
                                            this.tickerTransactionDetailsGroup.get('tradeSize').value,
                                            this.tickerTransactionDetailsGroup.get('amount').value)
        .subscribe(
          tickerTransaction  =>  {
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

  private populatePortfolioDropDown() {
    this.portfolioService.retrieveAll()
      .subscribe(
        porfolios => this.portfolios = porfolios,
        error => this.alertService.error(error)
      );
  }

  private populateTickerDropDown() {
    this.tickerService.retrieveAll()
      .subscribe(
        tickers => this.tickers = tickers,
        error => this.alertService.error(error)
      );
  }

  getErrorDate(): string {
    return this.tickerTransactionDetailsGroup.get('date').hasError('required') ? 'Please enter a date' : '';
  }

  getErrorPortfolio(): string {
    return this.tickerTransactionDetailsGroup.get('portfolio').hasError('required') ? 'Please select a portfolio' : '';
  }

  getErrorActivity(): string {
    return this.tickerTransactionDetailsGroup.get('activity').hasError('required') ? 'Please select either BUY or SELL' : '';
  }

  getErrorTicker(): string {
    return this.tickerTransactionDetailsGroup.get('ticker').hasError('required') ? 'Please select a ticker symbol' : '';
  }

  getErrorTradeSize(): string {
    return this.tickerTransactionDetailsGroup.get('tradeSize').hasError('required') ? 'Please enter number of shares' : '';
  }

  getErrorAmount(): string {
    return this.tickerTransactionDetailsGroup.get('amount').hasError('required') ? 'Please enter a dollar amount.' : '';
  }

}
