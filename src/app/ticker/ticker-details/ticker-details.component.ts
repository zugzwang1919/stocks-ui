import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,  Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AlertService } from '../../general/alert/alert.service';
import { CurrentUserService} from '../../user/current-user/current-user.service';
import { TickerService } from '../ticker.service';


@Component({
  selector: 'app-ticker-details',
  templateUrl: './ticker-details.component.html',
  styleUrls: ['./ticker-details.component.sass']
})
export class TickerDetailsComponent implements OnInit {


  tickerDetailsGroup: FormGroup;
  benchmark = new FormControl(false);
  busy = false;

  constructor(
    private alertService: AlertService,
    private currentUserService: CurrentUserService,
    private tickerService: TickerService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.tickerDetailsGroup = this.formBuilder.group({
      ticker: ['', [Validators.required ]],
      name: ['', [Validators.required ]]
    });
  }

  onSubmit() {
    // reset any previous alerts
    this.alertService.clear();

    // indicate that we're busy
    this.busy = true;
    // Try to create the new security/stock/etf/mutual fund/ticker
    this.tickerService.create(this.tickerDetailsGroup.get('ticker').value,
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

  }

  getErrorTicker(): string {
    return this.tickerDetailsGroup.get('ticker').hasError('required') ? 'You must provide a ticker symbol.' : '';
  }

  getErrorName(): string {
    return this.tickerDetailsGroup.get('name').hasError('required') ? 'You must provide a name.' : '';
  }

}
