import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataGlobalService } from '../../../services/data.services/data-global.service';
import { ConversationService } from '../../../services/http.services/conversation.service';
import { ResultModel } from '../../../models/resultModel';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.less']
})
export class ToolbarComponent implements OnInit {

  constructor(private router: Router,  public dataGlobalService: DataGlobalService,  private conversationService : ConversationService) { }

  public callName : string = "";
  public numberTicket : string = "";
  public countryTicket :string = "";

  ngOnInit() {

    this.numberTicket = (this.dataGlobalService.ticketNumber != '') ? this.dataGlobalService.ticketNumber : null;
    this.callName = (localStorage.getItem("callerName")) ?localStorage.getItem("callerName") : null ;
    this.countryTicket = (this.dataGlobalService.countryTicket != '') ? this.dataGlobalService.countryTicket : null;
  }

  logOut(){
      if (sessionStorage.getItem('chatID') != "null") {
        this.dataGlobalService.loading = true;
        let conversationId = sessionStorage.getItem('chatID');
        this.dataGlobalService.userNotes = [];
        this.conversationService.getIgnoreChanges({ 'conversationId': conversationId }).subscribe(
          () => {
            this.conversationService.getCloseConversation({ 'Conversation_Id': conversationId }).subscribe(
              () => {
                this.dataGlobalService.loading = false;
              }
            );
        }, () => {
          this.conversationService.getCloseConversation({ 'Conversation_Id': conversationId }).subscribe(
            () => {
              this.dataGlobalService.loading = false;
            }
          );
        });
      }



    this.dataGlobalService.data = null;
    this.dataGlobalService.ticketNumber = "";
    this.dataGlobalService.callName = "";
    this.dataGlobalService.countryTicket = "";
    this.dataGlobalService.flightOption =[];
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigateByUrl('/login');
  }

}
