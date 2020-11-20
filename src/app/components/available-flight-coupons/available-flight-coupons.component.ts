import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataGlobalService } from '../../services/data.services/data-global.service';
import { ReportingService } from '../../services/reporting.service';
import { ApiService } from '../../services/api.service';
import Swal from 'sweetalert2';
import { _ } from 'underscore';
import { ResultModel } from '../../models/resultModel';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { AvailabilitiesService } from '../../services/availabilities.service';
import { MessageGlobalService } from '../../services/data.services/message-global.service';

@Component({
  selector: 'app-available-flight-coupons',
  templateUrl: './available-flight-coupons.component.html',
  styleUrls: ['./available-flight-coupons.component.less']
})
export class AvailableFlightCouponsComponent implements OnInit {
  public isClassReset: boolean = false;
  public nextPage: boolean = false;
  public previousPage: boolean = false;
  public selectFlightAvailable: any;
  public returnedArray: string[];
  public isCollapsed: boolean = false;
  public isbuttonS: boolean = false;
  public isbuttonM: boolean = false;
  public isbuttonL: boolean = false;
  public isbuttonXL: boolean = false;
  public isbuttonXXL: boolean = false;
  public bundle: any;
  public elementBundleLineNumber: any;
  public elementBundle: any;
  public getClass: boolean = false;
  public getFirstClass: boolean = true;
  public selectClass: string = "";
  public bundles: any;
  public isUniqueBundle: boolean = false;
  @Output() isSuccessCoupon = new EventEmitter<any>();

  constructor(
    private apiService: ApiService,
    private reportingService: ReportingService,
    public dataGlobalService: DataGlobalService,
    private apiAvailability: AvailabilitiesService,
    public messageGlobalService: MessageGlobalService
  ) { }

  ngOnInit() {
  }

  selectFlighLine(flightSelect: any) {
    this.getFirstClass = true;
    this.selectFlightAvailable = flightSelect;
    this.dataGlobalService.flightOption.forEach(element => {
      element.selectFlight = false;
      element.bundleSelect = false;
      element.selectClass = "";
      element.flightList.forEach(elementFlight => {
        elementFlight.disabledClass = true;
        elementFlight.selectClass = "";
      });
    });
    flightSelect.selectFlight = !flightSelect.selectFlight;
    flightSelect.flightList.forEach(elementFlight => {
      elementFlight.disabledClass = false;
      elementFlight.selectClass = "";
    });
    this.isClassReset = false;
    this.clearButton();

    if (this.dataGlobalService.getClassCoupon) {
      this.dataGlobalService.getClassCoupon = false;
      this.dataGlobalService.loading = true;
      this.cancelAvailabilityWithoutConfirm();
    }
  }

  selectFlightClass(fieldSelect: any, className: string) {
    fieldSelect.selectClass = className;
    fieldSelect.bundleSelect = true;
    this.selectClass = className.substr(0, 1);
    this.bundles = null;
    this.isCollapsed = true;
  }

  pageFlight(previousPage: boolean, nextPage: boolean) {
    this.selectFlightAvailable = undefined;
    this.dataGlobalService.loading = true;

    this.SearchFlightAvailable(this.dataGlobalService.dateFlightAvailability, previousPage, nextPage);
  }

  SearchFlightAvailable(dateFlight, previousPage: boolean, nextpage: boolean) {
    let paramsFlight = {
      "conversationId": sessionStorage.getItem('chatID'),
      "departureCity": dateFlight.substr(6, 3),
      "arrivalCity": dateFlight.substr(9, 3),
      "departureDate": dateFlight.substr(0, 6),
      "numberOfSeats": this.dataGlobalService.countPassenger,
      "nextPage": nextpage,
      "previousPage": previousPage
    }

    this.apiService.postFlights(paramsFlight).subscribe(
      (res: ResultModel) => {

        if (!res.isSuccess) {
          this.messageGlobalService.showErrorMessage('warning', 'Ha ocurrido un error, por favor inténtelo nuevamente');
          return;
        }

        if (res.data === null || res.data.length == 0) {
          this.messageGlobalService.showErrorMessage('info', 'No se encontró disponibilidad para la ruta seleccionada');
          return;
        }
        this.dataGlobalService.loading = false;
        this.dataGlobalService.flightOption = res.data;
      },
      () => {
        this.messageGlobalService.showErrorMessage('error', 'Ha ocurrido un error, por favor inténtelo nuevamente');
      });
  }

