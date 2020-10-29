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


  async checkArtist(artist): Promise<string|Error> {
    // artist input field left empty
    if (artist === undefined || artist === '') { return Promise.reject(Error('Input Field left empty')); }

    // search Spotify with user input and return correct name of artist if resolved and error if rejected
    return this.spotifyApi.searchArtists(artist, {limit: 1, offset: 0})
      .then(data => {
        if (data.artists.items.length === 0){
            /*return Artist Not Found Error*/
            return Promise.reject(Error ('Could not find Artist'));
          }
          else{
             return getThisIsPlaylistId(this.spotifyApi, data.artists.items[0].name, true)
              .then(() => {
                return data.artists.items[0].name; // return correct name of artist
              })
              .catch(err => {
                return Promise.reject(err);
              });
          }
      })
      .catch(err => {
        // return artist fetch error
        return Promise.reject(err);
      });
  }

  constructor() { }
}

/* Private Functions */
// tslint:disable-next-line:max-line-length
async function getThisIsPlaylistId(spotifyApi: SpotifyWebApi.SpotifyWebApiJs, artist: string, check: boolean = false): Promise<string|Error>{
  return spotifyApi.searchPlaylists('This Is ' + artist, {limit: 1, offset: 0})
    .then(data => {
      if (check){ // check that owner of This Is playlist is spotify
        if (data.playlists.items[0].owner.id !== 'spotify'){
          /*return Missing Artist Page Error redirect */ // better check in the beginning
          return Promise.reject(Error ('Artist does not have a \'This is\' Playlist'));
        }
      }
      return data.playlists.items[0].id; // return Playlist ID
    })
    .catch(() => {
      /*return Artist Page Retrieval error redirect*/
      return Promise.reject(Error ('Could not find Artists Spotify Page'));
    });
}
