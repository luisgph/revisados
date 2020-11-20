import { Component, OnInit } from '@angular/core';
import { DataGlobalService } from '../../services/data.services/data-global.service';
import { ApiService } from '../../services/api.service';
import { ResultModel } from '../../models/resultModel';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ReportingCommon } from '../../commons/reporting';
import { _ } from 'underscore';
import { MessageGlobalService } from '../../services/data.services/message-global.service';


@Component({
  selector: 'app-tsa',
  templateUrl: './tsa.component.html',
  styleUrls: ['./tsa.component.less']
})
export class TsaComponent implements OnInit {

  constructor(public dataGlobalService: DataGlobalService,
    private apiService: ApiService,
    private router: Router,
    private reportingCommon : ReportingCommon,
    public messageGlobalService:MessageGlobalService
    ) { }

  ngOnInit() {
  }

  saveTSA(){
    this.dataGlobalService.loading = true;
    let listPassenger:any[] = [];

    this.dataGlobalService.passengerNewReservation.forEach(element => {
      let passenger:any ={};
      passenger.firstName = element.passengerFirstName;
      passenger.secondName = element.secondName;
      passenger.lastName = element.passengerSurname;
      passenger.gender = element.gender;
      passenger.birthDay = element.birthDay;
      passenger.line = +element.passengerLine;

      listPassenger.push(passenger);
    });

    if (!this.validateTSA(listPassenger)) {
      this.messageGlobalService.showErrorMessage('warning', 'Uno o varios campos del formulario faltan por diligenciar')
      return;
    }

    let params={
      "conversationId": sessionStorage.getItem('chatID'),
      "passenger": listPassenger
    }

    this.apiService.postCreateTSA(params).subscribe((res:ResultModel)=>
    {
      if (res.isSuccess) {
        this.documentReservation();
      }else{
        this.messageGlobalService.showErrorMessage('warning', 'No fue posible guardar la TSA');
      }
    },
    () => {
      this.messageGlobalService.showErrorMessage('error', 'Ocurrio un error guardando la TSA');
    });
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
          this.messageGlobalService.showErrorMessage('warning','No fue posible guardar los cambios en la reserva, por favor intente nuevamente');
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

  validateTSA(listPassenger:any[]){
    let validBirthDay = _.filter(listPassenger, function (item) { return item.birthDay != undefined && item.birthDay.trim() != '' });
    let validGender = _.filter(listPassenger, function (item) { return item.gender != undefined && item.gender.trim() != '' });
    let validFirstName = _.filter(listPassenger, function (item) { return item.firstName != undefined && item.firstName.trim() != '' });
    let validLastName = _.filter(listPassenger, function (item) { return item.lastName != undefined && item.lastName.trim() != '' });

    if (validBirthDay.length === listPassenger.length && validGender.length === listPassenger.length && validFirstName.length === listPassenger.length && validLastName.length === listPassenger.length) {
      return true;
    }
    return false;
  }
}
