import {Component, OnInit} from '@angular/core';
import {Artist} from '../../shared/artist.model';

@Component({
  selector: 'app-artist-output',
  templateUrl: './artist-output.component.html'
})
export class ArtistOutputComponent implements OnInit {
  artists: Artist[] = [];

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
    const artistNames: string[] = [];
    for (const artist of this.artists){
      artistNames.push(artist.name);
    }
    this.artists = [];
    return artistNames;
  }
}
