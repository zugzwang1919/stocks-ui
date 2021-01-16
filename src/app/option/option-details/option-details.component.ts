import { Component, OnDestroy, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup,  Validators } from '@angular/forms';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';

import { AlertService } from '../../general/alert/alert.service';
import { OptionService } from '../option.service';
import { Stock } from '../../stock/stock';
import { StockService } from 'src/app/stock/stock.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-option-details',
  templateUrl: './option-details.component.html',
  styleUrls: ['./option-details.component.sass']
})
export class OptionDetailsComponent implements OnInit, OnDestroy {

  optionDetailsGroup: FormGroup;
  retrievedOptionId: number;

  routeSubscription: Subscription;

  optionTypes = [ 'CALL', 'PUT' ];
  stocks: Stock[] = [];

  attemptingToCreate: boolean;
  busy = false;

  constructor(
    private alertService: AlertService,
    private currencyPipe: CurrencyPipe,
    private formBuilder: FormBuilder,
    private optionService: OptionService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private stockService: StockService,
  ) { }

  ngOnInit(): void {
    this.optionDetailsGroup = this.formBuilder.group({
      optionType: ['', [Validators.required ]],
      stock: ['', [Validators.required]],
      expirationDate: ['', [Validators.required]],
      strikePrice: ['', [Validators.required ]]
    });

    this.populateStockDropDown();

    this.routeSubscription = this.activatedRoute.url.subscribe((urlSegments) => this.initialize(urlSegments));
  }


  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  onSubmit() {
    // reset any previous alerts
    this.alertService.clear();

    // indicate that we're busy
    this.busy = true;

    // Try to create the new option
    if (this.attemptingToCreate) {
      this.optionService.create(this.optionDetailsGroup.get('optionType').value,
                                this.optionDetailsGroup.get('stock').value, // NOTE: The value in stock is the stock's id
                                this.optionDetailsGroup.get('strikePrice').value,
                                this.optionDetailsGroup.get('expirationDate').value)
        .subscribe(
          success  =>  {
            // If this goes well...
            // Indicate that we're not waiting any more
            this.busy = false;
            // navigate to the page containing a list of all options
            this.router.navigate(['/option']);
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
      this.optionService.update(this.retrievedOptionId,
                                this.optionDetailsGroup.get('optionType').value,
                                this.optionDetailsGroup.get('stock').value, // NOTE: The value in the stock is the stock's id
                                this.optionDetailsGroup.get('strikePrice').value,
                                this.optionDetailsGroup.get('expirationDate').value)
        .subscribe(
          option  =>  {
            // If this goes well...
            // Indicate that we're not waiting any more
            this.busy = false;
            // Display a success message
            this.alertService.success('This option was successfully updated.');
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
  getErrorOptionType(): string {
    return this.optionDetailsGroup.get('optionType').hasError('required') ? 'Please select PUT or CALL' : '';
  }
  getErrorStock(): string {
    return this.optionDetailsGroup.get('stock').hasError('required') ? 'Please select a stock symbol' : '';
  }
  getErrorExpirationDate(): string {
    return this.optionDetailsGroup.get('expirationDate').hasError('required') ? 'Please select the option\'s expiration date' : '';
  }
  getErrorStrikePrice(): string {
    return this.optionDetailsGroup.get('strikePrice').hasError('required') ? 'Please enter the option\'s strike price' : '';
  }

  private populateStockDropDown() {
    this.stockService.retrieveAll()
      .subscribe(
        stocks => this.stocks = stocks,
        error => this.alertService.error(error)
      );
  }

  private initialize(urlSegments: UrlSegment[]) {
    this.attemptingToCreate = urlSegments[1].toString() === 'create';
    // If we're setting up for a create request
    if (this.attemptingToCreate) {
      this.initializeElements('', '', '', '');
    }
    // If we're setting upo for an edit request (i.e., a non-create request)
    else {
      // Retrieve the requested option and save its ID
      const id: number = +(urlSegments[1].toString());
      this.optionService.retrieve(id)
      .subscribe(
        // If this goes well, update the data in the form
        foundOption =>  {
          this.retrievedOptionId = foundOption.id;
          // Set the data in the form to be the data that was returned from the service
          this.initializeElements(foundOption.optionType, foundOption.stock.id, foundOption.expirationDate, foundOption.strikePrice);
        },
        // If the retrieval goes poorly, show the error
        error => this.alertService.error(error)
      );
    }
  }

  private initializeElements(optionType: string, stockId: string | number, expirationDate: string | Date, strikePrice: string | number) {
    // Set the values
    this.optionDetailsGroup.get('optionType').setValue(optionType);
    this.optionDetailsGroup.get('stock').setValue(stockId);
    this.optionDetailsGroup.get('expirationDate').setValue(expirationDate);
    this.optionDetailsGroup.get('strikePrice').setValue(this.currencyPipe.transform(strikePrice));
    // Mark all of the fields as being pristine
    this.optionDetailsGroup.markAsPristine();
    // Mart all of the fields as being untouched
    this.optionDetailsGroup.markAsUntouched();
  }
}
