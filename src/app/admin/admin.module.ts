import { NgModule } from '@angular/core';

import { AdminComponent } from './admin/admin.component';
import { WolfeCommonModule } from '../wolfe-common/wolfe-common.module';
import { WolfeMaterialModule } from '../wolfe-material/wolfe-material.module';
import { WolfeAngularModule } from '../wolfe-angular/wolfe-angular.module';



@NgModule({
  declarations: [AdminComponent],
  imports: [
    // The Angular Modules that we tend to use
    WolfeAngularModule,
    // The Material Modules that we tend to use
    WolfeMaterialModule,
    // Common Services, Pipes, Directives, and Classes that we've authored
    WolfeCommonModule
  ],
  exports: [
    AdminComponent
  ]
})
export class AdminModule { }
