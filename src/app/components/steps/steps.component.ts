import { Component, OnInit, ViewChild } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap';
import { TariffsComponent } from '../tariffs/tariffs.component';
import { DataGlobalService } from '../../services/data.services/data-global.service';
import { SummaryComponent } from '../summary/summary.component';
import { _ } from 'underscore';

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.less']
})
export class StepsComponent implements OnInit {
  @ViewChild('staticTabs', { static: true }) staticTabs: TabsetComponent;
  @ViewChild('tariffsComponent', { static: true }) tariffsComponent: TariffsComponent;
  @ViewChild('summaryComponent', { static: true }) summaryComponent: SummaryComponent;

  constructor(public dataGlobalService: DataGlobalService) {
  }

  ngOnInit() {
    let i = 0;

    this.staticTabs.tabs.forEach(tab => {
      if (i != 0) {
        tab.disabled = true;
      }


	    if (i === 7) {
        if (!this.dataGlobalService.stepBonus) {
          tab.disabled = false;
          tab.active = true;
        }else{
          tab.disabled = true;
          tab.active = false;
        }
      }
      i++;
    });
  }

  selectTab(tabId: any) {
    this.staticTabs.tabs[tabId].disabled = !this.staticTabs.tabs[tabId].disabled;
    this.staticTabs.tabs[tabId].active = true;


    if (tabId === 3) {
      this.dataGlobalService.fareBundles = [];
      this.staticTabs.tabs[tabId].disabled = false;
      this.staticTabs.tabs[tabId].active = true;

      this.dataGlobalService.isHistory = false;
      this.dataGlobalService.data.couponInfoGroup.forEach(element => {
        if (element.isSelect === undefined || element.isSelect === false) {
          this.dataGlobalService.isHistory = true;
        }
      });

      this.tariffsComponent.showData = null;

      if (JSON.parse(localStorage.getItem('dataTicketOrigin')).routeType !== 'INTERNACIONAL') {
        if (this.dataGlobalService.isHistory && this.dataGlobalService.existHistorical == false) {
          this.tariffsComponent.viewHistoryButton = false;
          this.tariffsComponent.history();
          return;
        }

        if (this.dataGlobalService.existHistorical) {
          this.tariffsComponent.viewHistoryButton = false;
          this.tariffsComponent.searchDataChangeTariff();
          return;
        }
      }

      this.tariffsComponent.viewHistoryButton = true;
      this.tariffsComponent.searchDataChangeTariff();
    }

    if (tabId === 4) {
      this.staticTabs.tabs[tabId].disabled = false;
      this.staticTabs.tabs[tabId].active = true;

      this.dataGlobalService.dataNewQuote = null;
      this.summaryComponent.fareSearch();
    }
  }

  disableOptionsQuotation() {
    this.staticTabs.tabs[3].disabled = true;
    this.staticTabs.tabs[4].disabled = true;
  }
}
