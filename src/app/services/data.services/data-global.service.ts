import { Injectable } from '@angular/core';
import { Passenger } from '../../models/passenger';

@Injectable({
  providedIn: 'root'
})
export class DataGlobalService  {

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
  public disabledSegment: boolean = true;
  public disabledSegmentCheckBox: boolean = true;
  public dateFlightAvailability: any;
  public isSplitReserve: boolean;
  public flightOption: any;
  public getClassCoupon:boolean=false;
  public journey:any;
  public fareBundles : any;
  public isRebooking : boolean = false;
  public isServiceFee : boolean = true;
  public isHistory :boolean = false;
  public existHistorical : boolean = false;
  public userNotes:any = [];
  public loading : boolean = false;
  public isUniqueOption :boolean = false;
  public countryTicket : string;
  public passenger:Passenger[] = [];
  public iata:any;
  public passengerNewReservation:any[]=[];
  public dataNewQuote:any = null;
  public passengersInformation:any;
  public isBonus:boolean = false;
  public dataBonus : any = null;
  public stepBonus : boolean = false;
  public passengersBonusInfo : any[] = [];
  public disabledBundles:boolean = false;

  constructor() { }
}
