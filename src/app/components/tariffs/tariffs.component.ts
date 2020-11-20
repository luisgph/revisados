
import { Component, Output, EventEmitter } from '@angular/core';
import { TariffService } from '../../services/http.services/tariff.service';
import { ResultModel } from '../../models/resultModel';
import Swal from 'sweetalert2';
import { FaresService } from '../../services/fares.service';
import { DataGlobalService } from '../../services/data.services/data-global.service';
import { _ } from 'underscore';
import { ReportingCommon } from '../../commons/reporting';
import { MessageGlobalService } from '../../services/data.services/message-global.service';
@Component({
  selector: 'app-tariffs',
  templateUrl: './tariffs.component.html',
  styleUrls: ['./tariffs.component.less']
})
export class TariffsComponent {

  public dataTariffs: any;
  public showData: any;
  public fareTotalHistory: string;
  public fareTotalCurrencyHistory: string;
  public segmentsHistory: any;
  public taxesHistory: any;
  public fareCacheIdHistory: string;
  public viewHistory: boolean = false;
  public viewHistoryButton: boolean;
  @Output() selectTab = new EventEmitter<any>();

  constructor(
    private apiTariffService: TariffService,
    private apiFaresService: FaresService,
    public dataGlobalService: DataGlobalService,
    private reportingCommon : ReportingCommon,
    public messageGlobalService:MessageGlobalService
  ) {
    dataGlobalService.fareBundles = null;
  }

  searchDataChangeTariff() {

    let isAllFareCoupons = false;
    if (JSON.parse(localStorage.getItem('dataTicketOrigin')).routeType === 'INTERNACIONAL') {
      let validForChange = _.filter(this.dataGlobalService.data.couponInfoGroup, function (item) { return item.validForChange === false; });

      if (validForChange.length === 0) {
        isAllFareCoupons = true;
      }
    }

    this.viewHistory = false;
    this.dataGlobalService.loading = true;
    let params = {
      "conversationId": sessionStorage.getItem('chatID'),
      "currency": this.dataGlobalService.data.currencyTicket,
      "isReboking": this.dataGlobalService.isRebooking,
      "isPartialyUsed": this.dataGlobalService.data.isPartialyUsed,
      "ticketIdRedisCache": this.dataGlobalService.data.idRedisCache,
      "journeys": this.dataGlobalService.serviceArrayFlightAvailable,
      "isAllFareCoupons": isAllFareCoupons,
      "routeType": JSON.parse(localStorage.getItem('dataTicketOrigin')).routeType
    };

    this.reportingCommon.updateState('Cotización de cambio',null , null);
    this.apiTariffService.GetFareList(params).subscribe(
      (res: ResultModel) => {
        if (res.isSuccess && res.data.length > 0) {
          this.dataGlobalService.fareBundles = res.data;
          this.dataGlobalService.loading = false;

          if (this.dataGlobalService.fareBundles != null) {
            if (this.dataGlobalService.fareBundles.length  === 1) {
              this.dataGlobalService.isUniqueOption = true;
            }else{
              this.dataGlobalService.isUniqueOption = false;
            }
          }
        }else{
          this.messageGlobalService.showErrorMessage('warning', 'No fue posible realizar la cotizacion de bundles, por favor intente nuevamente');
        }
      },
      () => {
        this.messageGlobalService.showErrorMessage('error', 'Ocurrio un error al momento de realizar la cotizacion de bundles, por favor intente nuevamente');
      }
    );
  }

  onSelectTariff(element: any) {
    this.dataGlobalService.fareBundles.forEach(bundle => {
      bundle.isSelect = false;
    });
    element.isSelect = true;
    this.showData = element;
  }

  history() {
    this.dataGlobalService.loading = true;

    let coupons = _.filter(this.dataGlobalService.data.couponInfoGroup, function (item) { return item.isSelect; });

    let params = {
      "conversationId": sessionStorage.getItem('chatID'),
      "dateQuotation": JSON.parse(localStorage.getItem('dataTicketOrigin')).dateEmit,
      "currency": JSON.parse(localStorage.getItem('dataTicketOrigin')).currencyTicket,
      "flightInfoList": coupons,
      "iataCityCode":JSON.parse(localStorage.getItem('dataTicketOrigin')).countryTicket
    };

    this.apiFaresService.postHistoryFareBySegment(params).subscribe((res: ResultModel) => {
      if (!res.isSuccess || res.data == null) {
        this.messageGlobalService.showErrorMessage('warning', 'No fue posible consultar la información historica');
        return;
      }
      localStorage.setItem("historyFareCacheId",res.data.fareCacheId);
      this.dataGlobalService.existHistorical = true;
      this.fareTotalHistory = res.data.fareResult.fareTotal;
      this.fareTotalCurrencyHistory = res.data.fareResult.fareTotalCurrency;
      this.segmentsHistory = res.data.fareResult.segments;
      this.taxesHistory = res.data.fareResult.taxes;

      this.searchDataChangeTariff();

    }, () => {
      this.messageGlobalService.showErrorMessage('error', 'Ocurrió un error consultando el histórico, por favor intente nuevamente');
    });

  }

  historyButton(){
    this.viewHistory = true;
  }

  continueSteps() {
    this.selectTab.emit(4);
  }
}
