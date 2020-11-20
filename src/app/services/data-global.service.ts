import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataGlobalService {

  public ticketNumber :string;
  public flightAlone: boolean =false;
  public userName: string;
  public data: any;
  public callName: string;
  public formDisabledButtonFind: boolean=false;
  public linePassengerSelect: string = '';
  public countPassenger: number = 0;
  public isTotalPassenger: boolean = false;
  public serviceArrayFlightAvailable: any[] = [];


  constructor() { }
}
