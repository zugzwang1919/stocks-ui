import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../material/material.module';

import { StocksComponent } from './stocks/stocks.component';
import { StockDetailsComponent } from './stock-details/stock-details.component';

import { UserModule } from '../user/user.module';
import { WolfeCommonModule } from '../wolfe-common/wolfe-common.module';



@NgModule({
  declarations: [
    StocksComponent,
    StockDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    UserModule,
    ReactiveFormsModule,
    RouterModule,
    WolfeCommonModule
  ],
  exports: [
    StocksComponent,
    StockDetailsComponent
  ]
})
export class StockModule { }
