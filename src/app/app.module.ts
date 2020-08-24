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






@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    RouterModule,
    MaterialModule,
    WolfeCommonModule,
    GeneralModule,
    UserModule,
    TickerModule,
    PortfolioModule,
    TickerTransactionModule,
    OptionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
