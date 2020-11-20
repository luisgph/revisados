import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { _ } from 'underscore';

@Component({
  selector: 'app-trayects-and-coupons',
  templateUrl: './trayects-and-coupons.component.html',
  styleUrls: ['./trayects-and-coupons.component.less']
})
export class TrayectsAndCouponsComponent implements OnInit {

  @Input() data : any;
  @Input() reservationsActive : boolean;
  @Input() disabledSegment : boolean;
  @Output() OnSelectCoupon = new EventEmitter;

  constructor() { }

  ngOnInit() {
    if(!this.reservationsActive){
      _.each(this.data,function(item){
        item.isSelect = true;
        item.disabledSegment = true;
      });
    }
  }

  showDetailsTrayect(item : any ){
    item.showDetails = !item.showDetails;
  }


  onSelectTrayect(item : any ){
      item.isSelect = !item.isSelect;
      this.OnSelectCoupon.emit();
  }
}
