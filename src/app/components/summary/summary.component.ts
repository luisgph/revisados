import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataGlobalService } from '../../services/data.services/data-global.service';
import { _ } from 'underscore';
import Swal from 'sweetalert2';
import { ApiService } from '../../services/api.service';
import { ResultModel } from '../../models/resultModel';
import { QuoteService } from '../../services/http.services/quote.service';
import { ConversationService } from '../../services/http.services/conversation.service';
import { Router } from '@angular/router';
import { ReportingCommon } from '../../commons/reporting';
import { FaresService } from '../../services/fares.service';
import { MessageGlobalService } from '../../services/data.services/message-global.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.less']
})
export class SummaryComponent implements OnInit {
  public reservationData: any;
  public penaltyCacheId: any;
  public coupons: any;
  public reservationSegmentInfo:any;
  @Output() selectTab =  new EventEmitter<any>();
  public localBonus : any;

  constructor(
    public dataGlobalService: DataGlobalService,
    public apiFaresService :  FaresService,
    private apiService: ApiService,
    private apiQuoteService: QuoteService,
    private router: Router,
    private apiConversationService : ConversationService,
    private reportingCommon : ReportingCommon,
    public messageGlobalService:MessageGlobalService
  ) { }

  ngOnInit() {
    let validations = JSON.parse(localStorage.getItem('validations'));
    this.localBonus = _.filter(validations, function (item) { return item.name === "Bonus" });
  }

  fareSearch(){
    this.dataGlobalService.loading = true;

    let fareBundleSelect =  _.where(this.dataGlobalService.fareBundles, {isSelect : true});
    let fareCacheId = localStorage.getItem('fareCacheId');

    if (fareCacheId === "null")
        fareCacheId = null;

    let params = {
      "conversationId": sessionStorage.getItem('chatID'),
      "fareCacheId": fareCacheId,
      "optionNumber": fareBundleSelect[0].optionLineNumber,
      "passengerLines": this.dataGlobalService.linePassengerSelect,
      "isRebooking":  this.dataGlobalService.isRebooking,
      "isUniqueBundle" : this.dataGlobalService.isUniqueOption,
      "journeyList": this.dataGlobalService.serviceArrayFlightAvailable,
      "routeType": JSON.parse(localStorage.getItem('dataTicketOrigin')).routeType
    };

    this.apiFaresService.fareSearch(params).subscribe(
      (res : any)=>{
        if (!res.isSuccess || res.data === null) {
          this.messageGlobalService.showErrorMessage('warning', 'Error tomando cotizacion.');
          return;
        }

        localStorage.setItem("fareCacheId",res.data.fareCacheId);
        this.getRetrievePNR();
      },
      ()=>{
         this.messageGlobalService.showErrorMessage('error', 'Error tomando cotizacion.');
      }
    );
  }

  getRetrievePNR() {
    let conversationId = sessionStorage.getItem('chatID');
    let params = {
      "conversationId": conversationId,
    };

    this.apiService.getReservationsGetRetrievePNR(params).subscribe(
      (resReservation: ResultModel) => {

        if (!resReservation.isSuccess) {
          this.messageGlobalService.showErrorMessage('warning', 'Ocurrio un error por favor intente nuevamente.');
          return;
        }

        this.reservationData = resReservation.data;
        this.getPenalitys();

      },
      ()=>{
         this.messageGlobalService.showErrorMessage('error', 'Ocurrio un error por favor intente nuevamente.');
      }
    );
  }

  getPenalitys() {
    let conversationId = sessionStorage.getItem('chatID');
    this.coupons = this.dataGlobalService.data.couponInfoGroup;

    let params = {
      "conversationId": conversationId,
      "dateEmit": JSON.parse(localStorage.getItem('dataTicketOrigin')).dateEmit,
      "passengersInformation": this.reservationData.passengersInformation,
      "trayectInfoGroup": this.coupons,
      "currency": JSON.parse(localStorage.getItem('dataTicketOrigin')).currencyTicket
    };


    this.apiQuoteService.GetFarePenality(params).subscribe(
      (res: ResultModel) => {

        if (res.isSuccess && res.data === null) {
          this.messageGlobalService.showErrorMessage('warning', res.returnMessage,'/search-ticket');
          return;
        }

        if (!res.isSuccess) {
          this.messageGlobalService.showErrorMessage('warning','No fue posible buscar penalidades, por favor intente nuevamente');
          return;
        }


        this.penaltyCacheId = res.data.penalityCacheId;
        this.postCalculationprocess();
      },
      () => {
        this.messageGlobalService.showErrorMessage('error', 'Ocurrio un error al buscar penalidades, por favor intente nuevamente');
      }
    );
  }

  postCalculationprocess() {

    let historyFareCacheId = localStorage.getItem('historyFareCacheId');

    if (historyFareCacheId === "null")
      historyFareCacheId = null;

    let params = {
      "ticketIdRedisCache": JSON.parse(localStorage.getItem('dataTicketOrigin')).idRedisCache,
      "fareCacheId": localStorage.getItem('fareCacheId'),
      "historyFareCacheId": historyFareCacheId,
      "penaltyCacheId": this.penaltyCacheId,
      "serviceFee": this.dataGlobalService.isServiceFee,
      "codeIataCountry": JSON.parse(localStorage.getItem('dataTicketOrigin')).countryTicket,
      "passengersInformation": this.reservationData.passengersInformation,
      "bonusCacheId" : this.dataGlobalService.dataBonus != null ? this.dataGlobalService.dataBonus.bonusCacheId : null,
      "validationType" :  this.localBonus[0].description
    };

    this.reportingCommon.updateState('Cálculo de la cotización', null, null);
    this.apiQuoteService.postCalculationsProcess(params).subscribe(
      (res: ResultModel) => {
        this.dataGlobalService.loading = false;
        if (res.isSuccess) {
            this.dataGlobalService.dataNewQuote =  res.data;
            localStorage.setItem('tstCacheId', res.data.tstCacheId);
            this.reservationSegmentInfo = this.reservationData.reservationSegmentInfo;
            this.dataGlobalService.passengersInformation = this.reservationData.passengersInformation;
        }else{
          this.messageGlobalService.showErrorMessage('warning', 'No fue posible realizar el calculo de la cotización, por favor intente nuevamente');
        }
      },
      () => {
        this.messageGlobalService.showErrorMessage('error', 'Ocurrio un error al momento de calcular la cotización, por favor intente nuevamente');
      }
    );
  }

