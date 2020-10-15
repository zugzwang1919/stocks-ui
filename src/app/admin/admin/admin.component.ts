import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/general/alert/alert.service';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.sass']
})
export class AdminComponent implements OnInit {


  adminGroup: FormGroup;
  futureUrl: string;
  hidePassword = true;


  constructor(
    private adminService: AdminService,
    private alertService: AlertService,
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

    // Call the admin service
    switch (this.adminGroup.get('requestedAction').value) {
      case '1': {
        this.adminService.updateAllStockPrices()
          .subscribe(
            result  =>  this.alertService.success(result.summary),
            error => this.alertService.error(error)
          );
        break;
      }
      case '2': {
        this.adminService.updateAllDividends()
          .subscribe(
            result  =>  this.alertService.success(result.summary),
            error => this.alertService.error(error)
          );
        break;
      }
      case '3': {
        this.adminService.updateAllStockSplits()
          .subscribe(
            result  =>  this.alertService.success(result.summary),
            error => this.alertService.error(error)
          );
        break;
      }
    }
  }
}
