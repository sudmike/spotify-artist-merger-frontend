import { Injectable } from '@angular/core';
import SpotifyWebApi from 'spotify-web-api-js';

@Injectable({
  providedIn: 'root'
})

export class SpotifyWebService {
  spotifyApi = new SpotifyWebApi();

  setAccessToken(accessToken: string): void{
    this.spotifyApi.setAccessToken(accessToken);

    console.log('Access Token Set');
  }

  constructor() { }
}
