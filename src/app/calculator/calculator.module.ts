import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

import { ActivityPipe } from '../wolfe-common/activity.pipe';
import { IncomeCalculatorComponent } from './income-calculator/income-calculator.component';
import { MaterialModule } from '../material/material.module';
import { WolfeCommonModule } from '../wolfe-common/wolfe-common.module';
import { BenchmarkCalculatorComponent } from './benchmark-calculator/benchmark-calculator.component';
import { LifecycleDialogComponent } from './lifecycle-dialog/lifecycle-dialog.component';




@NgModule({
  declarations: [
    IncomeCalculatorComponent,
    BenchmarkCalculatorComponent,
    LifecycleDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule,
    WolfeCommonModule
  ],
  providers: [
    CookieService
  ],
  exports: [
    IncomeCalculatorComponent,
    BenchmarkCalculatorComponent
  ],
})
export class CalculatorModule { }
