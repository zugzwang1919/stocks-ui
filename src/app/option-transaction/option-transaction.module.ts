import { NgModule } from '@angular/core';
import { OptionTransactionsComponent } from './option-transactions/option-transactions.component';
import { WolfeCommonModule } from '../wolfe-common/wolfe-common.module';
import { OptionTransactionDetailsComponent } from './option-transaction-details/option-transaction-details.component';
import { WolfeAngularModule } from '../wolfe-angular/wolfe-angular.module';
import { WolfeMaterialModule } from '../wolfe-material/wolfe-material.module';



@NgModule({
  declarations: [
    OptionTransactionsComponent,
    OptionTransactionDetailsComponent
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
    OptionTransactionsComponent
  ]
})
export class OptionTransactionModule { }
