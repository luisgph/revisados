import { Injectable } from '@angular/core';
import { HttpUtilsService } from '../../commons/http-base.service';
import { Observable } from 'rxjs';
import { ResultModel } from '../../models/resultModel';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  constructor(public http : HttpUtilsService) { }
  
  public GetFarePenality(params : any): Observable<ResultModel> {
    return this.http.post('FarePenalitys/GetFarePenality', params);
  }

  public postCalculationsProcess(params : any): Observable<ResultModel> {
    return this.http.post('CalculationsProcess/ProcessFare', params);
  }

}
