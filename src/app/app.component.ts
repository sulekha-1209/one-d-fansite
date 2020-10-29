import {
  Component,
  OnInit
} from '@angular/core';

import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'one-d-fansite';
  clientId = 'c7996cd0ce934b838f1ac4f76a6958ec';
  clientSecret = 'c3ca22531128448d87c9478a052f57c5';
  token: any;

  oneDArtistId = '4AK6F7OLvEQ5QYCBNiQWHq';
  oneDData: any;
  mainPlaylistId = '37i9dQZF1DX6p4TJxzMRDe';
  mainPlaylistData: any;

  genres: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.load();
  }

  async load() {
    this.token = await this.requestToken();
    // console.log(tokendata['access_token']);
    // console.log(this.token);
    const token = this.token['access_token'];
    // console.log(token);
    this.getOneDirectionInfo(token);
    this.getMainPlaylist(token);
  }

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

  async getOneDirectionInfo(token: String) {
    console.log('Getting 1d artist info');
    const oneD = await this.getArtist(this.oneDArtistId, token);
    this.oneDData = {};
    this.oneDData.name = oneD['name'];
    this.oneDData.spotifyLink = oneD['external_urls']['spotify'];
    this.oneDData.followers = oneD['followers']['total'];
    this.oneDData.genres = oneD['genres'];
    this.oneDData.popularity = oneD['popularity'];
    this.oneDData.images = oneD['images'];
    console.log(this.oneDData);
  }

  async getMainPlaylist(token) {
    this.mainPlaylistData = await this.getPlayList(this.mainPlaylistId, token);
    console.log('So are we displaying the main playlist? ');
    console.log(this.mainPlaylistData);
    const link = this.mainPlaylistData['external_urls']['spotify'];
    console.log(link);
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

  getArtist(artistId: String, token: any) {
    const url = 'https://api.spotify.com/v1/artists/' + artistId;
    // console.log(token);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + token
      })
    };
    const artistReq = this.http.get(url, httpOptions);
    artistReq.subscribe((artistdata) => {
      // console.log(artistdata);
    });
    return artistReq.toPromise();

  }

  async getCleanedUpArtistInfo(artistId, token) {
    const artist = await this.getArtist(artistId, token);
    const artistData = {};
  }

  /*getToken = async () => {

    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/x-www-form-urlencoded',
            'Authorization' : 'Basic ' + btoa(this.clientId + ':' + this.clientSecret)
        },
        body: 'grant_type=client_credentials'
    });
    const data = await result.json();
    console.log(data);
    return data['access_token'];
}

getGenres = async (token: string) => {
  console.log('So is the token getting passed here?');
  console.log(token);
  const result = await fetch('https://api.spotify.com/v1/playlists/37i9dQZF1DX6p4TJxzMRDe/tracks', {
      method: 'GET',
      headers: { 'Authorization' : 'Bearer ' + token}
  });

  const data = await result.json();
  return data.categories.items;
}*/

}
