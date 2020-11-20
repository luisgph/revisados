import { Injectable } from '@angular/core';
import { HttpUtilsService } from '../../commons/http-base.service';
import { Observable } from 'rxjs';
import { ResultModel } from '../../models/resultModel';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  constructor(
    public http : HttpUtilsService
   ) { }

  public getIgnoreChanges(params : any): Observable<ResultModel> {
    return this.http.get('Reservations/IgnoreChanges',params);
  }

  public getCloseConversation(params : any): Observable<ResultModel> {
    return this.http.get('ConversationsWithOid/CloseConversation', params);
  }
  
}
