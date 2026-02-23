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
  mainPlaylistId = '7oQ95gJoLpibKztdyLF3nB';
  mainPlaylistData: any;

  SOTDData: any;
  SOTDAlbumData: any;
  SOTDHasPreview = false;

  oneDAlbums: any;

  zaynArtistId = '5ZsFI1h6hIdQRw2ti0hz81';
  louisArtistId = '57WHJIHrjOE3iAxpihhMnp';
  niallArtistId = '1Hsdzj7Dlq2I7tHP7501T4';
  harryArtistId = '6KImCVD70vtIoJWnq6nGn3';
  liamArtistId = '5pUo3fmmHT8bhCyHE52hA6';

  harrySocials = {
    'instagram': 'https://www.instagram.com/harrystyles/',
    'twitter': 'https://twitter.com/Harry_Styles',
    'youtube': 'https://www.youtube.com/channel/UCZFWPqqPkFlNwIxcpsLOwew',
    'itunes': 'https://music.apple.com/us/artist/harry-styles/471260289'
  };

  louisSocials = {
    'instagram': 'https://www.instagram.com/louist91/',
    'twitter': 'https://twitter.com/Louis_Tomlinson',
    'youtube': 'https://www.youtube.com/channel/UCBSxVE6JoMg0WXvpm47OS3g',
    'itunes': 'https://music.apple.com/us/artist/louis-tomlinson/471260295'
  };

  niallSocials = {
    'instagram': 'https://www.instagram.com/niallhoran/',
    'twitter': 'https://twitter.com/NiallOfficial',
    'youtube': 'https://www.youtube.com/channel/UCQcTX6rX7JhUpHg_T3STtoQ',
    'itunes': 'https://music.apple.com/us/artist/niall-horan/471260298'
  };

  liamSocials = {
    'instagram': 'https://www.instagram.com/liampayne/',
    'twitter': 'https://twitter.com/LiamPayne',
    'youtube': 'https://www.youtube.com/channel/UCcG6pdVejvmvWSDRJfmeB8A',
    'itunes': 'https://music.apple.com/us/artist/liam-payne/366710817'
  };

  zaynSocials = {
    'instagram': 'https://www.instagram.com/zayn/',
    'twitter': 'https://twitter.com/zaynmalik',
    'youtube': 'https://www.youtube.com/channel/UC3PdiRW5dUA4V70ueeR1eHA',
    'itunes': 'https://music.apple.com/us/artist/zayn/973181994'
  };

  fanArtItems = [];
  fanArtLoading = true;
  tumblrApiKey = 'hBv6t5KxEx36Kv9DMQWSO7bhMEIQHZ3G1yhBpbG7HVRQWMDz7S';

  constructor(private http: HttpClient, private artistService: ArtistInfoService) {}

  ngOnInit() {
    this.load().then(() => {
      const token = this.token['access_token'];
      this.artistService.token = token;
      this.getOneDirectionInfo(token);
      this.getMainPlaylist(token);
      this.getOneDirectionAlbums(token);
    }).catch(err => {
      console.error('Failed to load Spotify token.', err);
    });
    this.loadTumblrFanArt();
  }

  loadTumblrFanArt() {
    const tag = 'onedirectionfanart';
    const url = `https://corsproxy.io/?${encodeURIComponent(
      `https://api.tumblr.com/v2/tagged?tag=${tag}&api_key=${this.tumblrApiKey}&limit=12`
    )}`;
    this.http.get(url).subscribe((response: any) => {
      const posts = response.response || [];
      const artItems = [];
      for (const post of posts) {
        // Only use photo posts that have photos
        if (post.type === 'photo' && post.photos && post.photos.length > 0) {
          artItems.push({
            url: post.photos[0].original_size.url,
            alt: post.summary || 'One Direction fan art',
            credit: post.blog_name,
            link: post.post_url
          });
        }
        if (artItems.length >= 9) { break; }
      }
      this.fanArtItems = artItems;
      this.fanArtLoading = false;
    }, err => {
      console.error('Failed to load Tumblr fan art', err);
      this.fanArtLoading = false;
    });
  }

  async load() {
    this.token = await this.artistService.requestToken();
  }

  async getOneDirectionInfo(token: String) {
    const oneD = await this.artistService.getArtist(this.oneDArtistId, token);
    this.oneDData = {};
    this.oneDData.name = oneD['name'];
    this.oneDData.spotifyLink = oneD['external_urls']['spotify'];
    this.oneDData.followers = oneD['followers']['total'];
    this.oneDData.genres = oneD['genres'];
    this.oneDData.popularity = oneD['popularity'];
    this.oneDData.images = oneD['images'];
  }

  async getOneDirectionAlbums(token: String) {
    const oneDAlbums = await this.getAlbums(this.oneDArtistId, token);
    this.oneDAlbums = oneDAlbums['items'].slice(0, 5);
  }

  async getMainPlaylist(token) {
    this.mainPlaylistData = await this.artistService.getPlayList(this.mainPlaylistId, token);
    const tracks = this.mainPlaylistData['tracks'];
    this.getSongOfTheDay(tracks);
  }

  getSongOfTheDay(tracks) {
    const randomTrackNumber = this.getRandomTrackNumber(tracks.items.length);
    this.SOTDData = tracks.items[randomTrackNumber].track;
    this.SOTDAlbumData = this.SOTDData.album;

    const SOTDPreviewUrl = this.SOTDData.preview_url;
    this.SOTDHasPreview = SOTDPreviewUrl != null;
    const music = this.SOTDHasPreview ? new Audio(SOTDPreviewUrl) : null;

    const sotdimgcard = document.getElementById('sotdImageDiv');
    const sotdimage = document.getElementById('sotdImage');
    const sotdplayOverlay = document.getElementById('sotdPlayOverlay');

    sotdimgcard.addEventListener('mouseover', function () {
      sotdimgcard.style.cursor = 'pointer';
      sotdimage.classList.add('glow-shadow');
      sotdimage.style.filter = 'brightness(0.5)';
      sotdplayOverlay.style.opacity = '1';
      if (music) { music.play(); }
    }, false);

    sotdimgcard.addEventListener('mouseout', function () {
      if (music) { music.pause(); }
      sotdimage.classList.remove('glow-shadow');
      sotdimage.style.filter = 'brightness(1)';
      sotdplayOverlay.style.opacity = '0';
    }, false);
  }

  getRandomTrackNumber(length) {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    return day % length;
  }

  getAlbums(artistId: String, token: any) {
    const url = 'https://api.spotify.com/v1/artists/' + artistId + '/albums';
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };
    return this.http.get(url, httpOptions).toPromise();
  }
}
