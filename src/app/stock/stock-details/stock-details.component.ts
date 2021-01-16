import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,  Validators } from '@angular/forms';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { distinctUntilChanged } from 'rxjs/operators';

import { AlertService } from '../../general/alert/alert.service';
import { StockService } from '../stock.service';
import { Stock } from '../stock';
import { BusyService } from 'src/app/general/busy/busy.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-stock-details',
  templateUrl: './stock-details.component.html',
  styleUrls: ['./stock-details.component.sass']
})
export class StockDetailsComponent implements OnInit, OnDestroy {


  stockDetailsGroup: FormGroup;
  benchmark: FormControl;
  stock: Stock;
  attemptingToCreate: boolean;
  routeSubscription: Subscription;
  busy = false;

  constructor(
    private alertService: AlertService,
    private busyService: BusyService,
    private stockService: StockService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit(): void {

    this.stockDetailsGroup = this.formBuilder.group({
      ticker: ['', [Validators.required ]],
      name: ['', [Validators.required ]]
    });

    // Set things up so that any ticker will be converted to upper case
    this.stockDetailsGroup.get('ticker').valueChanges
      .pipe(
        distinctUntilChanged()  // NOTE: avoids infinite loop as patchValue below will emit changes
      )
      .subscribe((value: string) => {
        this.stockDetailsGroup.get('ticker').patchValue(value.toUpperCase());
      });

    // NOTE:  Given the two way binding, all of the controls are set to undefined.
    // NOTE:  Go ahead and set the checkbox to false, the other controls must be touched by the user.
    this.benchmark = new FormControl(false);

    this.routeSubscription = this.activatedRoute.url.subscribe((urlSegments) => this.initialize(urlSegments));
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }



  onSubmit() {
    // reset any previous alerts
    this.alertService.clear();

    // indicate that we're busy
    this.setBusyStatus(true);

    // Try to create the new security/stock/etf/mutual fund
    if (this.attemptingToCreate) {
      this.stockService.create( this.stockDetailsGroup.get('ticker').value,
                                  this.stockDetailsGroup.get('name').value,
                                  this.benchmark.value)

        .subscribe(
          success  =>  {
            // If this goes well...
            // Indicate that we're not waiting any more
            this.setBusyStatus(false);
            // navigate to the appropriate page
            this.router.navigate(['/stock']);
          },
          error => {
            // If this goes poorly...
            // Indicate that we're not waiting any more
            this.setBusyStatus(false);
            // Display the error
            this.alertService.error(error);
          }
        );
    } else {
      this.stockService.update(  this.stock.id,
                                  this.stockDetailsGroup.get('name').value,
                                  this.benchmark.value)

        .subscribe(
          stock  =>  {
            // If this goes well...
            // Indicate that we're not waiting any more
            this.setBusyStatus(false);
            // Update our version of the stock with whatever the server returned
            this.stock = stock;
            // Display a success message
            this.alertService.success(stock.ticker + ' was successfully updated.');
          },
          error => {
            // If this goes poorly...
            // Indicate that we're not waiting any more
            this.setBusyStatus(false);
            // Display the error
            this.alertService.error(error);
          }
        );
     }

  }

  getErrorTicker(): string {
    return this.stockDetailsGroup.get('ticker').hasError('required') ? 'You must provide a ticker symbol.' : '';
  }

  getErrorName(): string {
    return this.stockDetailsGroup.get('name').hasError('required') ? 'You must provide a name.' : '';
  }

  private initialize(urlSegments: UrlSegment[]) {
    this.attemptingToCreate = urlSegments[1].toString() === 'create';
    // If we've received an edit request (i.e., a non-create request)
    if (!this.attemptingToCreate) {
      // Retrieve the requested stock & drop it into our "stock variable"
      const id: number = +(urlSegments[1].toString());
      this.stockService.retrieve(id)
      .subscribe(
        // If this goes well, update the list of Stocks
        foundStock =>  {
          this.stock = foundStock;
          // Set the data in the form to be the data that was returned from the service
          this.initializeValues(foundStock.ticker, foundStock.name, foundStock.benchmark);
          // Do not allow the user to change the ticker
          this.stockDetailsGroup.get('ticker').disable();
        },
        // If the retrieval goes poorly, show the error
        error => this.alertService.error(error)
      );
    }
    // For a create request
    else {
      this.initializeValues('', '', false);
      this.stockDetailsGroup.get('ticker').enable();
    }
  }

  private setBusyStatus(requestedSetting: boolean) {
    this.busy = requestedSetting;
    if (requestedSetting) {
      this.busyService.busy(2929);
    }
    else {
      this.busyService.finished(2929);
    }
  }

  private initializeValues(ticker: string, name: string, isBenchmark: boolean) {
    // Set the values on the page
    this.stockDetailsGroup.get('ticker').setValue(ticker);
    this.stockDetailsGroup.get('name').setValue(name);
    this.benchmark.setValue(isBenchmark);
    // Mark all elements on the page as being pristine
    this.stockDetailsGroup.markAsPristine();
    this.benchmark.markAsPristine();
    // Mark all elements as being untouched so that validation won't occur when the page is initially displayed
    this.stockDetailsGroup.markAsUntouched();
    this.benchmark.markAsUntouched();
  }

}
