import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Contact } from '../../models/contact';
import { ApiService } from '../../services/api.service';
import { ResultModel } from '../../models/resultModel';
import Swal from 'sweetalert2';
import { DataGlobalService } from '../../services/data.services/data-global.service';
import { Router } from '@angular/router';
import { ReportingCommon } from '../../commons/reporting';
import { MessageGlobalService } from '../../services/data.services/message-global.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.less']
})
export class ContactComponent implements OnInit {
  public email:string = "";
  public iataMobile: string = 'IATA Ciudad';
  public iataFixed: string = 'IATA Ciudad';
  public listIataMobile: any;
  public listIataFixed: any;
  public mobileIndicative:string = "";
  public fixedIndicative:string  = "";
  public mobileNumber:string = "";
  public fixedNumber:string = "";
  public contact:Contact ;
  public disabledFixed :boolean = true;
  @Output() selectTab =  new EventEmitter<any>();



  constructor(
    private apiService: ApiService,
    public dataGlobalService: DataGlobalService,
    private router: Router,
    private reportingCommon : ReportingCommon,
    public messageGlobalService:MessageGlobalService
    ) { }

  ngOnInit() {
      this.listIataMobile = this.dataGlobalService.iata;
      this.listIataFixed = this.dataGlobalService.iata;
  }

  saveContact(){
    this.dataGlobalService.loading = true;
    if (this.validateFields()) {
      let listContact:Contact[]=[];
      this.contact = new Contact();
      this.contact.typeContact= "Movil";
      this.contact.iata = this.iataMobile;
      this.contact.indicative = this.mobileIndicative;
      this.contact.number = this.mobileNumber;

      listContact.push(this.contact);

      if (!this.disabledFixed) {
        this.contact = new Contact();
        this.contact.typeContact= "Phone";
        this.contact.iata = this.iataFixed;
        this.contact.indicative = this.fixedIndicative;
        this.contact.number = this.fixedNumber;
        listContact.push(this.contact);
      }

      let params= {
          "conversationId" : sessionStorage.getItem('chatID'),
          "email" : this.email,
           "contact":listContact
      };

      this.apiService.postCreateReservation(params).subscribe((resReservation:ResultModel)=>
      {
        this.dataGlobalService.loading = false;

        if (resReservation.isSuccess) {

          Swal.fire({
            title: 'Necesita crear TSA?',
            text: "Oprima Si, si la reserva necesita crear TSA!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#6c757d',
            cancelButtonColor: '#df0817',
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
          }).then((result) => {
            if (result.value) {
              this.selectTab.emit(6);

            } else {
              this.dataGlobalService.loading = true;
              this.documentReservation();
            }
          });
        }else{
          this.messageGlobalService.showErrorMessage('warning', 'No fue posible registrar el contacto, por favor intente nuevamente');
        }
      },
      () => {
        this.messageGlobalService.showErrorMessage('error', 'Ocurrio un error guardando los datos del contacto');
      });
    }
 }

 validateFields(): boolean{

  let iataMobile: any = document.getElementById('selectMobile');
  let iataFixed: any = document.getElementById('selectFixed');

  if (this.email === "") {
    this.messageGlobalService.showErrorMessage('warning', 'El campo Email es requerido')
    return false;
  }

  if (iataMobile.selectedIndex  === 0) {
    this.messageGlobalService.showErrorMessage('warning','Se debe seleccionar un IATA Movil válido')
    return false;
  }

  if (this.mobileIndicative.trim()  === "") {
    this.messageGlobalService.showErrorMessage('warning','El campo Indicativo Movil es requerido')
    return false;
  }

  if (this.mobileNumber.trim()  === "") {
    this.messageGlobalService.showErrorMessage('warning','El campo Número Movil es requerido')
    return false;
  }
  if (!this.disabledFixed) {
    if (iataFixed.selectedIndex  === 0) {
      this.messageGlobalService.showErrorMessage('warning', 'Se debe seleccionar un IATA Fijo válido')
      return false;
    }

    if (this.fixedIndicative.trim()  === "") {
      this.messageGlobalService.showErrorMessage('warning','El campo Indicativo Fijo es requerido')
      return false;
    }

    if (this.fixedNumber.trim()  === "") {
      this.messageGlobalService.showErrorMessage('warning','El campo Número Fijo es requerido')
      return false;
    }
  }

  return true;
 }

 selectFixed(){
  this.disabledFixed = !this.disabledFixed;
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

numberOnly(event): boolean {
  const charCode = (event.which) ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;

}
}
