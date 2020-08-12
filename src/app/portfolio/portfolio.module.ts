import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PortfolioDetailsComponent } from './portfolio-details/portfolio-details.component';
import { PortfoliosComponent } from './portfolios/portfolios.component';
import { MaterialModule } from '../material/material.module';
import { RouterModule } from '@angular/router';
import { WolfeCommonModule } from '../wolfe-common/wolfe-common.module';



@NgModule({
  declarations: [
    PortfolioDetailsComponent,
    PortfoliosComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule,
    WolfeCommonModule
  ],
  exports: [
    PortfoliosComponent,
    PortfolioDetailsComponent
  ]

})
export class PortfolioModule { }
