import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MaterialModule } from './material/material.module';
import { WolfeCommonModule } from './wolfe-common/wolfe-common.module';
import { GeneralModule } from './general/general.module';
import { UserModule } from './user/user.module';
import { TickerModule } from './ticker/ticker.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { TickerTransactionModule } from './ticker-transaction/ticker-transaction.module';
import { OptionModule } from './option/option.module';
import { OptionTransactionModule } from './option-transaction/option-transaction.module';
import { CalculatorModule } from './calculator/calculator.module';
import { AdminModule } from './admin/admin.module';





@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    // Angular Modules used at the application level
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule,

    // Feature Modules
    GeneralModule,
    UserModule,
    TickerModule,
    PortfolioModule,
    TickerTransactionModule,
    OptionModule,
    OptionTransactionModule,
    CalculatorModule,
    AdminModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