  validationLineFlight() {
    if (this.selectFlightAvailable == undefined || this.selectFlightAvailable === '') {
      this.messageGlobalService.showErrorMessage('warning', 'Por favor seleccione un segmento');
      return false;
    }

    let element = _.filter(this.selectFlightAvailable, function (item: any) { return item.selectClass != ''; });
    if (element != null && element.length > 0) {
      return true;
    } else {
      this.messageGlobalService.showErrorMessage('warning', 'Por favor seleccione la disponibilidad');
      return false;
    }
  }

  getCoupons() {

    if (this.validationLineFlight()) {

      this.selectFlightAvailable.flightList.forEach(element => {
        element.selectClass = this.selectFlightAvailable.selectClass;
      });

      let params = {
        "conversationId": sessionStorage.getItem('chatID'),
        "currency": JSON.parse(localStorage.getItem('dataTicketOrigin')).currencyTicket,
        "quantity": this.dataGlobalService.countPassenger,
        "modelRequest": this.selectFlightAvailable
      }
      this.dataGlobalService.loading = true;

      this.updateState('Solicitud de cupos', null, null);

      this.apiAvailability.postTakeAvailabilityForBundleSearch(params).subscribe((res: ResultModel) => {

        if (res.isSuccess) {
          this.dataGlobalService.journey = res.data.journey;
        } else {
          this.getFirstClass = true;
          this.dataGlobalService.getClassCoupon = false;
          this.messageGlobalService.showErrorMessage('warning', 'No se pudo tomar el cupo seleccionado, intente nuevamente con otro vuelo o clase');
          return;
        }

        if (res.data.bundleList === null) {
          this.messageGlobalService.showErrorMessage('warning', 'No se encontraron bundles para la clase seleccionada');
          return;
        }

        if (res.data.journey.flightAssignedInfo.length === 0) {
          this.messageGlobalService.showErrorMessage('warning', 'No se pudo tomar el cupo seleccionado, intente nuevamente con otro vuelo o clase');
          return;
        }

        this.dataGlobalService.loading = false;
        this.dataGlobalService.getClassCoupon = true;
        this.bundles = res.data.bundleList.listBundle;

        if (this.bundles != null) {
          if (this.bundles.length === 1) {
            this.isUniqueBundle = true;
          } else {
            this.isUniqueBundle = false;
          }
        }
      },
        () => {
          this.messageGlobalService.showErrorMessage('error', 'Ocurrio un error tomando el cupo seleccionado, intente nuevamente con otro vuelo o clase');
        });
    }
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

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.returnedArray = this.dataGlobalService.flightOption.slice(startItem, endItem);
  }

  bundleFlight(element: any) {
    this.bundles.forEach(bundle => {
      bundle.isSelect = false;
      bundle.opacityActive = true;
    });
    element.isSelect = true;
    element.opacityActive = false;
    this.isCollapsed = true;
    this.elementBundle = element.conditions;
    this.elementBundleLineNumber = element.lineNumber;
  }

  clearButton() {
    this.isCollapsed = false;
    this.isbuttonS = false;
    this.isbuttonM = false;
    this.isbuttonL = false;
    this.isbuttonXL = false;
    this.isbuttonXXL = false;
  }

