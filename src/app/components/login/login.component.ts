import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { TokenService } from '../../services/token.service';
import { ApiService } from '../../services/api.service';
import { ResultModel } from '../../models/resultModel';
import { DataGlobalService } from '../../services/data.services/data-global.service';
import { _ } from 'underscore';
import { MessageGlobalService } from '../../services/data.services/message-global.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  public password: string;
  public flagSite: boolean;
  public user: string;
  public site: string;
  public listSite: any;
  public conversationId: string;

  constructor(
    private router: Router,
    private tokenServices: TokenService,
    private apiService: ApiService,
    public dataGlobalService:DataGlobalService,
    public messageGlobalService:MessageGlobalService
  ) {
    this.conversationId = sessionStorage.getItem('chatID');
    localStorage.clear();
    sessionStorage.clear();
    this.flagSite = true;
    this.GenerateTokenAplication();
  }

  ngOnInit() {
    this.determineLocalIp();
  }

  GenerateTokenAplication() {
    this.dataGlobalService.loading = true;
    this.tokenServices.getToken().subscribe(
      (res: ResultModel) => {
        if (res.isSuccess) {
          localStorage.setItem('Authorization', res.data.accessToken);
          this.getSitesAplication();
          this.getValidationSettings();
          this.closeConversation();
        }
      }
    , () => {
      this.dataGlobalService.loading = false;
    });
  }

  getSitesAplication() {
    this.apiService.getSite().subscribe((res: ResultModel) => {
      this.dataGlobalService.loading = false;

      if (res.isSuccess) {
        this.listSite = res.data;
      } else {
        this.messageGlobalService.showErrorMessage('error', 'Ocurrio un error consultando los sitios')
      }
    }, () => {
      this.messageGlobalService.showErrorMessage('error', 'Ocurrio un error consultando los sitios')
    });
  }

  login() {
    let body = {
      "siteName": this.site,
      "userName": this.user,
      "password": this.password
    };

    this.dataGlobalService.loading = true;
    this.apiService.postLogin(body).subscribe((res: ResultModel) => {

      if (res.isSuccess) {
        sessionStorage.setItem('user', JSON.stringify(res.data));
        this.dataGlobalService.userName = `${res.data.firstname} ${res.data.lastname}!`;
        this.dataGlobalService.loading = false;

        this.router.navigateByUrl('/search-ticket');
      } else {
        let message;
        if (res.returnMessage == 'Wrong user or password') {
          message = 'Usuario o contraseña incorrecta';
        } else {
          message = 'Usuario no autorizado';
        }
        this.user = '';
        this.password = '';
        this.messageGlobalService.showErrorMessage('warning', message);
      }
    }, () => {
        this.messageGlobalService.showErrorMessage('error', 'No fue posible la autenticación del usuario');
    })
  }

  closeConversation() {
    if (this.conversationId != null && this.conversationId != "null") {
      let params = {
        "conversationId":this.conversationId
      }

      let paramsClose = {
        "Conversation_Id":this.conversationId
      }

      this.apiService.getIgnoreChanges(params).subscribe(() => {
        this.apiService.getCloseConversation(paramsClose).subscribe(() => {
        });
      }, () => {
        this.apiService.getCloseConversation(paramsClose).subscribe(() => {
        });
      });
    }
  }

  private determineLocalIp() {
    this.apiService.ipServices().subscribe((res: any) => {
      sessionStorage.setItem('LOCAL_IP', res.ip);
    });
  }

  getValidationSettings(){
    this.apiService.getValidationSettings().subscribe((res : ResultModel) => {
      if (res.isSuccess) {
        localStorage.setItem('validations',JSON.stringify(res.data) );
      }else{
        this.dataGlobalService.loading = false;
      }
    }, () => {
      this.dataGlobalService.loading = false;
    });
  }
}
