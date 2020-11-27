import { NgModule } from '@angular/core';
import { PortfolioDetailsComponent } from './portfolio-details/portfolio-details.component';
import { PortfoliosComponent } from './portfolios/portfolios.component';
import { WolfeCommonModule } from '../wolfe-common/wolfe-common.module';
import { WolfeAngularModule } from '../wolfe-angular/wolfe-angular.module';
import { WolfeMaterialModule } from '../wolfe-material/wolfe-material.module';



@NgModule({
  declarations: [
    PortfolioDetailsComponent,
    PortfoliosComponent
  ],
  imports: [
    // The Angular Modules that we tend to use
    WolfeAngularModule,
    // The Material Modules that we tend to use
    WolfeMaterialModule,
    // Common Services, Pipes, Directives, and Classes that we've authored
    WolfeCommonModule,
  ],
  exports: [
    PortfoliosComponent,
    PortfolioDetailsComponent
  ]

})
export class PortfolioModule { }
