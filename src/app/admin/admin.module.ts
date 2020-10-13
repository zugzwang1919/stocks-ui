import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AdminComponent } from './admin/admin.component';
import { MaterialModule } from '../material/material.module';
import { WolfeCommonModule } from '../wolfe-common/wolfe-common.module';



@NgModule({
  declarations: [AdminComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule,
    WolfeCommonModule
  ],
  exports: [
    AdminComponent
  ]
})
export class AdminModule { }
