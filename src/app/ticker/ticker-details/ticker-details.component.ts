import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,  Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AlertService } from '../../general/alert/alert.service';
import { CurrentUserService} from '../../user/current-user/current-user.service';
import { TickerService } from '../ticker.service';
import { Ticker } from '../ticker';


@Component({
  selector: 'app-ticker-details',
  templateUrl: './ticker-details.component.html',
  styleUrls: ['./ticker-details.component.sass']
})
export class TickerDetailsComponent implements OnInit {


  tickerDetailsGroup: FormGroup;
  benchmark: FormControl;

  ticker: Ticker;
  attemptingToCreate: boolean;
  busy: boolean;

  constructor(
    private alertService: AlertService,
    private currentUserService: CurrentUserService,
    private tickerService: TickerService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.attemptingToCreate = this.route.snapshot.url[1].toString() === 'create';
    this.tickerDetailsGroup = this.formBuilder.group({
      ticker: [{ value: '', disabled: !this.attemptingToCreate}, [Validators.required ]],
      name: ['', [Validators.required ]]
    });
    this.busy = false;

    // NOTE:  Given the two way binding, all of the controls are set to undefined.
    // NOTE:  Go ahead and set the checkbox to false, the other controls must be touched by the user.
    this.benchmark = new FormControl(false);

    // If we've received an edit request (i.e., a non-create request)
    if (!this.attemptingToCreate) {
      // Retrieve the requested ticker & drop it into our "ticker variable"
      const id: number = +(this.route.snapshot.url[1].toString());
      this.tickerService.retrieve(id)
      .subscribe(
        // If this goes well, update the list of Tickers
        foundTicker =>  {
          this.ticker = foundTicker;
          // Set the data in the table to be the data that was returned from the service
          this.tickerDetailsGroup.get('ticker').setValue(foundTicker.ticker);
          this.tickerDetailsGroup.get('name').setValue(foundTicker.name);
          this.benchmark.setValue(foundTicker.benchmark);
        },
        // If the registration goes poorly, show the error
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
      this.tickerService.create( this.tickerDetailsGroup.get('ticker').value,
                                  this.tickerDetailsGroup.get('name').value,
                                  this.benchmark.value)

        .subscribe(
          success  =>  {
            // If this goes well...
            // Indicate that we're not waiting any more
            this.busy = false;
            // navigate to the appropriate page
            this.router.navigate(['/ticker']);
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
      this.tickerService.update(  this.ticker.id,
                                  this.tickerDetailsGroup.get('name').value,
                                  this.benchmark.value)

        .subscribe(
          ticker  =>  {
            // If this goes well...
            // Indicate that we're not waiting any more
            this.busy = false;
            // Update our version of the ticker with whatever the server returned
            this.ticker = ticker;
            // Display a success message
            this.alertService.success(ticker.ticker + ' was successfully updated.');
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

  getErrorTicker(): string {
    return this.tickerDetailsGroup.get('ticker').hasError('required') ? 'You must provide a ticker symbol.' : '';
  }

  getErrorName(): string {
    return this.tickerDetailsGroup.get('name').hasError('required') ? 'You must provide a name.' : '';
  }

}
