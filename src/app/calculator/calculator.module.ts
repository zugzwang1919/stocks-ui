import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IncomeCalculatorComponent } from './income-calculator/income-calculator.component';
import { MaterialModule } from '../material/material.module';
import { WolfeCommonModule } from '../wolfe-common/wolfe-common.module';




@NgModule({
  declarations: [
    IncomeCalculatorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule,
    WolfeCommonModule
  ],
  exports: [
    IncomeCalculatorComponent
  ],
})
export class CalculatorModule { }
