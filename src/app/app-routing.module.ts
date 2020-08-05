import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { MainPageComponent } from './general/main-page/main-page.component';
import { RegisterComponent } from './user/register/register.component';
import { TickersComponent } from './ticker/tickers/tickers.component';
import { TickerDetailsComponent } from './ticker/ticker-details/ticker-details.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'user/register', component: RegisterComponent },
  { path: 'welcome', component: MainPageComponent},
  { path: 'ticker', component: TickersComponent},
  { path: 'ticker/create', component: TickerDetailsComponent},
  { path: '',   redirectTo: '/welcome', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