  clean() {
    Swal.fire({
      title: "¿ Estás seguro ?",
      text: "De limpiar e ignorar todos los cambios realizados!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#df0817',
      cancelButtonText: 'No',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.value) {
        this.dataGlobalService.loading = true;
        this.closeAll();
      }
    });
  }

  closeAll() {
    let conversationId = sessionStorage.getItem('chatID');
    this.apiConversationService.getIgnoreChanges({ 'conversationId': conversationId }).subscribe(
      () => {
        this.apiConversationService.getCloseConversation({ 'Conversation_Id': conversationId }).subscribe(
          () => {
            this.dataGlobalService.loading = false;
            this.router.navigateByUrl('/search-ticket');
          }
        );
    }, () => {
      this.apiConversationService.getCloseConversation({ 'Conversation_Id': conversationId }).subscribe(
        () => {
          this.dataGlobalService.loading = false;
          this.router.navigateByUrl('/search-ticket');
        }
      );
    });
  }

  GenerateTstAndSavePnr(){

    this.dataGlobalService.loading = true;
    let params = {
      "conversationId" : sessionStorage.getItem('chatID'),
      "ticketIdRedisCache": JSON.parse(localStorage.getItem('dataTicketOrigin')).idRedisCache,
      "fareCacheId": localStorage.getItem('fareCacheId'),
      "historyFareCacheId":!this.dataGlobalService.isHistory ? null:localStorage.getItem('historyFareCacheId') === "null"? null:localStorage.getItem('historyFareCacheId'),
      "penaltyCacheId":this.penaltyCacheId,
      "tstCacheId":localStorage.getItem('tstCacheId'),
      "serviceFee": this.dataGlobalService.isServiceFee,
      "codeIataCountry": JSON.parse(localStorage.getItem('dataTicketOrigin')).countryTicket,
      "passengersInformation": this.dataGlobalService.passengersInformation
    }

    this.apiService.generateTST(params).subscribe((res:ResultModel) =>{
      if (res.isSuccess) {

        if (this.dataGlobalService.data.needNewReservation) {
          this.dataGlobalService.loading=false;
          this.selectTab.emit(5);
        }else{
          this.documentReservation();
        }

      }else{
        this.messageGlobalService.showErrorMessage('warning', 'No fue posible generar la TST, por favor intente nuevamente');
      }
    },
    () => {
      this.messageGlobalService.showErrorMessage('error', 'Ocurrio un error generando el TST, por favor intente nuevamente');
    }
  );
  }

  documentReservation(){
    let params = {
      "conversationId" : sessionStorage.getItem('chatID'),
      "passengersInformation": this.dataGlobalService.passengersInformation,
      "calculationChange": this.dataGlobalService.dataNewQuote
    }

    this.apiService.documentReservation(params).subscribe(
      (res:ResultModel)=>{
        if (res.isSuccess) {
          this.saveChangesReservations();
        } else {
          this.messageGlobalService.showErrorMessage('warning', 'No fue posible guardar los cambios en la reserva, por favor intente nuevamente');
        }
      }
      ,
      () => {
        this.messageGlobalService.showErrorMessage('error', 'Ocurrio un error guardando los cambios en la reserva, por favor intente nuevamente');
      }
    );
  }

  saveChangesReservations(){

    let user = JSON.parse(sessionStorage.getItem('user'));
    let params = {
      "conversationId" : sessionStorage.getItem('chatID'),
      "userSession" : user.firstname + " " + user.lastname,
      "callerName" : localStorage.getItem('callerName'),
      "isSplitReserve" : this.dataGlobalService.isSplitReserve
    };
    this.apiService.saveChangesReservation(params).subscribe(
      (res:ResultModel)=>{
        this.dataGlobalService.loading = false;
        if(res.isSuccess && res.data != null){

          this.reportingCommon.updateState('Cambio finalizado',null ,'Reserva actualizada');

          Swal.fire({
            allowOutsideClick:false,
            icon: 'success',
            title: res.data.originDestinationDetails.itineraryInfo['0'].itineraryReservationInfo.reservation.controlNumber,
            text: '¡El cambio voluntario ha finalizado con éxito!',
            footer: '<a>Ahora puedes finalizar el proceso en el PCCE</a>',
            confirmButtonColor: '#df0817',
            confirmButtonText: 'Aceptar'
          });

            this.router.navigateByUrl('/search-ticket');

        }else{
          this.messageGlobalService.showErrorMessage('warning', 'No fue posible guardar la reserva, por favor intente nuevamente');
        }
      },
      () => {
        this.messageGlobalService.showErrorMessage('error', 'Ocurrio un error guardando la reserva, por favor intente nuevamente');
      }
    );
  }
}
