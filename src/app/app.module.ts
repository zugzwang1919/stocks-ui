import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MaterialModule } from './material/material.module';
import { CommonModule } from './common/common.module';
import { GeneralModule } from './general/general.module';
import { UserModule } from './user/user.module';
import { TickerModule } from './ticker/ticker.module';




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
    CommonModule,
    GeneralModule,
    UserModule,
    TickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
