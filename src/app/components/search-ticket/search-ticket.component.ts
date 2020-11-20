import { Component, OnInit } from '@angular/core';
import { DataGlobalService } from '../../services/data.services/data-global.service';
import { Router } from '@angular/router';
import { ResultModel } from '../../models/resultModel';
import { ReportingService } from '../../services/reporting.service';
import { ApiService } from '../../services/api.service';
import { TokenService } from '../../services/token.service';
import { _ } from 'underscore';
import Swal from 'sweetalert2';
import { ReportingCommon } from '../../commons/reporting';
import { Passenger } from '../../models/passenger';
import { MessageGlobalService } from '../../services/data.services/message-global.service';

@Component({
  selector: 'app-search-tickets',
  templateUrl: './search-ticket.component.html',
  styleUrls: ['./search-ticket.component.less']
})
export class SearchTicketComponent implements OnInit {

  public userName: string;
  public passenger: Passenger;
  public localBonus: any;

  constructor(
    public dataGlobalService: DataGlobalService,
    private router: Router,
    private apiService: ApiService,
    private reportingService: ReportingService,
    private apiTokenServices: TokenService,
    private reportingCommon: ReportingCommon,
    public messageGlobalService: MessageGlobalService

  ) {
    sessionStorage.setItem('chatID', null);
    localStorage.setItem('dataTicketOrigin', null);
    localStorage.setItem('callerName', null);
    localStorage.setItem('historyFareCacheId', null);
    localStorage.setItem('SystemStateTicket', null);
    localStorage.setItem('fareCacheId', null);
    localStorage.setItem('flightHistoryId', null);

    this.cleanDataService();

    let validations = JSON.parse(localStorage.getItem('validations'));
    this.localBonus = _.filter(validations, function (item) { return item.name === "Bonus" });
  }

  ngOnInit() {
    if (!localStorage.getItem('States')) {
      this.getStates();
    }

    if (this.dataGlobalService.iata === undefined) {
      this.getIata();
    }

    var user_info = JSON.parse(sessionStorage.getItem('user'));
    this.userName = `${user_info.firstname}!`;
  }

  search() {
    this.dataGlobalService.loading = true;
    this.generationToken();
  }

  getStates() {
    this.reportingService.geStatesTicket().subscribe(
      (res: ResultModel) => {
        if (res.isSuccess) {
          localStorage.setItem("States", JSON.stringify(res.data));
        }
      }
    );
  }

  getIata() {
    this.apiService.getIata().subscribe((res: ResultModel) => {
      this.dataGlobalService.iata = res.data;
    });
  }

  generationToken() {
    localStorage.removeItem('Authorization');
    this.apiTokenServices.getToken().subscribe(
      (resToken: ResultModel) => {
        localStorage.setItem('Authorization', resToken.data.accessToken);
        this.searchTicket();
      }, () => {
        this.messageGlobalService.showErrorMessage('error','Ocurrió un error consultado el token de seguridad');
      });
  }

