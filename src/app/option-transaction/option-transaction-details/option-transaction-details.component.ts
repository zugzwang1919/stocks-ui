import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup,  Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AlertService } from '../../general/alert/alert.service';
import { Option } from '../../option/option';
import { OptionService } from 'src/app/option/option.service';
import { OptionTransactionService } from '../option-transaction.service';
import { Portfolio } from '../../portfolio/portfolio';
import { PortfolioService } from 'src/app/portfolio/portfolio.service';

@Component({
  selector: 'app-option-transaction-details',
  templateUrl: './option-transaction-details.component.html',
  styleUrls: ['./option-transaction-details.component.sass']
})
export class OptionTransactionDetailsComponent implements OnInit {

  optionTransactionDetailsGroup: FormGroup;

  retrievedOptionTransactionId: number;
  attemptingToCreate: boolean;
  busy: boolean;

  activities = [ 'BUY_TO_OPEN', 'BUY_TO_CLOSE', 'SELL_TO_OPEN', 'SELL_TO_CLOSE' ];
  portfolios: Portfolio[] = [];
  options: Option[] = [];


  constructor(
    private alertService: AlertService,
    private currencyPipe: CurrencyPipe,
    private formBuilder: FormBuilder,
    private optionService: OptionService,
    private optionTransactionService: OptionTransactionService,
    private portfolioService: PortfolioService,
    private route: ActivatedRoute,
    private router: Router,
    ) { }

  ngOnInit(): void {

    this.attemptingToCreate = this.route.snapshot.url[1].toString() === 'create';
    this.optionTransactionDetailsGroup = this.formBuilder.group({
      date: ['', [Validators.required ]],
      portfolio: ['', [Validators.required]],
      option: ['', [Validators.required]],
      activity: ['', [Validators.required]],
      numberOfContracts: ['', [Validators.required ]],
      amount: ['', [Validators.required ]]
    });
    this.busy = false;

    this.populateOptionDropDown();
    this.populatePortfolioDropDown();

    // If we've received an edit request (i.e., a non-create request)
    if (!this.attemptingToCreate) {
      // Retrieve the requested option transaction & save its ID
      const id: number = +(this.route.snapshot.url[1].toString());
      this.optionTransactionService.retrieve(id)
      .subscribe(
        // If this goes well, update the data in the form
        foundOptionTransaction =>  {
          this.retrievedOptionTransactionId = foundOptionTransaction.id;
          // Set the data in the form to be the data that was returned from the service
          this.optionTransactionDetailsGroup.get('date').setValue(foundOptionTransaction.date);
          this.optionTransactionDetailsGroup.get('portfolio').setValue(foundOptionTransaction.portfolio.id);
          this.optionTransactionDetailsGroup.get('option').setValue(foundOptionTransaction.option.id);
          this.optionTransactionDetailsGroup.get('activity').setValue(foundOptionTransaction.activity);
          this.optionTransactionDetailsGroup.get('numberOfContracts').setValue(foundOptionTransaction.numberOfContracts);
          this.optionTransactionDetailsGroup.get('amount').setValue(this.currencyPipe.transform(foundOptionTransaction.amount));
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

    // Try to create the new security/stock/etf/mutual fund
    if (this.attemptingToCreate) {
      this.optionTransactionService.create( this.optionTransactionDetailsGroup.get('date').value,
                                            this.optionTransactionDetailsGroup.get('portfolio').value,
                                            this.optionTransactionDetailsGroup.get('option').value,
                                            this.optionTransactionDetailsGroup.get('activity').value,
                                            this.optionTransactionDetailsGroup.get('numberOfContracts').value,
                                            this.optionTransactionDetailsGroup.get('amount').value)
        .subscribe(
          success  =>  {
            // If this goes well...
            // Indicate that we're not waiting any more
            this.busy = false;
            // navigate to the list of Option Transaction page
            this.router.navigate(['/option-transaction']);
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
      this.optionTransactionService.update( this.retrievedOptionTransactionId,
                                            this.optionTransactionDetailsGroup.get('date').value,
                                            this.optionTransactionDetailsGroup.get('portfolio').value,
                                            this.optionTransactionDetailsGroup.get('option').value,
                                            this.optionTransactionDetailsGroup.get('activity').value,
                                            this.optionTransactionDetailsGroup.get('numberOfContracts').value,
                                            this.optionTransactionDetailsGroup.get('amount').value)
        .subscribe(
          optionTransaction  =>  {
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
        // When the portfolios are returned, sort them alphabetically by portfolio name
        porfolios => this.portfolios = porfolios.sort((a, b) => a.portfolioName < b.portfolioName ? -1 : a.portfolioName > b.portfolioName ? 1 : 0),
        error => this.alertService.error(error)
      );
  }

  private populateOptionDropDown() {
    this.optionService.retrieveAll()
      .subscribe(
        // When we get the list of options, sort them such that the most recent options are at the top of the list
        // If expiration dates are the same, sort by ticker symbol
        options => this.options = options.sort((a, b) => a.expirationDate > b.expirationDate ? -1 : a.expirationDate < b.expirationDate ? 1 : a.stock.ticker < b.stock.ticker ? -1 : 1),
        error => this.alertService.error(error)
      );
  }

  getErrorDate(): string {
    return this.optionTransactionDetailsGroup.get('date').hasError('required') ? 'Please enter a date' : '';
  }

  getErrorPortfolio(): string {
    return this.optionTransactionDetailsGroup.get('portfolio').hasError('required') ? 'Please select a portfolio' : '';
  }

  getErrorActivity(): string {
    return this.optionTransactionDetailsGroup.get('activity').hasError('required') ? 'Please select either BUY or SELL' : '';
  }

  getErrorOption(): string {
    return this.optionTransactionDetailsGroup.get('option').hasError('required') ? 'Please select an option' : '';
  }

  getErrorNumberOfContracts(): string {
    return this.optionTransactionDetailsGroup.get('numberOfContracts').hasError('required') ? 'Please enter number of contracts' : '';
  }

  getErrorAmount(): string {
    return this.optionTransactionDetailsGroup.get('amount').hasError('required') ? 'Please enter a dollar amount.' : '';
  }

}
