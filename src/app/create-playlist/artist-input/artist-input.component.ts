import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Artist } from '../../shared/artist.model';

@Component({
  selector: 'app-artist-input',
  templateUrl: './artist-input.component.html',
})
export class ArtistInputComponent implements OnInit {
  artistName: string;
  @Output() artistSubmitEvent = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  onBtnClick(): void{
    this.artistSubmitEvent.emit(this.artistName);
    this.artistName = '';
  }

}
