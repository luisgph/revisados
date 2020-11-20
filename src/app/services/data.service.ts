import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public serviceArrayFlightAvailable: any[] = [];
  public disabledSegment: boolean;
  public disabledFlight: boolean;
  public disabledSelectPassenger: boolean;
  public optionView :boolean;
  public fareHistoryCacheId :string;

  public ticketNumber :string;
  public name:string;
  public flightAlone:boolean =false;
  public formDisabled:boolean=false;
  public formDisabledButtonFind:boolean=false;
  public cleanView:boolean=false;

  public flightOption: any;
  public dateFlightAvailability: any;
  public countPassenger: number = 0;
  public cssClassFade:string;
  public isSplitReserve: boolean = false; 

 


  constructor() { }
}

