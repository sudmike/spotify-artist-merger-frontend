import {Component, Input, OnInit} from '@angular/core';
import {Artist} from '../../shared/artist.model';

@Component({
  selector: 'app-artist-output',
  templateUrl: './artist-output.component.html'
})
export class ArtistOutputComponent implements OnInit {
  artists: Artist[] = [
    new Artist('drake', 'https://www.klatsch-tratsch.de/wp-content/uploads/2019/10/drake-2.jpg')
  ];
  random: string[] = ['https://www.klatsch-tratsch.de/wp-content/uploads/2019/10/drake-2.jpg', 'https://media.resources.festicket.com/image/300x300/center/top/filters:quality(70)/www/artists/JCole_hX9yvF7.jpg', 'https://ais.rtl.de/masters/1269695/1686x0/QG4CPQ7VF6PR37L6EAO3IHMJ2I.jpg'];

  constructor() {
  }

  ngOnInit(): void {
  }

  addArtist(artist: Artist): void {
    this.artists.push(artist);
  }

  sdg(): void {
    console.log('sdg');
  }
}
