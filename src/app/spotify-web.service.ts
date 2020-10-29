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
    if (artist === undefined || artist === '') { return Error('Artist Field Left Empty'); }

    // search Spotify with user input and return correct name of artist if resolved and error if rejected
    return this.spotifyApi.searchArtists(artist, {limit: 1, offset: 0})
      .then(data => {
        console.log('Data of searchArtist: ', data);
        if (data.artists.items.length === 0){
            /*return Artist Not Found Error*/
            return Error ('Could not find Artist');
          }
          else{
             return getThisIsPlaylistId(this.spotifyApi, data.artists.items[0].name)
              .then(() => {
                console.log('NAME BEFORE RETURN: ', data.artists.items[0].name);
                return data.artists.items[0].name; // return correct name of artist
              })
              .catch(err => {
                return err;
              });
          }
      })
      .catch(() => {
        // return artist fetch error
        return Error('Could not fetch Artist from Spotify');
      });
  }

  constructor() { }
}

/* Private Functions */
async function getThisIsPlaylistId(spotifyApi: SpotifyWebApi.SpotifyWebApiJs, artist: string): Promise<string|Error>{
  return spotifyApi.searchPlaylists('This Is ' + artist, {limit: 1, offset: 0})
    .then(data => {
      console.log('Data from searchPlaylist: ', data);
      if (data.playlists.items[0].owner.id !== 'spotify'){
        /*return Missing Artist Page Error redirect */ // better check in the beginning
        return Error ('Could not find the artists Spotify page');
      }
      else{ // passed all checks
        return data.playlists.items[0].id; // return Playlist ID
      }
    })
    .catch(() => {
      /*return Artist Page Retrieval error redirect*/
      return Error ('Could not find the artists Spotify page');
    });

}
