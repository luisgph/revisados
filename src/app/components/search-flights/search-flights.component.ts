
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ApiService } from '../../services/api.service';
import { ResultModel } from '../../models/resultModel';
import { DataGlobalService } from '../../services/data.services/data-global.service';
import { _ } from 'underscore';
import { ReportingService } from '../../services/reporting.service';
import { AvailabilitiesService } from '../../services/availabilities.service';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { MessageGlobalService } from '../../services/data.services/message-global.service';
defineLocale('es', esLocale);

@Component({
  selector: 'app-search-flights',
  templateUrl: './search-flights.component.html',
  styleUrls: ['./search-flights.component.less']
})
export class SearchFlightsComponent implements OnInit {

  public listIataOrigin: any;
  public listIataDestination: any;
  public iataOrigin: string = 'Origen...';
  public iataDestination: string = 'Destino...';

  public dateValue: Date;
  public colorTheme = 'theme-red';
  public bsConfig: Partial<BsDatepickerConfig>;
  public minDate: Date;
  public rebooking: boolean;
  public nextPage: boolean = false;
  public previousPage: boolean = false;
  public arrayReservationsSegments: any[] = [];
  public isCancelSegment: boolean = false;
  public messaggeError = "Ha ocurrido un error, por favor inténtelo nuevamente";
  @Output() isSuccessDatafligth =  new EventEmitter<any>();
  @Output() cleanAndDesabledOptions =  new EventEmitter<any>();

