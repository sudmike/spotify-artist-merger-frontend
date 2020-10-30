import {Component, OnInit, ViewChild} from '@angular/core';
import {Artist} from '../shared/artist.model';
import {ArtistOutputComponent} from './artist-output/artist-output.component';

@Component({
  selector: 'app-create-playlist',
  templateUrl: './create-playlist.component.html',
})
export class CreatePlaylistComponent implements OnInit {
  @ViewChild(ArtistOutputComponent, {static: false}) outputTable: ArtistOutputComponent;

  ngOnInit(): void {
  }
  onArtistInputTriggered(artistName: string): void{
    console.log(artistName);
    this.outputTable.addArtist(new Artist(artistName, 'https://www.klatsch-tratsch.de/wp-content/uploads/2019/10/drake-2.jpg'));
  }
}
