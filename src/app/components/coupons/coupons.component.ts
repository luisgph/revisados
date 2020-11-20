import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { _ } from 'underscore';
import { DataGlobalService } from '../../services/data.services/data-global.service';
import { MessageGlobalService } from '../../services/data.services/message-global.service';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.less']
})
export class CouponsComponent implements OnInit {

  @Output() selectTab =  new EventEmitter<any>();

  constructor(public dataGlobalService: DataGlobalService, public messageGlobalService:MessageGlobalService) { }


  ngOnInit() {
  }

  showDetailsTrayect(item : any ){
    item.showDetails = !item.showDetails;
  }


  onSelectTrayect(item : any ){
      item.isSelect = !item.isSelect;

  }
  selectAllCoupons(){

    if (this.dataGlobalService.data.couponInfoGroup.every(val => val.isSelect == true))
      this.dataGlobalService.data.couponInfoGroup.forEach(val => { val.isSelect = false });
    else
      this.dataGlobalService.data.couponInfoGroup.forEach(val => { val.isSelect = true });
  }

  selectCoupons(){
    let isSelectCoupon = false;
    this.dataGlobalService.data.couponInfoGroup.forEach(element => {
      if (element.isSelect) {
        isSelectCoupon = true;
      }
    });

    if (!isSelectCoupon) {
      this.messageGlobalService.showErrorMessage('warning', 'Se debe seleccionar al menos un boleto para realizar la búsqueda de vuelos');
      return;
    }

    this.dataGlobalService.disabledSegment=true;
    this.dataGlobalService.disabledSegmentCheckBox = true;

    this.dataGlobalService.data.couponInfoGroup.forEach(val => {
      if (val.validForChange ===false) {
        val.isSelect = false
      }
    });

    this.selectTab.emit(2);
  }
}