  constructor(
    public dataGlobalService: DataGlobalService,
    private apiService: ApiService,
    private localeService: BsLocaleService,
    private reportingService: ReportingService,
    private apiAvailability: AvailabilitiesService,
    public messageGlobalService:MessageGlobalService) {
    this.minDate = new Date();
    localeService.use('es');
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme, dateInputFormat: 'DD-MM-YYYY', isAnimated: true, adaptivePosition: true });
  }

  ngOnInit() {
      this.dataGlobalService.serviceArrayFlightAvailable = [];
      this.listIataOrigin = this.dataGlobalService.iata;
      this.listIataDestination =this.dataGlobalService.iata;
  }

  searchFlights() {
    this.dataGlobalService.loading = true;
    this.dataGlobalService.isRebooking = false;
    this.cleanAndDesabledOptions.emit();

    if (this.dataGlobalService.getClassCoupon) {
      this.dataGlobalService.getClassCoupon = false;
      this.CancelAvailabilityWithoutConfirm();
    }

    if (!this.isValidateFlight()) {
        return;
    }

    this.dataGlobalService.dateFlightAvailability = ("0" + this.dateValue.getDate()).slice(-2) + ("0" + (this.dateValue.getMonth() + 1)).slice(-2) + ("0" + (this.dateValue.getFullYear())).slice(-2) + this.iataOrigin + this.iataDestination;

    if (!this.dataGlobalService.flightAlone) {
      if (this.dataGlobalService.passenger == null) {
        this.SearchFlightAvailable(this.dataGlobalService.dateFlightAvailability);
        return;
      }


      this.arrayReservationsSegments = [];
      this.dataGlobalService.data.couponInfoGroup.forEach(coupon => {

        if (coupon.isSelect && coupon.reservationSegmentsInfo != null) {
          coupon.reservationSegmentsInfo.forEach(item => {
            this.arrayReservationsSegments.push(item);
          });
        }
      });
    }

    if (!this.dataGlobalService.data.needNewReservation) {
      if (this.arrayReservationsSegments.length == 0) {
        this.messageGlobalService.showErrorMessage('warning','No se encontraron segmentos disponibles');
        return;
      }
    }

    if (this.dataGlobalService.flightAlone) {
      this.SearchFlightAvailable(this.dataGlobalService.dateFlightAvailability);
      return;
    }

    if (this.dataGlobalService.passenger == null) {
      this.SearchFlightAvailable(this.dataGlobalService.dateFlightAvailability);
      return;
    }

    if (this.isCancelSegment) {
      this.SearchFlightAvailable(this.dataGlobalService.dateFlightAvailability);
      return;
    }

    if (this.dataGlobalService.isTotalPassenger && !this.dataGlobalService.data.needNewReservation) {
      this.CancelSegmentsSelect(this.dataGlobalService.dateFlightAvailability);
      return;
    }

    if (!this.dataGlobalService.data.needNewReservation) {
      this.SplitPNR(this.dataGlobalService.dateFlightAvailability);
      return;
    }

    this.SearchFlightAvailable(this.dataGlobalService.dateFlightAvailability);
    return;
  }

  CancelAvailabilityWithoutConfirm() {

    let flightHistoryId = localStorage.getItem('flightHistoryId');

    if (flightHistoryId === "null" || flightHistoryId === undefined) {
      flightHistoryId = null;
    }

    let params = {
      "conversationId": sessionStorage.getItem('chatID'),
      "flightHistoryId": flightHistoryId,
      "journey": this.dataGlobalService.journey
    };

    this.apiAvailability.postCancelAvailabilityWithoutConfirm(params).subscribe(
      (res: ResultModel) => {
        if (!res.isSuccess) {
          this.messageGlobalService.showErrorMessage('warning', 'Error al cancelar cupo no confimado, por favor intente nuevamente');
        }
      },() => {
        this.messageGlobalService.showErrorMessage('error', 'Error al cancelar cupo no confimado, por favor intente nuevamente');
      });
  }

  CancelSegmentsSelect(dateFlight: any) {
    let params = {
      "chatId": sessionStorage.getItem('chatID'),
      "reservationCode": this.dataGlobalService.data.reservationsInfo['0'].reservationCode,
      "segments": this.arrayReservationsSegments
    }
    this.apiService.postCancelSegments(params).subscribe(
      (res: ResultModel) => {
        if (!res.isSuccess) {
          this.messageGlobalService.showErrorMessage('warning', 'Ocurrio un error cancelando los segmentos seleccionados');
          return;
        }

        this.isCancelSegment = true;
        this.SearchFlightAvailable(dateFlight);

      },
      () => {
        this.messageGlobalService.showErrorMessage('error', this.messaggeError);
      }
    );
  }

  SplitPNR(dateFlight: any) {
    let params = {
      "conversationId": sessionStorage.getItem('chatID'),
      "reservationCode": this.dataGlobalService.data.reservationsInfo['0'].reservationCode,
      "passengers": this.dataGlobalService.linePassengerSelect,
      "segments": this.arrayReservationsSegments
    };

    this.apiService.postSplitReserve(params).subscribe(
      (res: ResultModel) => {
        if (!res.isSuccess) {
          this.messageGlobalService.showErrorMessage('warning', this.messaggeError);
          return;
        }

        for (let i = 0; i < res.data.length; i++) {
          if ( i ===  0) {
            this.dataGlobalService.linePassengerSelect = res.data[i].passengerLine;
          } else {
            this.dataGlobalService.linePassengerSelect += ',' + res.data[i].passengerLine ;
          }
        }

        this.isCancelSegment = true;
        this.dataGlobalService.isSplitReserve = true;
        this.updateState(null, null, 'Division de reserva');
        this.SearchFlightAvailable(dateFlight);
      },
      () => {
        this.messageGlobalService.showErrorMessage('error', this.messaggeError);
      });
  }

  SearchFlightAvailable(dateFlight) {
    let paramsFlight = {
      "conversationId": sessionStorage.getItem('chatID'),
      "departureCity": dateFlight.substr(6, 3),
      "arrivalCity": dateFlight.substr(9, 3),
      "departureDate": dateFlight.substr(0, 6),
      "numberOfSeats": this.dataGlobalService.countPassenger,
      "nextPage": false,
      "previousPage": false
    }
    this.updateState('Búsqueda de disponibilidad', null, null);

    this.apiService.postFlights(paramsFlight).subscribe(
      (res: ResultModel) => {
        if (!res.isSuccess) {
          this.messageGlobalService.showErrorMessage('warning', this.messaggeError);
          return;
        }

        if (res.data === null || res.data.length == 0) {
          this.messageGlobalService.showErrorMessage('warning', 'No se encontró disponibilidad para la ruta seleccionada');
          return;
        }

        this.dataGlobalService.loading = false;
        this.dataGlobalService.getClassCoupon = false;
        this.dataGlobalService.flightOption = res.data;
        this.isSuccessDatafligth.emit(res.data);
      },
      () => {
       this.messageGlobalService.showErrorMessage('error', this.messaggeError);
      }
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

  changeCity() {
    let origin = this.iataOrigin;
    let destination = this.iataDestination;

    this.iataOrigin = destination;
    this.iataDestination = origin;
  }

  isValidateFlight(): boolean {

    let origin: any = document.getElementById('selectOrigin');
    let destination: any = document.getElementById('selectDestinations');
    let SegmentSelect = _.filter(this.dataGlobalService.data.couponInfoGroup, function (item) { return item.isSelect; });


    if (SegmentSelect.length == 0) {
      this.messageGlobalService.showErrorMessage('warning', 'Se debe seleccionar al menos un segmento para realizar la búsqueda de vuelos');
      return false;
    }

    if (origin.options[origin.selectedIndex].text == destination.options[destination.selectedIndex].text) {
      this.messageGlobalService.showErrorMessage('warning', 'El origen y destino son iguales, por favor valídelo e intente nuevamente');
      return false;
    }

    if (origin.selectedIndex == 0) {
      this.messageGlobalService.showErrorMessage('warning', 'Se debe seleccionar un origen, por favor valídelo e intente nuevamente');
      return false;
    }

    if (destination.selectedIndex == 0) {
      this.messageGlobalService.showErrorMessage('warning', 'se debe selecionar un destino, por favor valídelo e intente nuevamente')
      return false;
    }

    if (this.dateValue == undefined) {
      this.messageGlobalService.showErrorMessage('warning', 'La fecha de vuelo es obligatoria, por favor valídela e intente nuevamente');
      return false;
    }

    let dt1 = new Date(this.dateValue);
    let dt2 = new Date();

    let diffDays = Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      this.messageGlobalService.showErrorMessage('warning', 'La fecha de vuelo es menor a la fecha actual');
      return false;
    }

    return true;
  }
}
