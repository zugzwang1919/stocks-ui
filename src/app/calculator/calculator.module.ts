import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

import { IncomeCalculatorComponent } from './income-calculator/income-calculator.component';
import { WolfeCommonModule } from '../wolfe-common/wolfe-common.module';
import { BenchmarkCalculatorComponent } from './benchmark-calculator/benchmark-calculator.component';
import { LifecycleDialogComponent } from './lifecycle-dialog/lifecycle-dialog.component';
import { BenchmarkGraphComponent } from './benchmark-graph/benchmark-graph.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { WolfeMaterialModule } from '../wolfe-material/wolfe-material.module';
import { WolfeAngularModule } from '../wolfe-angular/wolfe-angular.module';
import { DetailedPriceDialogComponent } from './detailed-price-dialog/detailed-price-dialog.component';




@NgModule({
  declarations: [
    IncomeCalculatorComponent,
    BenchmarkCalculatorComponent,
    LifecycleDialogComponent,
    BenchmarkGraphComponent,
    DetailedPriceDialogComponent
  ],
  imports: [
    // The Angular Modules that we tend to use
    WolfeAngularModule,
    // The Material Modules that we tend to use
    WolfeMaterialModule,
    // Common Services, Pipes, Directives, and Classes that we've authored
    WolfeCommonModule,
    // Third party stuff
    NgxChartsModule
  ],
  providers: [
    // We need to get a CookieService injected for our use
    CookieService
  ],
  exports: [
    IncomeCalculatorComponent,
    BenchmarkCalculatorComponent
  ],
})
export class CalculatorModule { }
