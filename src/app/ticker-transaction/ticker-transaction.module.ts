import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { TickerTransactionsComponent } from './ticker-transactions/ticker-transactions.component';
import { TickerTransactionDetailsComponent } from './ticker-transaction-details/ticker-transaction-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { RouterModule } from '@angular/router';
import { WolfeCommonModule } from '../wolfe-common/wolfe-common.module';



@NgModule({
  declarations: [
    TickerTransactionsComponent,
    TickerTransactionDetailsComponent
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
  ],
  exports: [
    TickerTransactionsComponent,
    TickerTransactionDetailsComponent
  ],
})
export class TickerTransactionModule { }
