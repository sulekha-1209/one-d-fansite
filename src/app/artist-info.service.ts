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
  clientId = 'c7996cd0ce934b838f1ac4f76a6958ec';
  clientSecret = 'c3ca22531128448d87c9478a052f57c5';
  token: any;

  requestToken() {
    const url = 'https://accounts.spotify.com/api/token';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(this.clientId + ':' + this.clientSecret)
      })
    };
    const body = 'grant_type=client_credentials';
    const tokenRequest = this.http.post(url, body, httpOptions);
    return tokenRequest.toPromise();
  }

  getArtist(artistId: String, token: any) {
    const url = 'https://api.spotify.com/v1/artists/' + artistId;
    console.log(token);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + token
      })
    };
    const artistReq = this.http.get(url, httpOptions);
    artistReq.subscribe((artistdata) => {
      console.log(artistdata);
    });
    return artistReq.toPromise();

  }

  getPlayList(playlistId: String, token: any) {
    const url = 'https://api.spotify.com/v1/playlists/' + playlistId;
    // console.log(token);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + token
      })
    };
    const playlistReq = this.http.get(url, httpOptions);
    return playlistReq.toPromise();

  }

  getTopTracksofArtist(artistId: String, token: any) {
    const url = 'https://api.spotify.com/v1/artists/' + artistId + '/top-tracks?market=es';
    console.log(token);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + token
      })
    };
    const artistTracksReq = this.http.get(url, httpOptions);
    artistTracksReq.subscribe((artisttrackdata) => {
      console.log(artisttrackdata);
    });
    return artistTracksReq.toPromise();

  }
}
