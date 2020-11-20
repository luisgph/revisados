import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { InputMaskModule } from "primeng/inputmask";
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from "primeng/table";
import { TabViewModule } from 'primeng/tabview';

import { NgxLoadingModule, ngxLoadingAnimationTypes } from "ngx-loading";

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalModule, BsDatepickerModule,AccordionModule, CollapseModule, TooltipModule} from 'ngx-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { ToolbarComponent } from './components/shared/toolbar/toolbar.component';
import { LoginComponent } from './components/login/login.component';
import { FormatPipe } from './pipe/format.pipe';
import { TrayectsAndCouponsComponent } from './components/trayects-and-coupons/trayects-and-coupons.component';
import { PassengersComponent } from './components/passengers/passengers.component';
import { CouponsComponent } from './components/coupons/coupons.component';
import { StepsComponent } from './components/steps/steps.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PaginationModule } from "ngx-bootstrap/pagination";
import { MainComponent } from './components/main/main.component';
import { SearchTicketComponent } from './components/search-ticket/search-ticket.component';
import { SearchFlightsComponent } from './components/search-flights/search-flights.component';
import { QuotationComponent } from './components/quotation/quotation.component';
import { NotesComponent } from './components/notes/notes.component';
import { ActionsFloatComponent } from './components/shared/actions-float/actions-float.component';
import { TariffsComponent } from './components/tariffs/tariffs.component';
import { SummaryComponent } from './components/summary/summary.component';
import { AvailableFlightCouponsComponent } from './components/available-flight-coupons/available-flight-coupons.component';
import { FlightsComponent } from './components/flights/flights.component';
import { CouponsConfirmedChangeComponent } from './components/coupons-confirmed-change/coupons-confirmed-change.component';
import { ContactComponent } from './components/contact/contact.component';
import { TsaComponent } from './components/tsa/tsa.component';
import { BonusComponent } from './components/bonus/bonus.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    ToolbarComponent,
    LoginComponent,
    FormatPipe,
    TrayectsAndCouponsComponent,
    PassengersComponent,
    CouponsComponent,
    StepsComponent,
    MainComponent,
    SearchTicketComponent,
    PassengersComponent,
    CouponsComponent,
    SearchFlightsComponent,
    QuotationComponent,
    NotesComponent,
    ActionsFloatComponent,
    TariffsComponent,
    SummaryComponent,
    AvailableFlightCouponsComponent,
    FlightsComponent,
    CouponsConfirmedChangeComponent,
    ContactComponent,
    TsaComponent,
    BonusComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    InputMaskModule,
    TabsModule.forRoot(),
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.none,
      fullScreenBackdrop:true
    }),
    BrowserAnimationsModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    AccordionModule.forRoot(),
    PaginationModule.forRoot(),
    TableModule,
    CollapseModule.forRoot(),
    TooltipModule.forRoot(),
    TabViewModule,
    DropdownModule
  ],
  entryComponents: [
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
