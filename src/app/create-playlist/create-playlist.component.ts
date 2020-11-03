import { Component, OnInit, ViewChild } from '@angular/core';
import { Artist } from '../shared/artist.model';
import { ArtistOutputComponent } from './artist-output/artist-output.component';
import { SpotifyWebService } from '../spotify-web.service';
import { ErrorHandlingComponent } from './error-handling/error-handling.component';

@Component({
  selector: 'app-create-playlist',
  templateUrl: './create-playlist.component.html',
})

export class CreatePlaylistComponent implements OnInit {
  @ViewChild(ArtistOutputComponent, {static: false}) outputTable: ArtistOutputComponent;
  @ViewChild(ErrorHandlingComponent, {static: false}) errorMessage: ErrorHandlingComponent;

  constructor(private spotifyService: SpotifyWebService) {  }

  onArtistInputTriggered(artistName: string): void {
    this.spotifyService.checkArtist(artistName)
      .then(data => {
        console.log(data);
        const dataSafe = data; // as {artistName: string, imageURL: string};
        this.outputTable.addArtist(new Artist(dataSafe.artistName , dataSafe.imageURL));
      })
  .catch(err => {
      console.log(err);
      this.errorMessage.setError((err as Error).message);
    });
  }


  onSubmit(): void{
    this.spotifyService.generatePlaylistAndFill(this.outputTable.submitArtists())
      .then(r => { console.log(r); } )
      .catch(err => { console.log(err); });
  }

  ngOnInit(): void {
  }
}

