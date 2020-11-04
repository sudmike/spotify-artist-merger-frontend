import { Injectable } from '@angular/core';
import SpotifyWebApi from 'spotify-web-api-js';
import SpotifyWebApiJs = SpotifyWebApi.SpotifyWebApiJs;

@Injectable({
  providedIn: 'root'
})

export class SpotifyWebService {

  private spotifyApi = new SpotifyWebApi();

  setAccessToken(accessToken: string): void{
    this.spotifyApi.setAccessToken(accessToken);

    console.log('Access Token Set');
  }


  async checkArtist(artist): Promise<{artistName: string, imageURL: string, playlistID: string}> {
    // artist input field left empty
    if (artist === undefined || artist === '') { return Promise.reject(Error ('Input Field left empty! Try typing something in the input field and press enter.')); }

    // search Spotify with user input and return correct name of artist if resolved and error if rejected
    return this.spotifyApi.searchArtists(artist, {limit: 1, offset: 0})
      .then(data => {
        if (data.artists.items.length === 0){
            /*return Artist Not Found Error*/
            return Promise.reject(Error ('Could not find the Artist you searched for! Try a different artist.'));
          }
          else{
             return getThisIsPlaylistId(this.spotifyApi, data.artists.items[0].name)
              .then(pID => {
                return {artistName: data.artists.items[0].name, imageURL: data.artists.items[0].images[1].url, playlistID: pID};
              })
              .catch(err => {
                return Promise.reject(err);
              });
          }
      })
      .catch(err => {
        // return artist fetch error
        console.log('Error in spotify-web.service.ts', err);
        if (err instanceof Error) { return Promise.reject(err); } // forward error from .then
        else { return Promise.reject(Error ('Could not search for artist! Try logging back in by refreshing the page.')); }
      });
  }


  async generatePlaylist(artistNames: string[], playlistIDs: string[], title = generateTitle(artistNames)): Promise<string>{
    console.log('Title: ', title);
    console.log('Description: ', generateDescription(artistNames));
    const songList = await generateSongList(this.spotifyApi, playlistIDs).catch(err => Promise.reject(err));

    return await this.spotifyApi.createPlaylist(await getUsername(this.spotifyApi).catch(err => Promise.reject(err)),
      {name: title, public: false, description: generateDescription(artistNames)})
      .then(data => {
        if (songList.length > 0){
          this.spotifyApi.addTracksToPlaylist(data.id, songList)
            /*return Track Addition Error redirect*/
            .catch(err => {
              console.log(err);
              Promise.reject(Error ('Error adding Tracks to Playlist! Try submitting the playlist again.'));
            });
        }

        // return Playlist ID
        return data.id;
      })
      .catch(err => {
        /*return Playlist Creation Error redirect*/
        console.log(err);
        return Promise.reject(Error ('Error creating Playlist! Try submitting the playlist again.'));
      });
  }


  constructor() { }
}

/* Private Functions */
// tslint:disable-next-line:max-line-length
async function getThisIsPlaylistId(spotifyApi: SpotifyWebApiJs, artist: string): Promise<string>{
  return spotifyApi.searchPlaylists('This Is ' + artist, {limit: 1, offset: 0})
    .then(data => {
      if (data.playlists.items[0].owner.id !== 'spotify') {
        /*return Missing Artist Page Error redirect */ // better check in the beginning
        // tslint:disable-next-line:max-line-length
        return Promise.reject(Error('Artist does not have a \'This is\' Playlist! Try a different artist or check for typos in your input.'));
      }
      return data.playlists.items[0].id; // return Playlist ID
    })
    .catch(err => {
      /*return Artist Page Retrieval error redirect*/
      console.log(err);
      return Promise.reject(Error ('Could not find Artists Spotify Page! Try a different artist or check for typos in your input'));
    });
}



function generateTitle(artists: string[]): string{
    let playlistName = 'These are ';

    if (artists.length === 2) { playlistName += artists[0] + ' and ' + artists[1]; }
    else if (artists.length === 3) { playlistName += artists[0] + ', ' + artists[1] + ' and ' + artists[2]; }
    else { playlistName += artists[0] + ', ' + artists[1] + ' and others'; }

    return playlistName;
}

