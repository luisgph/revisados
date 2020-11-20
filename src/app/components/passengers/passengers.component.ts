import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataGlobalService } from '../../services/data.services/data-global.service';
import { ReportingService } from '../../services/reporting.service';
import { ResultModel } from '../../models/resultModel';
import { _ } from 'underscore';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { MessageGlobalService } from '../../services/data.services/message-global.service';


@Component({
  selector: 'app-passengers',
  templateUrl: './passengers.component.html',
  styleUrls: ['./passengers.component.less']
})
export class PassengersComponent implements OnInit {

  public arrayLinePassenger: string[] = [];
  public disabledSelectPassenger: boolean = false;
  @Output() selectTab =  new EventEmitter<any>();

 constructor(
    public dataGlobalService: DataGlobalService,
    private reportingService: ReportingService,
    private apiService: ApiService,
    private router: Router,
    public messageGlobalService:MessageGlobalService
  ) {
   }

  ngOnInit() {
    this.dataGlobalService.linePassengerSelect = '';
  }

  selectButtonPassenger() {
    if(this.dataGlobalService.linePassengerSelect == '' || this.dataGlobalService.linePassengerSelect == undefined) {
      this.messageGlobalService.showErrorMessage('warning','Por favor seleccione uno o varios pasajeros');
      return;
    }

    this.dataGlobalService.loading=true;
    if (this.dataGlobalService.data.needNewReservation) {
      let passengersSelect = _.filter(this.dataGlobalService.passenger, function (item) { return item.selectPassenger == true; });
      let passengerList:any[]=[];

      passengersSelect.forEach(element => {
        let passenger={
          "lastName": element.passengerSurname,
          "name": element.passengerFirstName,
          "typePassenger": element.passengerType.substr(0,1)
        };
        passengerList.push(passenger);
      });

      let paramsNewReservation={
        "conversationId": sessionStorage.getItem('chatID'),
        "passenger": passengerList
      };

      this.apiService.postCreateTicketNewReservation(paramsNewReservation).subscribe((resReservation:ResultModel)=>
      {
        if (resReservation.isSuccess) {
          this.dataGlobalService.loading = false;
          this.dataGlobalService.passengerNewReservation = resReservation.data;
          this.dataGlobalService.disabledSegment = false;
          this.dataGlobalService.disabledSegmentCheckBox = true;
          this.disabledSelectPassenger = true;

          for (let i = 0; i < resReservation.data.length; i++) {
            if ( i ===  0) {
              this.dataGlobalService.linePassengerSelect = resReservation.data[i].passengerLine;
            } else {
              this.dataGlobalService.linePassengerSelect += ',' + resReservation.data[i].passengerLine ;
            }
          }

          this.dataGlobalService.data.couponInfoGroup.forEach(element => {
            if (element.validForChange) {
              element.isSelect = true;
            }else{
              element.isSelect = false;
            }
          });

          this.InsertPassengersSelect();
          this.selectTab.emit(1);
        }else{
          this.messageGlobalService.showErrorMessage('warning', 'No fue posible crear la nueva reserva, por favor intente nuevamente con el tiquete','/search-ticket');
          return;
        }
      }, () => {
        this.messageGlobalService.showErrorMessage('error', 'No fue posible crear la nueva reserva, por favor intente nuevamente con el tiquete','/search-ticket' );
        return;
      });
    }else{
      this.dataGlobalService.loading = false;
      this.dataGlobalService.disabledSegment = false;
      this.dataGlobalService.disabledSegmentCheckBox = false;
      this.disabledSelectPassenger = true;

      if (this.dataGlobalService.isBonus) {
        this.dataGlobalService.disabledSegmentCheckBox = true;
      }

      this.InsertPassengersSelect();
      this.selectTab.emit(1);
    }
  }

  InsertPassengersSelect() {
    let dataUser = JSON.parse(sessionStorage.getItem('user'));
    let dataTicketSearch = JSON.parse(localStorage.getItem("SystemStateTicket"));
    let passengersSelect = _.filter(this.dataGlobalService.passenger, function (item) { return item.selectPassenger == true; });

    let params = {
      UserId: dataUser.userid,
      TicketSearchId: dataTicketSearch.ticketSearchId,
      PassagerInformation: passengersSelect,
    }

    this.reportingService.insertPassengersSelect(params).subscribe(
      (res: ResultModel) => {
      }
    );
  }

  selectPassenger(data: any) {
    let line = data.passengerLine;
    data.selectPassenger = !data.selectPassenger;

    let linePassenger = this.arrayLinePassenger.find(linesPassenger => linesPassenger == line);
    if (linePassenger) {
      let index = this.arrayLinePassenger.indexOf(line);
      if (index !== -1) {
        this.arrayLinePassenger.splice(index, 1);
      }
    } else {
      this.arrayLinePassenger.push(line);
    }

    this.dataGlobalService.linePassengerSelect = '';
    this.dataGlobalService.countPassenger = 0;
    for (let i = 0; i < this.arrayLinePassenger.length; i++) {
      this.dataGlobalService.countPassenger++;
      if ((i + 1) == this.arrayLinePassenger.length) {
        this.dataGlobalService.linePassengerSelect += this.arrayLinePassenger[i];
      } else {
        this.dataGlobalService.linePassengerSelect += this.arrayLinePassenger[i] + ',';
      }
    }

    if (this.dataGlobalService.passenger.length == this.dataGlobalService.countPassenger) {
      this.dataGlobalService.isTotalPassenger = true;
    } else {
      this.dataGlobalService.isTotalPassenger = false;
    }
  }

  selectAllPassenger(){
    this.dataGlobalService.passenger.forEach(element => {
      this.selectPassenger(element);
    });
  }
}
