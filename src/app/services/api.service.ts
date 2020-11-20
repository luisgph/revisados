import { Injectable } from '@angular/core';
import { HttpUtilsService } from '../commons/http-base.service';
import { Observable } from 'rxjs';
import { ResultModel } from '../models/resultModel';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(public http : HttpUtilsService,public httpIP: HttpClient) {}

      public getSite(): Observable<ResultModel> {
        return this.http.get('Sites');
      }

      public postLogin(params : any): Observable<ResultModel> {
        return this.http.post('Login', params);
      }

      public getTicket(params: any): Observable<ResultModel> {
        return this.http.get('Tickets', params);
      }

      public getChatID(params : any): Observable<ResultModel> {
        return this.http.get('ConversationsWithOid/OpenConversation', params);
      }

      public getIata(): Observable<ResultModel> {
        return this.http.get('Availabilities/GetDestinationsFlights');
      }

      public postCancelSegments(params : any): Observable<ResultModel> {
        return this.http.post('PnrElementsManagement/CancelSegmentsInConversation',params);
      }

      public removeSegmentsByLine(params : any): Observable<ResultModel> {
        return this.http.post('PnrElementsManagement/RemoveSegmentsByLine',params);
      }

      public postFlights(params: any): Observable<ResultModel> {
        return this.http.post('Availabilities/SearchAvailabilitty',params);
      }

      public getIgnoreChanges(params : any): Observable<ResultModel> {
        return this.http.get('Reservations/IgnoreChanges',params);
      }

      public getCloseConversation(params : any): Observable<ResultModel> {
        return this.http.get('ConversationsWithOid/CloseConversation', params);
      }

      public postRequestQuota(params : any): Observable<ResultModel> {
        return this.http.post('Availabilities/TakeAvailabilityForBundleSearch', params);
      }

      public postDeleteQuotaSelected(params : any): Observable<ResultModel> {
        return this.http.post('PnrElementsManagement/RemoveSegmentsSelected', params);
      }

      public postSplitReserve(params : any): Observable<ResultModel> {
        return this.http.post('Reservations/SplitReservationInConv', params);
      }

      public ipServices(){
        return this.httpIP.get('https://api.ipify.org?format=json');
      }

      public postFareAdultPenality(params : any): Observable<ResultModel> {
        return this.http.post('FarePenalitys/FareAdultPenality', params);
      }

      public getReservationsGetRetrievePNR(params : any): Observable<ResultModel> {
        return this.http.get('Reservations/GetRetrievePNR', params);
      }

      public documentReservation(params : any): Observable<ResultModel>{
        return this.http.post('PnrElementsManagement/DocumentReservation', params);
      }

      public saveChangesReservation(params : any): Observable<ResultModel>{
        return this.http.post('Reservations/SaveChangesReservation', params);
      }

      public generateTST(params : any): Observable<ResultModel>{
        return this.http.post('TstProcess/GenerateTst', params);
      }

      public postCreateTicketNewReservation(params : any): Observable<ResultModel> {
        return this.http.post('Reservations/CreateTicketNewReservation', params);
      }

      public postCreateReservation(params : any): Observable<ResultModel> {
        return this.http.post('Reservations/CreateReservation', params);
      }

      public postCreateTSA(params : any): Observable<ResultModel> {
        return this.http.post('Reservations/CreateTSA', params);
      }

      public getValidationSettings(): Observable<ResultModel> {
        return this.http.get('ValidationSettings/GetAll');
      }

      public getBonus(params : any): Observable<ResultModel> {
        return this.http.post('Bonus/Coronavirus', params);
      }

}
