import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { MainPageComponent } from './general/main-page/main-page.component';
import { OptionsComponent } from './option//options/options.component';
import { OptionDetailsComponent } from './option/option-details/option-details.component';
import { PortfoliosComponent } from './portfolio/portfolios/portfolios.component';
import { PortfolioDetailsComponent } from './portfolio/portfolio-details/portfolio-details.component';
import { RegisterComponent } from './user/register/register.component';
import { TickersComponent } from './ticker/tickers/tickers.component';
import { TickerDetailsComponent } from './ticker/ticker-details/ticker-details.component';
import { TickerTransactionDetailsComponent } from './ticker-transaction/ticker-transaction-details/ticker-transaction-details.component';
import { TickerTransactionsComponent } from './ticker-transaction/ticker-transactions/ticker-transactions.component';
import { ToDoComponent} from './general/to-do/to-do.component';
import { LoggedInGuard } from './wolfe-common/logged-in.guard';


const routes: Routes = [
  { path: 'about/todo', component: ToDoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'user/register', component: RegisterComponent },
  { path: 'welcome', component: MainPageComponent},
  { path: 'option', component: OptionsComponent, canActivate: [LoggedInGuard]},
  { path: 'option/create', component: OptionDetailsComponent, canActivate: [LoggedInGuard]},
  { path: 'option/:id', component: OptionDetailsComponent, canActivate: [LoggedInGuard]},
  { path: 'portfolio', component: PortfoliosComponent, canActivate: [LoggedInGuard]},
  { path: 'portfolio/:id', component: PortfolioDetailsComponent, canActivate: [LoggedInGuard]},
  { path: 'ticker', component: TickersComponent, canActivate: [LoggedInGuard]},
  { path: 'ticker/create', component: TickerDetailsComponent, canActivate: [LoggedInGuard]},
  { path: 'ticker/:id', component: TickerDetailsComponent, canActivate: [LoggedInGuard]},
  { path: 'ticker-transaction', component: TickerTransactionsComponent, canActivate: [LoggedInGuard]},
  { path: 'ticker-transaction/create', component: TickerTransactionDetailsComponent, canActivate: [LoggedInGuard]},
  { path: 'ticker-transaction/:id', component: TickerTransactionDetailsComponent, canActivate: [LoggedInGuard]},
  { path: '',   redirectTo: '/welcome', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
