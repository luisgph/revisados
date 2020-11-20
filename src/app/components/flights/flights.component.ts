import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataGlobalService } from '../../services/data.services/data-global.service';
import Swal from 'sweetalert2';
import { MessageGlobalService } from '../../services/data.services/message-global.service';

@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.less']
})
export class FlightsComponent implements OnInit {

  public disableAvailability: boolean = true;
  public stepIndex: number = 0;
  @Output() selectTab = new EventEmitter<any>();
  @Output() disableOptions = new EventEmitter<any>();

  constructor(
    public dataGlobalService: DataGlobalService,
    public messageGlobalService: MessageGlobalService
  ) {
  }

  ngOnInit() {
  }

  isSuccessDatafligth(data: any) {
    this.disableAvailability = false;
    this.stepIndex = 1;
  }

  isSuccessCoupon() {
    this.disableAvailability = true;
    this.stepIndex = 0;
  }

  quoteFlight() {

    if (!this.dataGlobalService.isRebooking) {
      const bundleNoSelect = this.dataGlobalService.serviceArrayFlightAvailable.filter(x => x.bundle === '' || x.bundle === undefined);
      if (bundleNoSelect.length > 0) {
        this.messageGlobalService.showErrorMessageListBundles('warning', 'Se debe seleccionar el bundle para continuar con la cotización', bundleNoSelect);
        return;
      }
    }

    this.selectTab.emit(3);
  }

  cleanAndDesabledOptions() {
    if (this.dataGlobalService.fareBundles != null) {
      this.dataGlobalService.fareBundles = null;
      this.disableOptions.emit();
    }
  }

  handleChange(e) {
    this.stepIndex = e.index;
  }

  isRebooking() {
    this.dataGlobalService.disabledBundles = !this.dataGlobalService.disabledBundles;

    for (let index = 0; index < this.dataGlobalService.serviceArrayFlightAvailable.length; index++) {
      this.dataGlobalService.serviceArrayFlightAvailable[index].classBundle = '';
      this.dataGlobalService.serviceArrayFlightAvailable[index].bundle = '';

      let bundle: any = document.getElementById(`bundle${index}`);
      bundle.selectedIndex = 0;
    }
  }
}
