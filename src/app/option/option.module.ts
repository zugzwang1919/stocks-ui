import { NgModule } from '@angular/core';
import { WolfeCommonModule } from '../wolfe-common/wolfe-common.module';
import { OptionsComponent } from './options/options.component';
import { OptionDetailsComponent } from './option-details/option-details.component';
import { WolfeAngularModule } from '../wolfe-angular/wolfe-angular.module';
import { WolfeMaterialModule } from '../wolfe-material/wolfe-material.module';



@NgModule({
  declarations: [
    OptionsComponent,
    OptionDetailsComponent
  ],
  exports: [
    OptionsComponent
  ],
  imports: [
    // The Angular Modules that we tend to use
    WolfeAngularModule,
    // The Material Modules that we tend to use
    WolfeMaterialModule,
    // Common Services, Pipes, Directives, and Classes that we've authored
    WolfeCommonModule
  ],
  providers: [
  ]
})
export class OptionModule { }
