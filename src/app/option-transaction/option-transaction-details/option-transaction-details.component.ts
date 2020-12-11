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
import { StockService } from 'src/app/stock/stock.service';
import { Stock } from 'src/app/stock/stock';

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
  optionTypes = [ 'CALL', 'PUT' ];

  portfolios: Portfolio[] = [];
  options: Option[] = [];
  stocks: Stock[] = [];


  constructor(
    private alertService: AlertService,
    private currencyPipe: CurrencyPipe,
    private formBuilder: FormBuilder,
    private optionService: OptionService,
    private optionTransactionService: OptionTransactionService,
    private portfolioService: PortfolioService,
    private stockService: StockService,
    private route: ActivatedRoute,
    private router: Router,
    ) { }

  ngOnInit(): void {

    this.attemptingToCreate = this.route.snapshot.url[1].toString() === 'create';
    this.optionTransactionDetailsGroup = this.formBuilder.group({
      date: ['', [Validators.required ]],
      portfolio: ['', [Validators.required]],
      existingOrNew: ['1', []],
      option: ['', []],
      optionType: [{value: '', disabled: true}, []],
      stock: [{value: '', disabled: true}, []],
      expirationDate: [{value: '', disabled: true}, []],
      strikePrice: [{value: '', disabled: true}, []],
      activity: ['', [Validators.required]],
      numberOfContracts: ['', [Validators.required ]],
      amount: ['', [Validators.required ]]
    });

    this.busy = false;

    this.populateOptionDropDown();
    this.populatePortfolioDropDown();
    this.populateStockDropDown();
    this.subscribeToRadioButtonChanges();

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

    // If the user has asked for a new option to be created
    if (this.optionTransactionDetailsGroup.get('existingOrNew').value === '2') {
      // First create the new option
      this.optionService.create(  this.optionTransactionDetailsGroup.get('optionType').value,
                                  this.optionTransactionDetailsGroup.get('stock').value,
                                  this.optionTransactionDetailsGroup.get('strikePrice').value,
                                  this.optionTransactionDetailsGroup.get('expirationDate').value)
        .subscribe(
          newOption => {
            // Then create/update the option transaction
            this.createOrUpdateOptionTransaction(newOption.id);
          },
          error => this.handleBusyAndError(error)
        );
    }
    // Else, the user is using an existing option.  If this is the case, we can simply
    // call createOrUpdateOptionTransaction()
    else {
      this.createOrUpdateOptionTransaction();
    }
  }

  private createOrUpdateOptionTransaction(newOptionId?: number) {
    if (this.attemptingToCreate) {
      this.optionTransactionService.create(this.optionTransactionDetailsGroup.get('date').value,
        this.optionTransactionDetailsGroup.get('portfolio').value,
        newOptionId || this.optionTransactionDetailsGroup.get('option').value,
        this.optionTransactionDetailsGroup.get('activity').value,
        this.optionTransactionDetailsGroup.get('numberOfContracts').value,
        this.optionTransactionDetailsGroup.get('amount').value)
        .subscribe(
          success => {
            // If this goes well...
            // Indicate that we're not waiting any more
            this.busy = false;
            // navigate to the list of Option Transaction page
            this.router.navigate(['/option-transaction']);
          },
          error => this.handleBusyAndError(error)
        );
    } else {
      this.optionTransactionService.update(this.retrievedOptionTransactionId,
        this.optionTransactionDetailsGroup.get('date').value,
        this.optionTransactionDetailsGroup.get('portfolio').value,
        newOptionId || this.optionTransactionDetailsGroup.get('option').value,
        this.optionTransactionDetailsGroup.get('activity').value,
        this.optionTransactionDetailsGroup.get('numberOfContracts').value,
        this.optionTransactionDetailsGroup.get('amount').value)
        .subscribe(
          optionTransaction => {
            // If this goes well...
            // Indicate that we're not waiting any more
            this.busy = false;
            // In the event that we created a new option earlier...
            if (newOptionId) {
              // Repopulate the option drop down so that it includes the recently created option
              this.populateOptionDropDown();
              // Show that we're now using an 'existing' option
              this.optionTransactionDetailsGroup.get('existingOrNew').setValue('1');
              // Set the value of the option to be the one that we created
              this.optionTransactionDetailsGroup.get('option').setValue(newOptionId);
            }
            // Display a success message
            this.alertService.success('This trasaction was successfully updated.');
          },
          error => this.handleBusyAndError(error)
        );
    }
  }

  private populateStockDropDown() {
    this.stockService.retrieveAll()
      .subscribe(
        // When the stocks are returned, sort them alphabetically by ticker
        stocks => this.stocks = stocks.sort((a, b) => a.ticker < b.ticker ? -1 : a.ticker > b.ticker ? 1 : 0),
        error => this.alertService.error(error)
      );
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

  private subscribeToRadioButtonChanges() {
    this.optionTransactionDetailsGroup.get('existingOrNew').valueChanges.subscribe(newValue => {
      if (newValue === '1') {
        this.optionTransactionDetailsGroup.get('option').enable();
        this.optionTransactionDetailsGroup.get('optionType').disable();
        this.optionTransactionDetailsGroup.get('stock').disable();
        this.optionTransactionDetailsGroup.get('expirationDate').disable();
        this.optionTransactionDetailsGroup.get('strikePrice').disable();
      }
      else {
        this.optionTransactionDetailsGroup.get('option').disable();
        this.optionTransactionDetailsGroup.get('optionType').enable();
        this.optionTransactionDetailsGroup.get('stock').enable();
        this.optionTransactionDetailsGroup.get('expirationDate').enable();
        this.optionTransactionDetailsGroup.get('strikePrice').enable();
      }
    });
  }

  private handleBusyAndError(errorString) {
    this.busy = false;
    this.alertService.error(errorString);
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
