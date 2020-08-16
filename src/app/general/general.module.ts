import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../material/material.module';
import { UserModule } from '../user/user.module';

import { BottomOfPageComponent } from './bottom-of-page/bottom-of-page.component';
import { MainPageComponent } from './main-page/main-page.component';
import { TopOfPageComponent } from './top-of-page/top-of-page.component';
import { AlertComponent } from './alert/alert.component';
import { MenuComponent } from './menu/menu.component';
import { ToDoComponent } from './to-do/to-do.component';




@NgModule({
  declarations: [
    AlertComponent,
    BottomOfPageComponent,
    MainPageComponent,
    TopOfPageComponent,
    MenuComponent,
    ToDoComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    UserModule
  ],
  exports: [
    AlertComponent,
    BottomOfPageComponent,
    MainPageComponent,
    ToDoComponent,
    TopOfPageComponent
  ]
})
export class GeneralModule { }
