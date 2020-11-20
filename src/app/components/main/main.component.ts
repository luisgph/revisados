import { Component, OnInit, ViewChild } from '@angular/core';
import { DataGlobalService } from '../../services/data.services/data-global.service';
import { Router } from '@angular/router';
import { ConversationService } from '../../services/http.services/conversation.service';
import { ResultModel } from '../../models/resultModel';
import { StepsComponent } from '../steps/steps.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit {

  constructor(
    public dataGlobalService: DataGlobalService,
    private conversationService : ConversationService,
    private router: Router,
  ) { }


  ngOnInit() {

    if (this.dataGlobalService.data === null || this.dataGlobalService.data === undefined){
      this.dataGlobalService.data = JSON.parse(localStorage.getItem('dataTicketOrigin'));
      this.router.navigateByUrl('/search-ticket');
      return;
    }

    if (this.dataGlobalService.data.reservationsInfo != null) {
    if (this.dataGlobalService.data.reservationsInfo['0'].ssrInReservation.haveSsr) {
      this.showErrorMessageList('Boleto con servicio especial en reserva', this.dataGlobalService.data.reservationsInfo['0'].ssrInReservation.ssrList, 'Confirmar');
    }
  }
  }


  closeAll() {
    let conversationId = sessionStorage.getItem('chatID');
    sessionStorage.setItem('chatID', null);
    localStorage.setItem('dataTicketOrigin', null);
    localStorage.setItem('callerName', null);
    localStorage.setItem('flightHistoryId', null);


    this.conversationService.getIgnoreChanges({ 'conversationId': conversationId }).subscribe(
      () => {
        this.conversationService.getCloseConversation({ 'Conversation_Id': conversationId }).subscribe(
          () => {
            this.router.navigateByUrl('/search-ticket');
          }
        );
    }, () => {
      this.conversationService.getCloseConversation({ 'Conversation_Id': conversationId }).subscribe(
        () => {
          this.router.navigateByUrl('/search-ticket');
        }
      );
    });
  }

  showErrorMessageList(message: string, list: any, nameButton: string) {
    let table: string = '<table style="width: 100%;">';
    list.forEach(ssr => {
      table += '<tr><td>' + ssr + '</td></tr>';
    });
    table += '</table>';

    Swal.fire({
      allowOutsideClick: false,
      icon: 'warning',
      html: table,
      title: message,
      confirmButtonColor: '#df0817',
      confirmButtonText: nameButton,
      width: '45%'
    });
  }

}
