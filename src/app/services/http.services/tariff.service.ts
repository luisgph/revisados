import { Injectable } from '@angular/core';
import { HttpUtilsService } from '../../commons/http-base.service';
import { Observable } from 'rxjs';
import { ResultModel } from '../../models/resultModel';

@Injectable({
  providedIn: 'root'
})
export class TariffService {
  constructor(
    public http : HttpUtilsService
  ) { }

  public SearchTariffBundles(params : any): Observable<ResultModel> {
    return this.http.post('Bundles/FareSearchWithBundles', params);
  
  }
  public GetFareList(params : any): Observable<ResultModel> {
    return this.http.post('Bundles/GetFareList', params);
  }
}
