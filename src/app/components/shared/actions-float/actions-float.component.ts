import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ConversationService } from '../../../services/http.services/conversation.service';
import { DataGlobalService } from '../../../services/data.services/data-global.service';
import { ResultModel } from '../../../models/resultModel';

@Component({
  selector: 'app-actions-float',
  templateUrl: './actions-float.component.html',
  styleUrls: ['./actions-float.component.less']
})
export class ActionsFloatComponent implements OnInit {

  public ctr:any;

  constructor(
    private router: Router,
    private conversationService : ConversationService,
    public dataGlobalService: DataGlobalService,

  ) { }

  ngOnInit() {

  }


  clean() {
    Swal.fire({
      title: "¿ Estás seguro ?",
      text: "¡De limpiar e ignorar todos los cambios realizados!",
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
    this.dataGlobalService.userNotes = [];
    this.conversationService.getIgnoreChanges({ 'conversationId': conversationId }).subscribe(
      () => {
        this.conversationService.getCloseConversation({ 'Conversation_Id': conversationId }).subscribe(
          () => {
            this.dataGlobalService.loading = false;
            this.router.navigateByUrl('/search-ticket');
          }
        );
    }, () => {
      this.conversationService.getCloseConversation({ 'Conversation_Id': conversationId }).subscribe(
        () => {
          this.dataGlobalService.loading = false;
          this.router.navigateByUrl('/search-ticket');
        }
      );
    });
  }
}
