import { Injectable } from '@angular/core';
import { HttpUtilsService } from '../commons/http-base.service';
import { Observable } from 'rxjs';
import { ResultModel } from '../models/resultModel';

@Injectable({
  providedIn: 'root'
})
export class ReportingService {

  constructor(public http : HttpUtilsService) { }
  
  public geStatesTicket(): Observable<ResultModel> {
    return this.http.get('Reporting/GetStatesTicket');
  }
  public saveInitSearchTicket(params : any): Observable<ResultModel>{
      return this.http.post('Reporting/SaveSearchInformation', params);
  }

  public updateStateTicket(params : any): Observable<ResultModel>{
    return this.http.put('Reporting/UpdateTicketStated', params);
  }

  public insertResultTicketAndRervation(params : any ) : Observable<ResultModel>{
    return this.http.post('Reporting/InsertResultTicket',params);
  }

  public insertPassengersSelect(params : any ) : Observable<ResultModel>{
    return this.http.post('Reporting/InsertPassengersSelect',params);
  }
  
  public updateState(params : any): Observable<ResultModel>{
    return this.http.put('Reporting/UpdateStates', params);
  }

  public ValidationTypeRouts(params : any): Observable<ResultModel>{
    return this.http.post('Reporting/ValidateRoutesType', params);
  }

}
