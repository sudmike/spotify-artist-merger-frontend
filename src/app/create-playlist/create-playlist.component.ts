import { Component, OnInit, ViewChild } from '@angular/core';
import { Artist } from '../shared/artist.model';
import { ArtistOutputComponent } from './artist-output/artist-output.component';
import { SpotifyWebService } from '../spotify-web.service';

@Component({
  selector: 'app-create-playlist',
  templateUrl: './create-playlist.component.html',
})
export class CreatePlaylistComponent implements OnInit {
  @ViewChild(ArtistOutputComponent, {static: false}) outputTable: ArtistOutputComponent;

  onArtistInputTriggered(artistName: string): void {
    console.log('Original Input: ', artistName);

    this.spotifyService.checkArtist(artistName)
      .then(data => {
        console.log(data);
        const dataSafe = data as {artistName: string, imageURL: string};
        this.outputTable.addArtist(new Artist(dataSafe.artistName , dataSafe.imageURL));
      })
  .catch(err => {
      console.log(err);
    });
  }

  constructor(private spotifyService: SpotifyWebService) {  }

  ngOnInit(): void {
  }
}

