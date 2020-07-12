import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from '../material/material.module';
import { CurrentUserComponent } from './current-user/current-user.component';


@NgModule({
  declarations: [
    LoginComponent,
    CurrentUserComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    CurrentUserComponent,
    LoginComponent
  ]
})
export class UserModule { }
