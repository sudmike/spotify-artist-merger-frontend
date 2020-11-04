import {Component, OnInit} from '@angular/core';
import {Artist} from '../../shared/artist.model';

@Component({
  selector: 'app-artist-output',
  templateUrl: './artist-output.component.html'
})
export class ArtistOutputComponent implements OnInit {
  artists: Artist[] = [];
  submitEligibility: {eligible: boolean, errorText: string};

  constructor() {}

  ngOnInit(): void {}

  addArtist(newArtist: Artist): boolean { // returns true if newArtist added
    for (const compareArtist of this.artists){ // check if already included
      if (compareArtist.name === newArtist.name){ return false; }
    }
    this.artists.push(newArtist);
    return true;
  }

  submitArtists(): string[]{
    // Check that there are at least two artists
    if (this.artists.length >= 2){ this.submitEligibility = {eligible: true, errorText: ''}; }
    else {
      this.submitEligibility =
      {eligible: false, errorText: 'Not enough artists! You need at least two artists to create a playlist.'};
      return [];
    }

    const artistNames = this.artists.map(a => a.name);
    this.artists = [];
    return artistNames;
  }
}
