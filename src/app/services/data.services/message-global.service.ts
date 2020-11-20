import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DataGlobalService } from './data-global.service';

@Injectable({
  providedIn: 'root'
})
export class MessageGlobalService {

    constructor(private router: Router,public dataGlobalService: DataGlobalService ) { }

  showErrorMessage(icon:any, message: any, page?:string) {
    this.dataGlobalService.loading = false;
    Swal.fire({
      allowOutsideClick: false,
      icon: icon,
      text: message,
      confirmButtonColor: '#df0817',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.value) {
        if (page) {
          this.router.navigateByUrl(page);
        }
      }});
  }

  showErrorMessageList(icon:any,message: any, list: any) {

    this.dataGlobalService.loading = false;
    let table: string = '<table style="width: 100%;">';
    list.forEach(ssr => {
      table += '<tr><td>' + ssr + '</td></tr>';
    });
    table += '</table>';

    Swal.fire({
      allowOutsideClick: false,
      icon: icon,
      html: table,
      title: message,
      confirmButtonColor: '#df0817',
      confirmButtonText: 'Aceptar',
      width: '45%'
    });
  }

  showErrorMessageListBundles(icon:any,message: any, list: any) {
    this.dataGlobalService.loading = false;
    let table: string = '<table style="width: 100%;">';
    list.forEach(data => {
      table += `<tr><td> ${ data.departure } - ${ data.arrive }  </td></tr>`;
    });
    table += '</table>';

    Swal.fire({
      allowOutsideClick: false,

      icon: icon,
      html: table,
      titleText: message,
      confirmButtonColor: '#df0817',
      confirmButtonText: 'Aceptar',
      width: '45%'
    });
  }
}
