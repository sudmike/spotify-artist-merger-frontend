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
        if ( // returns true if artist was added
          this.outputTable.addArtist(new Artist(data.artistName , data.imageURL, data.playlistID))
        ) {
          console.log(data);
        }
        else {
          this.errorMessage.setError('Artist was already added! The artist you want to add is already included.');
        }
      })
  .catch(err => {
      this.errorMessage.setError((err as Error).message);
    });
  }


  onSubmit(): void{
    const inputResult = this.outputTable.submitArtists();
    if (this.outputTable.submitEligibility.eligible){
      this.spotifyService.generatePlaylist(inputResult.artistNames, inputResult.playlistIDs)
        .then(r => { console.log(r); } )
        .catch(err => { console.log(err); });
    }
    else {
      this.errorMessage.setError(this.outputTable.submitEligibility.errorText);
    }
  }

  ngOnInit(): void {
  }
}

