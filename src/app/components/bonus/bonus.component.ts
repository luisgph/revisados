import { Component, OnInit } from '@angular/core';
import { DataGlobalService } from '../../services/data.services/data-global.service';

@Component({
  selector: 'app-bonus',
  templateUrl: './bonus.component.html',
  styleUrls: ['./bonus.component.less']
})
export class BonusComponent implements OnInit {

  constructor(public dataGlobalService: DataGlobalService) { }

  ngOnInit() {
  }

  showDetailsTrayect(item : any ){
    item.showDetails = !item.showDetails;
  }

}