  cancelAvailabilityWithoutConfirm() {
    this.getFirstClass = true;

    let flightHistoryId = localStorage.getItem('flightHistoryId');

    if (flightHistoryId === "null" || flightHistoryId === undefined) {
      flightHistoryId = null;
    }

    let params = {
      "conversationId": sessionStorage.getItem('chatID'),
      "flightHistoryId": flightHistoryId,
      "journey": this.dataGlobalService.journey
    };

    this.apiAvailability.postCancelAvailabilityWithoutConfirm(params).subscribe((res: ResultModel) => {
      this.dataGlobalService.loading = false;
      if (!res.isSuccess) {
        this.messageGlobalService.showErrorMessage('warning', 'No fue posible cancelar la clase, intente nuevamente seleccionado otra clase');
      }
    },
      () => {
        this.messageGlobalService.showErrorMessage('error', 'Ocurrio un error cancelando la clase, intente nuevamente seleccionado otra clase');
      });
  }

  changeClassForAvailability() {

    let params = {
      "conversationId": sessionStorage.getItem('chatID'),
      "selectedClass": this.selectClass,
      "currency": JSON.parse(localStorage.getItem('dataTicketOrigin')).currencyTicket,
      "journey": this.dataGlobalService.journey
    };

    this.apiAvailability.postChangeClassForAvailability(params).subscribe((res: ResultModel) => {

      if (res.isSuccess) {
        this.dataGlobalService.journey = res.data.journey;
      } else {
        this.messageGlobalService.showErrorMessage('warning', 'La clase no dispone de tallas disponibles, por favor intenta seleccionar una nueva.');
        return;
      }

      if (res.data == null || res.data.bundleList == null) {
        this.messageGlobalService.showErrorMessage('warning', 'La clase no dispone de tallas disponibles, por favor intenta seleccionar una nueva.');
        return;
      }
      this.dataGlobalService.loading = false;
      this.bundles = res.data.bundleList.listBundle;

      if (this.bundles != null) {
        if (this.bundles.length === 1) {
          this.isUniqueBundle = true;
        } else {
          this.isUniqueBundle = false;
        }
      }
    }, () => {
      this.messageGlobalService.showErrorMessage('error', 'Ocurrio un error realizando el cambio de clase. Por favor intenta seleccionar una nueva');
    }
    );
  }

  confirmCoupon() {
    this.dataGlobalService.disabledBundles = false;

    if (this.validationLineFlight()) {

      this.selectFlightAvailable.flightList.forEach(element => {
        element.selectClass = this.selectFlightAvailable.selectClass;
      });

      this.dataGlobalService.loading = true;

      let flightHistoryId = localStorage.getItem('flightHistoryId');

      if (flightHistoryId === "null" || flightHistoryId === undefined) {
        flightHistoryId = null;
      }

      let params = {
        "conversationId": sessionStorage.getItem('chatID'),
        "currency": JSON.parse(localStorage.getItem('dataTicketOrigin')).currencyTicket,
        "quantity": this.dataGlobalService.countPassenger,
        "modelRequest": this.selectFlightAvailable,
        "flightHistoryId": flightHistoryId
      }


      this.apiAvailability.postTakeAvailability(params).subscribe((res: ResultModel) => {
        this.dataGlobalService.loading = false;

        if (!res.isSuccess) {
          this.messageGlobalService.showErrorMessage('warning', 'No se pudo tomar el cupo seleccionado, intente nuevamente con otro vuelo o clase');
          return;
        }

        localStorage.setItem('flightHistoryId', res.data.flightHistoryId);
        this.dataGlobalService.getClassCoupon = false;
        this.dataGlobalService.flightOption = [];
        this.dataGlobalService.serviceArrayFlightAvailable = res.data.journeysDetail;

        this.isSuccessCoupon.emit();
      },
        () => {
          this.messageGlobalService.showErrorMessage('error', 'No se pudo tomar el cupo seleccionado, intente nuevamente con otro vuelo o clase');
        });
    }
  }
}
