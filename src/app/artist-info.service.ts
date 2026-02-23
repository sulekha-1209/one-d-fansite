import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ArtistInfoService {

  constructor(private http: HttpClient) { }

  // NOTE: For a production app, move token fetching to a backend proxy.
  // The Client Credentials flow is blocked by CORS from the browser directly,
  // so we use a CORS proxy to relay the request to Spotify's token endpoint.
  clientId = 'c7996cd0ce934b838f1ac4f76a6958ec';
  clientSecret = 'c3ca22531128448d87c9478a052f57c5';
  token: any;

  requestToken() {
    // allorigins.win proxies the request and adds CORS headers, allowing browser-side Client Credentials flow
    const spotifyTokenUrl = 'https://accounts.spotify.com/api/token';
    const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(spotifyTokenUrl);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(this.clientId + ':' + this.clientSecret)
      })
    };
    const body = 'grant_type=client_credentials';
    const tokenRequest = this.http.post(proxyUrl, body, httpOptions);
    return tokenRequest.toPromise();
  }

  getArtist(artistId: String, token: any) {
    const url = 'https://api.spotify.com/v1/artists/' + artistId;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };
    const artistReq = this.http.get(url, httpOptions);
    return artistReq.toPromise();
  }

  getPlayList(playlistId: String, token: any) {
    const url = 'https://api.spotify.com/v1/playlists/' + playlistId;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };
    const playlistReq = this.http.get(url, httpOptions);
    return playlistReq.toPromise();
  }

  getTopTracksofArtist(artistId: String, token: any) {
    const url = 'https://api.spotify.com/v1/artists/' + artistId + '/top-tracks?market=US';
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };
    const artistTracksReq = this.http.get(url, httpOptions);
    return artistTracksReq.toPromise();
  }
}
