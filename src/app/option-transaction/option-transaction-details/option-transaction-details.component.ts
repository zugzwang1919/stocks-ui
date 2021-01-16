import { Component, OnDestroy, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup,  ValidationErrors,  ValidatorFn,  Validators } from '@angular/forms';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';

import { AlertService } from '../../general/alert/alert.service';
import { Option } from '../../option/option';
import { OptionService } from 'src/app/option/option.service';
import { OptionTransactionService } from '../option-transaction.service';
import { Portfolio } from '../../portfolio/portfolio';
import { PortfolioService } from 'src/app/portfolio/portfolio.service';
import { StockService } from 'src/app/stock/stock.service';
import { Stock } from 'src/app/stock/stock';
import { OptionDetailsComponent } from 'src/app/option/option-details/option-details.component';
import { WolfeValidators } from 'src/app/wolfe-common/wolfe-validators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-option-transaction-details',
  templateUrl: './option-transaction-details.component.html',
  styleUrls: ['./option-transaction-details.component.sass']
})
export class OptionTransactionDetailsComponent implements OnInit, OnDestroy {

  optionTransactionDetailsGroup: FormGroup;

  retrievedOptionTransactionId: number;
  attemptingToCreate: boolean;
  busy = false;
  routeUrlSubscription: Subscription;

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
    private activatedRoute: ActivatedRoute,
    private router: Router,

    ) { }

  ngOnInit(): void {

    this.optionTransactionDetailsGroup = this.formBuilder.group({
      date: ['', [Validators.required]],
      portfolio: ['', [Validators.required]],
      existingOrNew: ['1', []],
      option: ['', [this.checkExistingOptionField(this)]],
      optionType: [{value: '', disabled: true}, [this.checkNewOptionRequiredOnlyField(this)]],
      stock: [{value: '', disabled: true}, [this.checkNewOptionRequiredOnlyField(this)]],
      expirationDate: [{value: '', disabled: true}, [this.checkNewOptionRequiredOnlyField(this)]],
      strikePrice: [{value: '', disabled: true}, [this.checkNewOptionStrikePriceField(this)]],
      activity: ['', [Validators.required]],
      numberOfContracts: ['', [Validators.required, WolfeValidators.validatePositiveInteger ]],
      amount: ['', [Validators.required, WolfeValidators.validateCurrency ]]
    });


    this.populateOptionDropDown();
    this.populatePortfolioDropDown();
    this.populateStockDropDown();
    this.subscribeToRadioButtonChanges();

    // Subscribe to changes in the URL - This can occur when the user is looking at a transaction and then selects "Create new option transaction"
    // or when the user just modifies the url to look at a different transaction (i.e. changing /option-transaction/2 to /option-transaction/19)
    // Without this subscription, this component is unaware of any new request since ngOnInit() will not be called for a second time
    this.routeUrlSubscription = this.activatedRoute.url.subscribe((urlSegments: UrlSegment[]) => this.initialize(urlSegments));
  }

  // Once the user is finished with this page, unsuscribe to changes in the Activated Route's URL
  ngOnDestroy() {
    this.routeUrlSubscription.unsubscribe();
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

  checkExistingOptionField(optionTranasctionDetailsComponent: OptionTransactionDetailsComponent): ValidatorFn {
    return this.validateExistingOrNewOptionField(optionTranasctionDetailsComponent, '1');
  }

  checkNewOptionRequiredOnlyField(optionTranasctionDetailsComponent: OptionTransactionDetailsComponent): ValidatorFn {
    return this.validateExistingOrNewOptionField(optionTranasctionDetailsComponent, '2');
  }

  checkNewOptionStrikePriceField(optionTranasctionDetailsComponent: OptionTransactionDetailsComponent): ValidatorFn {
    return this.validateExistingOrNewOptionField(optionTranasctionDetailsComponent, '2', WolfeValidators.validateCurrency);
  }

  validateExistingOrNewOptionField( optionTranasctionDetailsComponent: OptionTransactionDetailsComponent,
                                    radioButtonValue: string,
                                    lowLevelValidator ?: ValidatorFn): ValidatorFn {
    return (existingOrNewOptionControl: FormControl) => {
      const optionTransactionDetailsGroup: FormGroup = optionTranasctionDetailsComponent.optionTransactionDetailsGroup;
      // This does seem to get called with the controls are being built
      // We don't need to do any validation if everything is not fully formed
      if (optionTransactionDetailsGroup && optionTransactionDetailsGroup.controls) {
        // We only need to check this field if the specified radio button is selected
        if (optionTransactionDetailsGroup.get('existingOrNew').value === radioButtonValue) {
          // When the specified radio button is selected, this control must be populated.  If it is not,
          // return a "required" error, so FIRST call the required validator
          const possibleReturn = Validators.required(existingOrNewOptionControl);
          if (possibleReturn) {
            return possibleReturn;
          }
          // If the caller has an additional validator that should be performed call it
          if (lowLevelValidator) {
            return lowLevelValidator(existingOrNewOptionControl);
          }
        }
      }
      // Returning null means that there are no issues
      return null;
    };
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

  getErrorNewOptionType(): string {
    return this.optionTransactionDetailsGroup.get('optionType').hasError('required') ? 'Please select an option type' : '';
  }

  getErrorNewOptionStock(): string {
    return this.optionTransactionDetailsGroup.get('stock').hasError('required') ? 'Please select a stock' : '';
  }

  getErrorNewOptionExpirationDate(): string {
    return this.optionTransactionDetailsGroup.get('expirationDate').hasError('required') ? 'Please select an expirtaion date' : '';
  }

  getErrorNewOptionStrikePrice(): string {
    const strikePriceControl = this.optionTransactionDetailsGroup.get('strikePrice');
    return  strikePriceControl.hasError('required') ? 'Please enter the option\'s strike price' :
            strikePriceControl.hasError('currency') ? 'Please enter a valid dollar amount' : '';
  }

  getErrorNumberOfContracts(): string {
    const numberOfContractsControl = this.optionTransactionDetailsGroup.get('numberOfContracts');
    return numberOfContractsControl.hasError('required') ? 'Please enter number of contracts' :
           numberOfContractsControl.hasError('positiveInteger') ? 'Must be a positive integer' : '';
  }

  getErrorAmount(): string {
    const amountControl = this.optionTransactionDetailsGroup.get('amount');
    return  amountControl.hasError('required') ? 'Please enter the transactional amount.' :
            amountControl.hasError('currency') ? 'Please enter a valid dollar amount' : '';
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

  private initialize(urlSegments: UrlSegment[]) {
    this.attemptingToCreate = urlSegments[1].toString() === 'create';
    // If we're preparing for a create request (i.e., a non-create request)
    if (this.attemptingToCreate) {
      this.initializeElements('', '', '', '', '', '', 1);
    }
    // If we're preparing for an edit request (i.e., a non-create request)
    else {
      // Retrieve the requested option transaction & save its ID
      const id: number = +(urlSegments[1].toString());
      this.optionTransactionService.retrieve(id)
      .subscribe(
        // If this goes well, update the data in the form
        foundOptionTransaction =>  {
          this.retrievedOptionTransactionId = foundOptionTransaction.id;
          // Set the data in the form to be the data that was returned from the service
          this.initializeElements(foundOptionTransaction.date, foundOptionTransaction.portfolio.id, foundOptionTransaction.option.id,
                                  foundOptionTransaction.activity, foundOptionTransaction.numberOfContracts, foundOptionTransaction.amount, 2);
        },
        // If the retrieval goes poorly, show the error
        error => this.alertService.error(error)
      );
    }
  }

  private initializeElements( date: Date | string, portfolioId: number | string, optionId: number | string,
                              activity: string, numberOfContracts: number | string, amount: number | string,
                              newOrExisting: number) {

    // Set the values
    this.optionTransactionDetailsGroup.get('date').setValue(date);
    this.optionTransactionDetailsGroup.get('portfolio').setValue(portfolioId);
    this.optionTransactionDetailsGroup.get('option').setValue(optionId);
    this.optionTransactionDetailsGroup.get('activity').setValue(activity);
    this.optionTransactionDetailsGroup.get('numberOfContracts').setValue(numberOfContracts);
    this.optionTransactionDetailsGroup.get('amount').setValue(this.currencyPipe.transform(amount));
    this.optionTransactionDetailsGroup.get('newOrExisting').setValue(newOrExisting);
    // Mark all elements as pristine (to disable the UPDATE button if the page is being displayed for update)
    this.optionTransactionDetailsGroup.markAsPristine();
    // Mark all elements as untouched (so that validation will not be triggered when the page is displayed)
    this.optionTransactionDetailsGroup.markAsUntouched();
  }



}

