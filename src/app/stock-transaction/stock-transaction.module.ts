import { NgModule } from '@angular/core';
import { StockTransactionsComponent } from './stock-transactions/stock-transactions.component';
import { StockTransactionDetailsComponent } from './stock-transaction-details/stock-transaction-details.component';
import { WolfeCommonModule } from '../wolfe-common/wolfe-common.module';
import { WolfeAngularModule } from '../wolfe-angular/wolfe-angular.module';
import { WolfeMaterialModule } from '../wolfe-material/wolfe-material.module';



@NgModule({
  declarations: [
    StockTransactionsComponent,
    StockTransactionDetailsComponent
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
    StockTransactionsComponent,
    StockTransactionDetailsComponent
  ],
})
export class StockTransactionModule { }
