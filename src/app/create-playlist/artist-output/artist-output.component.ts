import {Component, Input, OnInit} from '@angular/core';
import {Artist} from '../../shared/artist.model';

@Component({
  selector: 'app-artist-output',
  templateUrl: './artist-output.component.html'
})
export class ArtistOutputComponent implements OnInit {
  artists: Artist[] = [];

  constructor() {
  }

  ngOnInit(): void {
  }

  addArtist(artist: Artist): void {
    this.artists.push(artist);
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
