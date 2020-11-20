import { Injectable } from '@angular/core';
import { HttpUtilsService } from '../commons/http-base.service';
import { Observable } from 'rxjs';
import { ResultModel } from '../models/resultModel';

@Injectable({
  providedIn: 'root'
})
export class FaresService {

  constructor(public http : HttpUtilsService) { }

  public postHistoryFareBySegment(params : any): Observable<ResultModel> {
    return this.http.post('Fares/HistoryFareBySegment', params);
  }

  public postFareCalculate(params : any): Observable<ResultModel> {
    return this.http.post('Fares/FareCalculate', params);
  }

  public postFareSearchForSegments(params : any): Observable<ResultModel> {
    return this.http.post('Fares/FareSearchForSegments', params);
  }

  public postFareCalculateRebooking(params : any): Observable<ResultModel> {
    return this.http.post('Fares/FareCalculateRebooking', params);
  }

  public fareSearch(params : any): Observable<ResultModel> {
    return this.http.post('Fares/FareSearch', params);
  }
}
