import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material/material.module';

import { TickersComponent } from './tickers/tickers.component';
import { WolfeCommonModule } from '../wolfe-common/wolfe-common.module';



@NgModule({
  declarations: [TickersComponent],
  imports: [
    CommonModule,
    MaterialModule,
    WolfeCommonModule
  ],
  exports: [
    TickersComponent
  ]
})
export class TickerModule { }
