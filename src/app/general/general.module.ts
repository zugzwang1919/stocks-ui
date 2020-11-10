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
import { BusyComponent } from './busy/busy.component';
import { AboutComponent } from './about/about.component';




@NgModule({
  declarations: [
    AboutComponent,
    AlertComponent,
    BottomOfPageComponent,
    MainPageComponent,
    TopOfPageComponent,
    MenuComponent,
    ToDoComponent,
    BusyComponent,
    AboutComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    UserModule
  ],
  exports: [
    AboutComponent,
    AlertComponent,
    BottomOfPageComponent,
    MainPageComponent,
    ToDoComponent,
    TopOfPageComponent,
    BusyComponent
  ]
})
export class GeneralModule { }