  searchTicket() {
    let params = {
      "ticketNumber": this.dataGlobalService.ticketNumber,
      "flightAlone": this.dataGlobalService.flightAlone
    }

    this.reportingCommon.saveInitSearchTicket();
    this.apiService.getTicket(params).subscribe(
      (res: ResultModel) => {
        if (res.isSuccess) {
          this.reportingCommon.updateSearchStateTicket('Boleto encontrado');

          this.dataGlobalService.data = res.data;
          this.dataGlobalService.countryTicket = res.data.countryTicket;

          console.log(res.data);

          if (res.data.reservationsInfo != null) {
            this.dataGlobalService.passenger = res.data.reservationsInfo['0'].passengersInfoModel;
          } else {
            this.passenger = new Passenger();
            this.passenger.passengerFirstName = res.data.namePassenger;
            this.passenger.passengerSurname = res.data.surnamePassenger;
            this.passenger.passengerType = res.data.passengerType == 'A' ? 'ADT' : res.data.passengerType == 'I' ? 'INF' : res.data.passengerType == 'C' ? 'CHD' : 'ADT';
            this.passenger.passengerLine = "1";
            this.passenger.ticketNumber = res.data.ticketNumber;

            let listPassenger: Passenger[] = [];
            listPassenger.push(this.passenger);

            this.dataGlobalService.passenger = listPassenger;
          }


          if (!this.validationTicket(res.data)) {
            return;
          }

          this.reportingCommon.insertResultTicketAndReservation(res.data, 'Tiquete procesable');

          if (res.data.needUserValidation) {
            Swal.fire({
              title: 'Se encontro un cupon con estado G, ¿Desa continuar con el proceso?',
              icon: 'warning',
              allowOutsideClick: false,
              showCancelButton: true,
              confirmButtonColor: '#df0817',
              cancelButtonColor: '#6c757d',
              confirmButtonText: 'Seguir',
              cancelButtonText: 'Cancelar'
            }).then((result) => {
              if (result.value) {
                this.showReservationsActive(res);
              }
            })
          } else {
            this.showReservationsActive(res);
          }
        }
        else {
          this.reportingCommon.updateSearchStateTicket('Boleto no encontrado');
          this.messageGlobalService.showErrorMessage('warning','Número de tiquete no encontrado');
        }
      }, () => {
        this.messageGlobalService.showErrorMessage('error','Ocurrió un error consultado el tiquete, por favor intente nuevamente');
      });
  }

  cleanDataService() {
    this.dataGlobalService.data = null;
    this.dataGlobalService.ticketNumber = "";
    this.dataGlobalService.callName = "";
    this.dataGlobalService.flightOption = [];
    this.dataGlobalService.disabledSegment = false;
    this.dataGlobalService.disabledSegmentCheckBox = false;
    this.dataGlobalService.isRebooking = false;
    this.dataGlobalService.isServiceFee = true;
    this.dataGlobalService.existHistorical = false;
    this.dataGlobalService.countryTicket = '';
    this.dataGlobalService.loading = false;
    this.dataGlobalService.dataBonus = null;
    this.dataGlobalService.stepBonus = false;
    this.dataGlobalService.isBonus = false;
  }

  showReservationsActive(res: ResultModel) {
    let params = {
      "iata": res.data.countryTicket,
      "currency": res.data.currencyTicket
    }

    this.apiService.getChatID(params).subscribe((resChat: ResultModel) => {

      if (resChat.isSuccess) {
        sessionStorage.setItem('chatID', resChat.data);
        localStorage.setItem('callerName', this.dataGlobalService.callName);
        localStorage.setItem('dataTicketOrigin', JSON.stringify(res.data));
        localStorage.setItem('historyFareCacheId', null);

        this.reportingCommon.saveAndValidationTypeTicket(res.data);

        if (this.localBonus[0].enabled) {
          if (this.dataGlobalService.isBonus) {
            this.dataGlobalService.stepBonus = false;
          } else {
            this.dataGlobalService.stepBonus = true;
          }
        } else {
          this.dataGlobalService.stepBonus = true;
        }

        if (this.localBonus[0].enabled && this.dataGlobalService.isBonus) {
          this.getBonus();
        }
        else {
          this.dataGlobalService.loading = false;
          this.router.navigateByUrl('/main');
        }
      }else{
        this.cleanDataService();
        this.messageGlobalService.showErrorMessage('warning', resChat.returnMessage);
      }
    }, () => {
      this.messageGlobalService.showErrorMessage('error', 'Ocurrió un error consultado las reservas, por favor intente nuevamente');
    });
  }

