import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { OptionTransactionsComponent } from './option-transactions/option-transactions.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WolfeCommonModule } from '../wolfe-common/wolfe-common.module';
import { ActivityPipe } from './activity.pipe';



@NgModule({
  declarations: [OptionTransactionsComponent, ActivityPipe],
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
    OptionTransactionsComponent
  ]
})
export class OptionTransactionModule { }
