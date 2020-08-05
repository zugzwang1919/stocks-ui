import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../material/material.module';

import { TickersComponent } from './tickers/tickers.component';
import { TickerDetailsComponent } from './ticker-details/ticker-details.component';

import { GeneralModule } from '../general/general.module';
import { UserModule } from '../user/user.module';
import { WolfeCommonModule } from '../wolfe-common/wolfe-common.module';



@NgModule({
  declarations: [
    TickersComponent,
    TickerDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    GeneralModule,
    MaterialModule,
    UserModule,
    ReactiveFormsModule,
    RouterModule,
    WolfeCommonModule
  ],
  exports: [
    TickersComponent,
    TickerDetailsComponent
  ]
})
export class TickerModule { }
