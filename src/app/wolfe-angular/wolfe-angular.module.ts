import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



const FrequentlyUsedAngularModules = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule
];

@NgModule({
  declarations: [],
  imports: FrequentlyUsedAngularModules,
  exports: FrequentlyUsedAngularModules,
  providers: [
      // Create instances of Angular's DatePipe and CurrencyPipe that the rest of our Modules can use
      DatePipe,
      CurrencyPipe
  ]
})
export class WolfeAngularModule { }