function generateDescription(artists: string[]): string{
    artists = prepArtistsForDescription(artists);

    let playlistDescription = 'This Playlist was auto-generated! ' + 'Artists are ' + artists[0];
    for (let i = 1; i < artists.length - 1; i++){
        playlistDescription += ', ' + artists[i];
    }
    playlistDescription += ' and ' + artists[artists.length - 1] + '.';

    return playlistDescription;
}

async function getUsername(spotifyApi: SpotifyWebApiJs): Promise<string>{
  return spotifyApi.getMe()
    .then(data => {
      return data.id;
    })
    .catch(err => {
      /*return User Fetch Error redirect*/
      console.log('Error in spotify-web.service.ts', err);
      return Promise.reject(Error ('Error fetching UserId! Try logging back in by refreshing the page.'));
    });
}

/* Sort artists and take Commas out of names to prevent confusion of delimiters. Eg 'Tyler, the creator' to 'Tyler the creator' */
function prepArtistsForDescription(artists: string[]): string[]{
    artists.sort();
    for (let artist of artists){ artist = artist.replace(/,/g, ''); } // remove all comments
    return artists;
}

async function generateSongList(spotifyApi: SpotifyWebApiJs, playlistIDs: string[],
                                nrOfSongs = 20): Promise<string[]> {
    let songList = [];

    // create song List from each artist's This Is playlist and merge them
    for (const pID of playlistIDs){
        songList = songList.concat(await extractTracksFromPlaylist(spotifyApi, pID, nrOfSongs)
            .catch(err => Promise.reject(err)));
    }
    return shuffleArray(songList);
}


async function extractTracksFromPlaylist(spotifyApi: SpotifyWebApiJs, playlistID: string,
                                         nrOfSongs: number): Promise<string[]>{
    const songURIs = [];

    return spotifyApi.getPlaylist(playlistID)
      .then(data => {
        // Transfer all Track URIs != null from Playlist to array
        for (const i of data.tracks.items) {
          if (i.track !== null) {
            songURIs.push(i.track.uri);
          }
        }

        // return filtered array filled with Track URIs
        return trimSongSelection(songURIs, nrOfSongs);
      })
      .catch(err => {
        /*return Playlist Retrieval Error redirect*/
        console.log(err);
        return Promise.reject(Error('Error retrieving a Playlist! Try logging back in by refreshing the page.'));
      });
}


function trimSongSelection(songList: string[], nrOfSongs = songList.length / 3): string[]{

    // No need to go through, if all will be returned anyway
    if (songList.length <= nrOfSongs) { return songList; }
    else{
        // Split Songs into categories based on popularity
        let hotSongs = songList.slice(0, songList.length * (1 / 6));
        let mediumSongs = songList.slice(hotSongs.length, hotSongs.length + songList.length * (1 / 4));
        let coldSongs = songList.slice(mediumSongs.length);

        // Shuffle Song pools once
        hotSongs = shuffleArray(hotSongs);
        mediumSongs = shuffleArray(mediumSongs);
        coldSongs = shuffleArray(coldSongs);

        songList = [];

      // tslint:disable-next-line:max-line-length
        // Randomly Select a song pool to add a song to the song list Hunger Games Style. Songs in hotter pools have a higher chance to be picked
        for (let i = 0; i < nrOfSongs; i++){
            const randomRealm = hotSongs.length * 3 + mediumSongs.length * 2 + coldSongs.length;
            const randomSelection = Math.random() * randomRealm;

          // tslint:disable-next-line:max-line-length
            // console.log('H:', hotSongs.length, ', M:', mediumSongs.length, ', C:', coldSongs.length, '. Realm: ', randomRealm, ', Selection: ', randomSelection)

            if (randomSelection <= hotSongs.length * 3) { songList.push(hotSongs.pop()); }
            else if (randomSelection <= hotSongs.length * 3 + mediumSongs.length * 2) { songList.push(mediumSongs.pop()); }
            else { songList.push(coldSongs.pop()); }
        }

        return songList;
    }
}

function shuffleArray(array: any[]): any[]{
    for (let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * i);
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}


