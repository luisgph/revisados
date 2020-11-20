import { Injectable } from '@angular/core';
import { DataGlobalService } from '../services/data.services/data-global.service';
import { ReportingService } from '../services/reporting.service';
import { ResultModel } from '../models/resultModel';
import { _ } from 'underscore';

@Injectable({
  providedIn: 'root'
})

// Aquí se va a construir el interceptor para los servicios y todo la configuración de las uri de las Api.
export class ReportingCommon {

    constructor(
        private reportingService: ReportingService,
        public dataGlobalService: DataGlobalService,
    ) { }

    saveInitSearchTicket() {
        let user = JSON.parse(sessionStorage.getItem('user'));
        let states = JSON.parse(localStorage.getItem('States'));
        let stateInit = _.filter(states.ticketSearchStates, function (item) { return item.description == "Consulta iniciada" })[0];
        let params = {
            "ticketNumber": this.dataGlobalService.ticketNumber,
            "callerName": this.dataGlobalService.callName,
            "userId": user.userid,
            "ipAdress": sessionStorage.getItem('LOCAL_IP'),
            "stateid": stateInit.stateId,
            "routeType" : null
        };

        this.reportingService.saveInitSearchTicket(params).subscribe(
            (res: ResultModel) => {
            if (res.isSuccess)
                localStorage.setItem("SystemStateTicket", JSON.stringify(res.data));
            }
        );
    }

    insertResultTicketAndReservation(data: any, nameticketState: any) {
        let user = JSON.parse(sessionStorage.getItem('user'));
        let ticketSearchId = JSON.parse(localStorage.getItem('SystemStateTicket')).ticketSearchId;
        let states = JSON.parse(localStorage.getItem('States'));

        let stateTicket = _.filter(states.ticketStates, function (item) { return item.description == nameticketState })[0];

        let dataReservation = null;

        let dataTicket = {
            UserId: user.userid,
            StateId: stateTicket,
            TicketNumber: this.dataGlobalService.ticketNumber,
            ExpeditionDate: data.dateEmit,
            TicketSearchId: ticketSearchId,
            ItHasReservation: (data.reservationsInfo != null && data.reservationsInfo.length > 0),
            ReservationNumber: (data.reservationsInfo != null && data.reservationsInfo.length > 0) ? data.reservationsInfo[0].reservationCode : null,
        }

        if (data.reservationsInfo != null && data.reservationsInfo.length > 0) {
            let statedReservation = _.filter(states.reservationStates, function (item) { return item.description == 'Reserva activa' })[0];
            dataReservation = {
            UserId: user.userid,
            StateId: statedReservation,
            ReservationNumber: data.reservationsInfo[0].reservationCode,
            PassengerQuantity: data.reservationsInfo[0].passengersInfoModel.length,
            AssociatedTickets: data.reservationsInfo[0].listTicketsAssociateds,
            TicketQuantity: data.reservationsInfo[0].listTicketsAssociateds.length,
            TicketSearchId: ticketSearchId
            }
        }

        let params = {
            JsonTicket: dataTicket,
            JsonReservation: dataReservation
        }

        this.reportingService.insertResultTicketAndRervation(params).subscribe(
            (res: ResultModel) => {
            }
        );
    }

    saveAndValidationTypeTicket(data: any){
        let ticketSearch = JSON.parse(localStorage.getItem('SystemStateTicket'));
        let user = JSON.parse(sessionStorage.getItem('user'));
        let params = {
            "ticketSearch" : ticketSearch.ticketSearchId,
            "Stateid" : user.userid,
            "dataCoupon" : data.couponInfoGroup
        };

        this.reportingService.ValidationTypeRouts(params).subscribe(
            (res : ResultModel) =>{  }
        );
    }

    updateState(statedTicketSearch: any, statedTicket: any, statedReservation: any) {
        let user = JSON.parse(sessionStorage.getItem('user'));
        let ticketSearch = JSON.parse(localStorage.getItem('SystemStateTicket'));
        let statesTicket = JSON.parse(localStorage.getItem('States'));

        let statedIdTicketSearch: any;
        let stateIdTicket: any;
        let stateIdReservation: any;

        if (statedTicketSearch != null)
            statedIdTicketSearch = _.filter(statesTicket.ticketSearchStates, function (item) { return item.description == statedTicketSearch })[0];

        if (statedTicket != null)
            stateIdTicket = _.filter(statesTicket.ticketStates, function (item) { return item.description == statedTicket })[0];

        if (statedReservation != null)
            stateIdReservation = _.filter(statesTicket.reservationStates, function (item) { return item.description == statedReservation })[0];

        let params = {
            "ticketSearchid": ticketSearch.ticketSearchId,
            "userId": user.userid,
            "TicketStateId": (stateIdTicket) ? stateIdTicket.stateId : null,
            "ReservationStateId": (stateIdReservation) ? stateIdReservation.stateId : null,
            "TicketsSearchStateId": (statedIdTicketSearch) ? statedIdTicketSearch.stateId : null
        };

        this.reportingService.updateState(params).subscribe(
            (res: ResultModel) => {
            if (res.isSuccess)
                localStorage.setItem("SystemStateTicket", JSON.stringify(res.data));
            }
        );
    }

    updateSearchStateTicket(stated: any) {
        let user = JSON.parse(sessionStorage.getItem('user'));
        let statesTicket = JSON.parse(localStorage.getItem('States')).ticketSearchStates;
        let ticketSearch = JSON.parse(localStorage.getItem('SystemStateTicket'));
        let state = _.filter(statesTicket, function (item) { return item.description == stated })[0];
        let params = {
            "ticketSearchid": ticketSearch.ticketSearchId,
            "userId": user.userid,
            "stateid": state.stateId
        };

        this.reportingService.updateStateTicket(params).subscribe(
            (res: ResultModel) => {
            if (res.isSuccess)
                localStorage.setItem("SystemStateTicket", JSON.stringify(res.data));
            }
        );
    }
}
