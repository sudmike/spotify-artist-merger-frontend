import { Injectable } from '@angular/core';
import SpotifyWebApi from 'spotify-web-api-js';
import SpotifyWebApiJs = SpotifyWebApi.SpotifyWebApiJs;

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
        console.log('Error in spotify-web.service.ts', err);
        return Promise.reject(Error ('Could not search for artist'));
        // return Promise.reject(err);
      });
  }


  async generatePlaylistAndFill(artists: string[], title = generateTitle(artists)): Promise<string|Error>{
    console.log('Title: ', title);
    console.log('Description: ', generateDescription(artists));
    const songList = await generateSongList(this.spotifyApi, artists).catch(err => Promise.reject(err)) as string[];

    return await this.spotifyApi.createPlaylist(await getUsername(this.spotifyApi).catch(err => Promise.reject(err)) as string,
      {name: title, public: false, description: generateDescription(artists)})
      .then(data => {
        if (songList.length > 0){
          this.spotifyApi.addTracksToPlaylist(data.id, songList)
            /*return Track Addition Error redirect*/
            .catch(err => {
              console.log('Error in spotify-web.service.ts', err);
              Promise.reject(Error ('Error adding Tracks to Playlist'));
            });
        }

        // return Playlist ID
        return data.id;
      })
      .catch(err => {
        /*return Playlist Creation Error redirect*/
        console.log('Error in spotify-web.service.ts', err);
        return Promise.reject(Error ('Error creating Playlist'));
      });
  }


  constructor() { }
}

/* Private Functions */
// tslint:disable-next-line:max-line-length
async function getThisIsPlaylistId(spotifyApi: SpotifyWebApiJs, artist: string, check: boolean = false): Promise<string|Error>{
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
    .catch(err => {
      /*return Artist Page Retrieval error redirect*/
      console.log('Error in spotify-web.service.ts', err);
      return Promise.reject(Error ('Could not find Artists Spotify Page'));
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


async function getUsername(spotifyApi: SpotifyWebApiJs): Promise<string|Error>{
  return spotifyApi.getMe()
    .then(data => {
      return data.id;
    })
    .catch(err => {
      /*return User Fetch Error redirect*/
      console.log('Error in spotify-web.service.ts', err);
      return Promise.reject(Error ('Error fetching UserId'));
    });
}


/* Sort artists and take Commas out of names to prevent confusion of delimiters. Eg 'Tyler, the creator' to 'Tyler the creator' */
function prepArtistsForDescription(artists: string[]): string[]{
    artists.sort();
    for (let artist of artists){ artist = artist.replace(/,/g, ''); } // remove all comments
    return artists;
}


async function generateSongList(spotifyApi: SpotifyWebApiJs, artists: string[],
                                nrOfSongs = 20): Promise<string[]|Error> {
    let songList = [];

    // create song List from each artist's This Is playlist and merge them
    for (const artist of artists){
        songList = songList.concat(await extractTracksOfArtist(spotifyApi, artist, nrOfSongs)
            .catch(err => Promise.reject(err)));
    }
    return shuffleArray(songList);
}


async function extractTracksOfArtist(spotifyApi: SpotifyWebApiJs, artist: string,
                                     nrOfSongs: number): Promise<string[]|Error>{
    const songURIs = [];

    // get the 'This is <artist>' playlist ID to then search for playlist
    return getThisIsPlaylistId(spotifyApi, artist)
        .then(playlistId => {
            // now get Playlist with all tracks
            return spotifyApi.getPlaylist(playlistId as string)
                .then(data => {
                  // Transfer all Track URIs != null from Playlist to array
                  for (const i of data.tracks.items){
                    if (i.track !== null) { songURIs.push(i.track.uri); }
                  }

                  // return filtered array filled with Track URIs
                  return trimSongSelection(songURIs, nrOfSongs);
                })
                .catch(err => {
                  /*return Playlist Retrieval Error redirect*/
                  console.log('Error in spotify-web.service.ts', err);
                  return Promise.reject(Error('Error retrieving a Playlist'));
                });
        })
        .catch(err => {
            // return rejection redirect of Function getThisIsPlaylistId
            return Promise.reject(err);
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


