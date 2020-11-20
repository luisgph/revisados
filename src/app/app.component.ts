import { Component } from '@angular/core';
import { DataGlobalService } from './services/data.services/data-global.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
  // styleUrls: ['./app.component.less']
})
export class AppComponent{

  
    constructor(  public dataGlobalService:DataGlobalService) {

}

}
