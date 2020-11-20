import { Injectable } from '@angular/core';
import { HttpUtilsService } from '../commons/http-base.service';
import { Observable } from 'rxjs';
import { ResultModel } from '../models/resultModel';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(public http : HttpUtilsService) { }

  public getToken(): Observable<ResultModel> {
         return this.http.post('Auth');
       }
}
