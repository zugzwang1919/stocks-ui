import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,  Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { distinctUntilChanged } from 'rxjs/operators';

import { AlertService } from '../../general/alert/alert.service';
import { StockService } from '../stock.service';
import { Stock } from '../stock';
import { BusyService } from 'src/app/general/busy/busy.service';


@Component({
  selector: 'app-stock-details',
  templateUrl: './stock-details.component.html',
  styleUrls: ['./stock-details.component.sass']
})
export class StockDetailsComponent implements OnInit {


  stockDetailsGroup: FormGroup;
  benchmark: FormControl;

  stock: Stock;
  attemptingToCreate: boolean;
  busy = false;

  constructor(
    private alertService: AlertService,
    private busyService: BusyService,
    private stockService: StockService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.attemptingToCreate = this.route.snapshot.url[1].toString() === 'create';
    this.stockDetailsGroup = this.formBuilder.group({
      ticker: [{ value: '', disabled: !this.attemptingToCreate}, [Validators.required ]],
      name: ['', [Validators.required ]]
    });
    this.busy = false;

    // NOTE:  Given the two way binding, all of the controls are set to undefined.
    // NOTE:  Go ahead and set the checkbox to false, the other controls must be touched by the user.
    this.benchmark = new FormControl(false);

    // Set things up so that any ticker will be converted to upper case
    this.stockDetailsGroup.get('ticker').valueChanges
      .pipe(
        distinctUntilChanged()  // NOTE: avoids infinite loop as patchValue below will emit changes
      )
      .subscribe((value: string) => {
        this.stockDetailsGroup.get('ticker').patchValue(value.toUpperCase());
      });

    // If we've received an edit request (i.e., a non-create request)
    if (!this.attemptingToCreate) {
      // Retrieve the requested stock & drop it into our "stock variable"
      const id: number = +(this.route.snapshot.url[1].toString());
      this.stockService.retrieve(id)
      .subscribe(
        // If this goes well, update the list of Stocks
        foundStock =>  {
          this.stock = foundStock;
          // Set the data in the table to be the data that was returned from the service
          this.stockDetailsGroup.get('ticker').setValue(foundStock.ticker);
          this.stockDetailsGroup.get('name').setValue(foundStock.name);
          this.benchmark.setValue(foundStock.benchmark);
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

  private setBusyStatus(requestedSetting: boolean) {
    this.busy = requestedSetting;
    if (requestedSetting) {
      this.busyService.busy(2929);
    }
    else {
      this.busyService.finished(2929);
    }
  }
}
