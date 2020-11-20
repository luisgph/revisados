import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CouponsComponent } from './components/coupons/coupons.component';
import { StepsComponent } from './components/steps/steps.component';
import { SearchTicketComponent } from './components/search-ticket/search-ticket.component';
import { SearchFlightsComponent } from './components/search-flights/search-flights.component';
import { MainComponent } from './components/main/main.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'steps', component: StepsComponent},
  { path: 'main', component: MainComponent, canActivate:[ AuthGuard ]},
  { path: 'search-ticket', component: SearchTicketComponent , canActivate:[ AuthGuard ]},
  { path: 'searchFlights', component: SearchFlightsComponent },
  { path: 'coupons', component: CouponsComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
