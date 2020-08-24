import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { RouterModule } from '@angular/router';
import { WolfeCommonModule } from '../wolfe-common/wolfe-common.module';
import { OptionsComponent } from './options/options.component';



@NgModule({
  declarations: [
    OptionsComponent
  ],
  exports: [
    OptionsComponent
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
    CurrencyPipe,
    DatePipe
  ]
})
export class OptionModule { }