  validationTicket(data: any) {
    if (data.notValidCommercialTicket) {
      this.cleanDataService();
      this.messageGlobalService.showErrorMessage('warning', 'Tiquete no comercial, requiere manejo manual');
      this.reportingCommon.insertResultTicketAndReservation(data, 'Tiquete no comercial');
      return false;
    }

    if (data.notIsValidTicket) {
      this.cleanDataService();
      this.messageGlobalService.showErrorMessage('warning','El tiquete se encuentra en un estado no válido para cambio voluntario');
      this.reportingCommon.insertResultTicketAndReservation(data, 'Tiquete no procesable');
      return false;
    }

    if (data.isResignedTicket) {
      this.cleanDataService();
      this.messageGlobalService.showErrorMessage('warning','El boleto ha sufrido un cambio');
      this.reportingCommon.insertResultTicketAndReservation(data, 'Tiquete no procesable');
      return false;
    }

    if (data.reservationsInfo != null && data.reservationsInfo.length > 0 && data.reservationsInfo['0'].existInfantReservation) {
      this.cleanDataService();
      this.messageGlobalService.showErrorMessage('warning','Tiquete no procesable, reserva con un infante');
      this.reportingCommon.insertResultTicketAndReservation(data, 'Tiquete no procesable');
      return false;
    }

    if (!data.internationalEnabledForChange) {
      this.cleanDataService();
      this.messageGlobalService.showErrorMessage('warning','Tiquete internacional parcialmente volado. Requiere manejo manual');
      this.reportingCommon.insertResultTicketAndReservation(data, 'Tiquete no procesable');
      return false;
    }

    if (!data.isValidAssociatedTickets) {
      this.cleanDataService();
      this.messageGlobalService.showErrorMessage('warning','Los tiquetes asociados a la reserva no cumplen las condiciones requeridas. Requiere manejo manual');
      this.reportingCommon.insertResultTicketAndReservation(data, 'Tiquete no procesable');
      return false;
    }

    if (data.ticketUsedInDisorder) {
      this.cleanDataService();
      this.messageGlobalService.showErrorMessage('warning','El tiquete se encuentra volado en desorden. Requiere manejo manual');
      this.reportingCommon.insertResultTicketAndReservation(data, 'Tiquete no procesable');
      return false;
    }

    if (data.reservationsInfo != null) {
      if (data.reservationsInfo['0'].ssrInReservation.subjectToAvailability) {
        this.cleanDataService();
        this.messageGlobalService.showErrorMessageList('warning', 'Boleto con servicio especial en reserva. Manejo manual', data.reservationsInfo['0'].ssrInReservation.ssrList);
        this.reportingCommon.insertResultTicketAndReservation(data, 'Tiquete servicio especial no procesable');
        return false;
      }
    }

    if (data.currencyTicket === null || data.currencyTicket === '') {
      this.cleanDataService();
      this.messageGlobalService.showErrorMessage('warning','El tiquete requiere reexpedición manual');
      this.reportingCommon.insertResultTicketAndReservation(data, 'Tiquete no procesable');
      return false;
    }

    return true;
  }

  getBonus() {
    this.reportingCommon.updateSearchStateTicket('Consulta iniciada');
    this.reportingCommon.updateSearchStateTicket('Solicitud consulta de bono');

    let params = {
      "conversationId": sessionStorage.getItem('chatID'),
      "idItem": JSON.parse(localStorage.getItem('dataTicketOrigin')).idRedisCache,
      "validationType": this.localBonus[0].description
    };

    this.apiService.getBonus(params).subscribe((res: ResultModel) => {
      this.dataGlobalService.loading = false;

      if (res.isSuccess) {
        this.reportingCommon.updateSearchStateTicket('Bono aplica');
        this.dataGlobalService.dataBonus = res.data;
        this.dataGlobalService.passengersBonusInfo = res.data.passengersBonusInfo;

        this.dataGlobalService.data.couponInfoGroup.forEach(element => {
            element.isSelect = true;
        });

        this.router.navigateByUrl('/main');
      } else {
        this.reportingCommon.updateSearchStateTicket('Bono no aplica');
        this.showMessageNoBonus();
      }
    }, () => {
      this.dataGlobalService.loading = false;
      this.showMessageNoBonus();
    });
  }

  showMessageNoBonus() {
    this.reportingCommon.updateSearchStateTicket('Bono no aplica');

    Swal.fire({
      title: "¿ Desea continuar como cambio voluntario ?",
      text: "El tiquete consultado no aplica las condiciones del Bono por cancelación",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#df0817',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Confirmar'
    }).then((result) => {
      if (result.value) {
        this.dataGlobalService.isBonus = false;
        this.dataGlobalService.stepBonus = true;
        this.router.navigateByUrl('/main');
      } else {
        this.cleanDataService();
      }
    });
  }
}
