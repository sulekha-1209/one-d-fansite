import {
  Component,
  OnInit
} from '@angular/core';

import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

import {
  ArtistInfoService
} from './artist-info.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'one-d-fansite';
  token: any;

  oneDArtistId = '4AK6F7OLvEQ5QYCBNiQWHq';
  oneDData: any;
  mainPlaylistId = '37i9dQZF1DX6p4TJxzMRDe';
  mainPlaylistData: any;

  SOTDData: any;
  SOTDAlbumData: any;

  oneDAlbums: any;

  zaynArtistId = '5ZsFI1h6hIdQRw2ti0hz81';
  louisArtistId = '57WHJIHrjOE3iAxpihhMnp';
  niallArtistId = '1Hsdzj7Dlq2I7tHP7501T4';
  harryArtistId = '6KImCVD70vtIoJWnq6nGn3';
  liamArtistId = '5pUo3fmmHT8bhCyHE52hA6';

  genres: any;

  constructor(private http: HttpClient, private artistService: ArtistInfoService) {}

  ngOnInit() {
    this.load().then(() => {
      const token = this.token['access_token'];
      this.artistService.token = token;
      console.log(this.artistService.token);
      this.getOneDirectionInfo(token);
      this.getMainPlaylist(token);
      this.getOneDirectionAlbums(token);
    });
  }

  async load() {
    this.token = await this.artistService.requestToken();
    // console.log(tokendata['access_token']);
    // console.log(this.token);

  }


  async getOneDirectionInfo(token: String) {
    console.log('Getting 1d artist info');
    const oneD = await this.artistService.getArtist(this.oneDArtistId, token);
    console.log(oneD);
    this.oneDData = {};
    this.oneDData.name = oneD['name'];
    this.oneDData.spotifyLink = oneD['external_urls']['spotify'];
    this.oneDData.followers = oneD['followers']['total'];
    this.oneDData.genres = oneD['genres'];
    this.oneDData.popularity = oneD['popularity'];
    this.oneDData.images = oneD['images'];
    console.log(this.oneDData);
  }

  async getOneDirectionAlbums(token: String) {
    console.log('Getting 1d albums');
    const oneDAlbums = await this.getAlbums(this.oneDArtistId, token);
    this.oneDAlbums = oneDAlbums['items'].slice(0, 5);
    console.log(this.oneDAlbums);

  }

  async getMainPlaylist(token) {
    this.mainPlaylistData = await this.artistService.getPlayList(this.mainPlaylistId, token);
    console.log('So are we displaying the main playlist? ');
    console.log(this.mainPlaylistData);
    const link = this.mainPlaylistData['external_urls']['spotify'];
    const tracks = this.mainPlaylistData['tracks'];
    /* console.log(tracks);
    for (let i = 0; i < tracks.items.length; i++) {
      if (tracks.items[i].track.preview_url == null) {
        console.log('No preview');
        console.log(tracks.items[i]);
      }
    } */
    const songoftheday = this.getSongOfTheDay(tracks);
    console.log(link);
  }

  getSongOfTheDay(tracks) {
    const randomTrackNumber = this.getRandomTrackNumber(tracks.items.length);
    console.log('The track for the day is at' + randomTrackNumber);
    console.log(tracks.items[randomTrackNumber].track);

    this.SOTDData = tracks.items[randomTrackNumber].track;
    this.SOTDAlbumData = this.SOTDData.album;

    const SOTDPreviewUrl = this.SOTDData.preview_url;
    const music = new Audio(SOTDPreviewUrl);
    const sotdimgcard = document.getElementById('sotdImageDiv');
    const sotdimage = document.getElementById('sotdImage');
    const sotdplayOverlay = document.getElementById('sotdPlayOverlay');
    sotdimgcard.addEventListener('mouseover', function () {
      sotdimgcard.style.cursor = 'pointer';
      sotdimage.classList.add('glow-shadow');
      sotdimage.style.filter = 'brightness(0.5)';
      sotdplayOverlay.style.opacity = '1';
      if (SOTDPreviewUrl != null) {
        music.play();
      }
    }, false);
    sotdimgcard.addEventListener('mouseout', function () {
      if (SOTDPreviewUrl != null) {
        music.pause();
      }
      sotdimage.classList.remove('glow-shadow');
      sotdimage.style.filter = 'brightness(1)';
      sotdplayOverlay.style.opacity = '0';
    }, false);
    console.log(this.SOTDAlbumData);
  }

  getRandomTrackNumber(length) {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    console.log('Day of year: ' + day);

    const randomTrackNum = day % length;
    return randomTrackNum;
  }


  getAlbums(artistId: String, token: any) {
    const url = 'https://api.spotify.com/v1/artists/' + artistId + '/albums';
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

  getAlbumById(albumId: String, token: any) {
    const url = 'https://api.spotify.com/v1/albums/' + albumId;
    // console.log(token);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + token
      })
    };
    const albumReq = this.http.get(url, httpOptions);
    albumReq.subscribe((albumdata) => {
      // console.log(artistdata);
    });
    return albumReq.toPromise();

  }


  async getCleanedUpArtistInfo(artistId, token) {
    const artist = await this.artistService.getArtist(artistId, token);
    const artistData = {};
  }




}
