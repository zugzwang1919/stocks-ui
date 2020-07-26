import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material/material.module';

import { TickersComponent } from './tickers/tickers.component';



@NgModule({
  declarations: [TickersComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    TickersComponent
  ]
})
export class TickerModule { }
