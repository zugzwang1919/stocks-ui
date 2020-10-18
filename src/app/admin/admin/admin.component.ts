import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/general/alert/alert.service';
import { BusyService } from 'src/app/general/busy/busy.service';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.sass']
})
export class AdminComponent implements OnInit {


  adminGroup: FormGroup;
  busy = false;

  constructor(
    private adminService: AdminService,
    private alertService: AlertService,
    private busyService: BusyService,
    private formBuilder: FormBuilder
    ) { }

  ngOnInit(): void {
    this.adminGroup = this.formBuilder.group({
      requestedAction: ['1', [Validators.required ]]
    });
  }


  onSubmit() {
    // reset any previous alerts
    this.alertService.clear();

    // Indicate that we're busy
    this.setBusyStatus(true);
    // Call the admin service
    switch (this.adminGroup.get('requestedAction').value) {
      case '1': {
        this.adminService.updateAllStockPrices()
          .subscribe(
            result  =>  this.handleSuccessfulResponse(result),
            error => this.handleErrorResponse(error)
          );
        break;
      }
      case '2': {
        this.adminService.updateAllDividends()
          .subscribe(
            result  =>  this.handleSuccessfulResponse(result),
            error => this.handleErrorResponse(error)
          );
        break;
      }
      case '3': {
        this.adminService.updateAllStockSplits()
          .subscribe(
            result  =>  this.handleSuccessfulResponse(result),
            error => this.handleErrorResponse(error)
          );
        break;
      }
      default: {
        // We've got issues if we get here, but at a minimum indicate that we're not busy any more.
        this.setBusyStatus(false);
      }
    }
  }



  private handleSuccessfulResponse(result: any) {
    // Indicate that we're no longer busy
    this.setBusyStatus(false);
    // Show the "success" message
    this.alertService.success(result.summary);

  }

  private handleErrorResponse(error: any) {
    // Indicate that we're no longer busy
    this.setBusyStatus(false);
    // Show the error
    this.alertService.error(error);
  }

  private setBusyStatus(requestedSetting: boolean) {
    this.busy = requestedSetting;
    if (requestedSetting) {
      this.busyService.busy(175);
    }
    else {
      this.busyService.finished(175);
    }
  }
}
