import { NgModule } from '@angular/core';

import { UserModule } from '../user/user.module';

import { BottomOfPageComponent } from './bottom-of-page/bottom-of-page.component';
import { MainPageComponent } from './main-page/main-page.component';
import { TopOfPageComponent } from './top-of-page/top-of-page.component';
import { AlertComponent } from './alert/alert.component';
import { MenuComponent } from './menu/menu.component';
import { ToDoComponent } from './to-do/to-do.component';
import { BusyComponent } from './busy/busy.component';
import { AboutComponent } from './about/about.component';
import { RecentlyCompletedComponent } from './recently-completed/recently-completed.component';
import { WolfeAngularModule } from '../wolfe-angular/wolfe-angular.module';
import { WolfeMaterialModule } from '../wolfe-material/wolfe-material.module';




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
    AboutComponent,
    RecentlyCompletedComponent
  ],
  imports: [
    // The Angular Modules that we tend to use
    WolfeAngularModule,
    // The Material Modules that we tend to use
    WolfeMaterialModule,
    // Our Feature Modules used by this module
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
