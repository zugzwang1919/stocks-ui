import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup,  Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AlertService } from '../../general/alert/alert.service';
import { OptionService } from '../option.service';
import { Stock } from '../../stock/stock';
import { StockService } from 'src/app/stock/stock.service';

@Component({
  selector: 'app-option-details',
  templateUrl: './option-details.component.html',
  styleUrls: ['./option-details.component.sass']
})
export class OptionDetailsComponent implements OnInit {

  optionDetailsGroup: FormGroup;

  retrievedOptionId: number;
  attemptingToCreate: boolean;
  busy: boolean;

  optionTypes = [ 'CALL', 'PUT' ];
  stocks: Stock[] = [];

  constructor(
    private alertService: AlertService,
    private currencyPipe: CurrencyPipe,
    private formBuilder: FormBuilder,
    private optionService: OptionService,
    private route: ActivatedRoute,
    private router: Router,
    private stockService: StockService,
  ) { }

  ngOnInit(): void {
    this.attemptingToCreate = this.route.snapshot.url[1].toString() === 'create';
    this.optionDetailsGroup = this.formBuilder.group({
      optionType: ['', [Validators.required ]],
      stock: ['', [Validators.required]],
      expirationDate: ['', [Validators.required]],
      strikePrice: ['', [Validators.required ]]
    });
    this.busy = false;
    this.populateStockDropDown();

    // If we've received an edit request (i.e., a non-create request)
    if (!this.attemptingToCreate) {
      // Retrieve the requested option and save its ID
      const id: number = +(this.route.snapshot.url[1].toString());
      this.optionService.retrieve(id)
      .subscribe(
        // If this goes well, update the data in the form
        foundOption =>  {
          this.retrievedOptionId = foundOption.id;
          // Set the data in the form to be the data that was returned from the service
          this.optionDetailsGroup.get('optionType').setValue(foundOption.optionType);
          this.optionDetailsGroup.get('stock').setValue(foundOption.stock.id);
          this.optionDetailsGroup.get('expirationDate').setValue(foundOption.expirationDate);
          this.optionDetailsGroup.get('strikePrice').setValue(this.currencyPipe.transform(foundOption.strikePrice));
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
  private populateStockDropDown() {
    this.stockService.retrieveAll()
      .subscribe(
        stocks => this.stocks = stocks,
        error => this.alertService.error(error)
      );
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

}
