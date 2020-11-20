import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AvailabilitiesService } from '../../services/availabilities.service';
import { DataGlobalService } from '../../services/data.services/data-global.service';
import { ResultModel } from '../../models/resultModel';
import { MessageGlobalService } from '../../services/data.services/message-global.service';

@Component({
  selector: 'app-coupons-confirmed-change',
  templateUrl: './coupons-confirmed-change.component.html',
  styleUrls: ['./coupons-confirmed-change.component.less']
})
export class CouponsConfirmedChangeComponent implements OnInit {

  public showCouponsConfirmed : boolean;
  @Output() cleanAndDesabledOptions =  new EventEmitter<any>();

  constructor(
    private apiAvailability: AvailabilitiesService,
    public dataGlobalService: DataGlobalService,
    public messageGlobalService: MessageGlobalService
  ) { }

  ngOnInit() {
  }

  cancelFlightAvailable(item: any) {

    this.dataGlobalService.loading = true;
    this.cleanAndDesabledOptions.emit();
    let flightHistoryId = localStorage.getItem('flightHistoryId');

    if (flightHistoryId === "null")
      flightHistoryId = null;

    let params = {
      "conversationId": sessionStorage.getItem('chatID'),
      "flightHistoryId": flightHistoryId,
      "journey": item
    }

    this.apiAvailability.postCancelConfirmAvailability(params).subscribe((res: ResultModel) => {
      this.dataGlobalService.loading = false;
      if (!res.isSuccess) {
        this.messageGlobalService.showErrorMessage('warning', res.returnMessage);
        return;
      }
      this.dataGlobalService.serviceArrayFlightAvailable = res.data.journeysDetail;

    }, () => {
       this.messageGlobalService.showErrorMessage('error', 'Ocurrió un error eliminando el vuelo disponible, por favor intente nuevamente');
    });
  }

  showDetailsTrayect(item: any) {
    item.showDetails = !item.showDetails;
  }

  selectBundle(item:any,event:any){

    item.bundle = event.target.value;

    switch (event.target.value) {
      case 'XS':
        item.classBundle = 'bundleXS';
        break;
      case 'S':
        item.classBundle = 'bundleS';
        break;
      case 'M':
        item.classBundle = 'bundleM';
        break;
      case 'L':
        item.classBundle = 'bundleL';
        break;
      case 'XL':
        item.classBundle = 'bundleXL';
        break;
      case 'XXL':
        item.classBundle = 'bundleXXL';
        break;
      default:
        item.classBundle = '';
        item.bundle = '';
        break;
    }
  }
}
