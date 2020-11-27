import { NgModule } from '@angular/core';
import { TickerTransactionsComponent } from './ticker-transactions/ticker-transactions.component';
import { TickerTransactionDetailsComponent } from './ticker-transaction-details/ticker-transaction-details.component';
import { WolfeCommonModule } from '../wolfe-common/wolfe-common.module';
import { WolfeAngularModule } from '../wolfe-angular/wolfe-angular.module';
import { WolfeMaterialModule } from '../wolfe-material/wolfe-material.module';



@NgModule({
  declarations: [
    TickerTransactionsComponent,
    TickerTransactionDetailsComponent
  ],
  imports: [
    // The Angular Modules that we tend to use
    WolfeAngularModule,
    // The Material Modules that we tend to use
    WolfeMaterialModule,
    // Common Services, Pipes, Directives, and Classes that we've authored
    WolfeCommonModule,
  ],
  providers: [
  ],
  exports: [
    TickerTransactionsComponent,
    TickerTransactionDetailsComponent
  ],
})
export class TickerTransactionModule { }
