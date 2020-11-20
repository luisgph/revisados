import { Component, OnInit } from '@angular/core';
import { DataGlobalService } from '../../services/data.services/data-global.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.less']
})
export class NotesComponent implements OnInit {

  public showNotes : boolean;
  public noteText = "";
  constructor(
    public dataGlobalService: DataGlobalService
  ) 
  { 
  }

  ngOnInit() {
  }


  openNotes(){
    this.showNotes = !this.showNotes;
  }

  addNote(){
    this.dataGlobalService.userNotes.push(this.noteText);
    this.noteText = "";
  }

}
