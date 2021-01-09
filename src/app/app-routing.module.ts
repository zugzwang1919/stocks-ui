import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { MainPageComponent } from './general/main-page/main-page.component';
import { OptionsComponent } from './option//options/options.component';
import { OptionDetailsComponent } from './option/option-details/option-details.component';
import { OptionTransactionsComponent } from './option-transaction/option-transactions/option-transactions.component';
import { OptionTransactionDetailsComponent } from './option-transaction/option-transaction-details/option-transaction-details.component';
import { PortfoliosComponent } from './portfolio/portfolios/portfolios.component';
import { PortfolioDetailsComponent } from './portfolio/portfolio-details/portfolio-details.component';
import { RegisterComponent } from './user/register/register.component';
import { StocksComponent } from './stock/stocks/stocks.component';
import { StockDetailsComponent } from './stock/stock-details/stock-details.component';
import { StockTransactionDetailsComponent } from './stock-transaction/stock-transaction-details/stock-transaction-details.component';
import { StockTransactionsComponent } from './stock-transaction/stock-transactions/stock-transactions.component';
import { ToDoComponent} from './general/to-do/to-do.component';
import { LoggedInGuard } from './wolfe-common/logged-in.guard';
import { BenchmarkCalculatorComponent } from './calculator/benchmark-calculator/benchmark-calculator.component';
import { IncomeCalculatorComponent } from './calculator/income-calculator/income-calculator.component';
import { AdminComponent } from './admin/admin/admin.component';
import { AboutComponent } from './general/about/about.component';
import { RecentlyCompletedComponent } from './general/recently-completed/recently-completed.component';


const routes: Routes = [
  { path: 'admin', component: AdminComponent },
  { path: 'about/todo', component: ToDoComponent },
  { path: 'about/about', component: AboutComponent },
  { path: 'about/recent', component: RecentlyCompletedComponent },
  { path: 'login', component: LoginComponent },
  { path: 'user/register', component: RegisterComponent },
  { path: 'welcome', component: MainPageComponent},
  { path: 'benchmark-calculator', component: BenchmarkCalculatorComponent, canActivate: [LoggedInGuard]},
  { path: 'income-calculator', component: IncomeCalculatorComponent, canActivate: [LoggedInGuard]},
  { path: 'option', component: OptionsComponent, canActivate: [LoggedInGuard]},
  { path: 'option/create', component: OptionDetailsComponent, canActivate: [LoggedInGuard]},
  { path: 'option/:id', component: OptionDetailsComponent, canActivate: [LoggedInGuard]},
  { path: 'option-transaction', component: OptionTransactionsComponent, canActivate: [LoggedInGuard]},
  { path: 'option-transaction/create', component: OptionTransactionDetailsComponent, canActivate: [LoggedInGuard]},
  { path: 'option-transaction/:id', component: OptionTransactionDetailsComponent, canActivate: [LoggedInGuard]},
  { path: 'portfolio', component: PortfoliosComponent, canActivate: [LoggedInGuard], pathMatch: 'full'},
  { path: 'portfolio/:id', component: PortfolioDetailsComponent, canActivate: [LoggedInGuard]},
  { path: 'stock', component: StocksComponent, canActivate: [LoggedInGuard], pathMatch: 'full'},
  { path: 'stock/:id', component: StockDetailsComponent, canActivate: [LoggedInGuard]},
  { path: 'stock-transaction', component: StockTransactionsComponent, canActivate: [LoggedInGuard]},
  { path: 'stock-transaction/create', component: StockTransactionDetailsComponent, canActivate: [LoggedInGuard]},
  { path: 'stock-transaction/:id', component: StockTransactionDetailsComponent, canActivate: [LoggedInGuard]},
  { path: '',   redirectTo: '/welcome', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
