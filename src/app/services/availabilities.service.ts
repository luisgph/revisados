import { Injectable } from '@angular/core';
import { HttpUtilsService } from '../commons/http-base.service';
import { Observable } from 'rxjs';
import { ResultModel } from '../models/resultModel';

@Injectable({
  providedIn: 'root'
})
export class AvailabilitiesService {

  constructor(public http : HttpUtilsService) { }

  public postCancelAvailabilityWithoutConfirm(params : any): Observable<ResultModel> {
    return this.http.post('Availabilities/CancelAvailabilityWithoutConfirm', params);
  }

  public postChangeClassForAvailability(params : any): Observable<ResultModel> {
    return this.http.post('Availabilities/ChangeClassForAvailability', params);
  }

  public postConfirmAvailability(params : any): Observable<ResultModel> {
    return this.http.post('Availabilities/ConfirmAvailability', params);
  }

  public postTakeAvailability(params : any): Observable<ResultModel> {
    return this.http.post('Availabilities/TakeAvailability', params);
  }

  public postCancelConfirmAvailability(params : any): Observable<ResultModel> {
    return this.http.post('Availabilities/CancelConfirmAvailability', params);
  }

  public postTakeAvailabilityForBundleSearch(params : any): Observable<ResultModel> {
    return this.http.post('Availabilities/TakeAvailabilityForBundleSearch', params);
  }
}
