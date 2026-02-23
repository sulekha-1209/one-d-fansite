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

  // Full 1D history from the wiki calendar — keyed as "MM-DD"
  // Sources: onedirection.fandom.com/wiki/Calendar
  oneDHistory: { [key: string]: { year: string, event: string }[] } = {
    '01-01': [{ year: '2012', event: 'Harry and Louis rang in the New Year together at their shared house.' }],
    '01-13': [{ year: '2012', event: '"One Thing" music video published on YouTube.' }, { year: '2013', event: 'One Direction travelled to Ghana to film "One Way Or Another (Teenage Kicks)" for Comic Relief.' }],
    '01-26': [{ year: '2012', event: 'Up All Night Tour concert in Belfast, UK.' }, { year: '2016', event: 'Music video for "History" was released.' }],
    '02-01': [{ year: '1994', event: '🎂 Harry Styles was born! Happy birthday, Harry!' }, { year: '2012', event: 'Scott Mills prank called Harry on his birthday ("Hello? Hello? Oh my god, hello?")' }, { year: '2015', event: 'Jimmy Fallon\'s "We Are the Champions" performance with Harry was released.' }],
    '02-14': [{ year: '2012', event: '"What Makes You Beautiful" released on iTunes in the US, reaching #11 on the charts.' }, { year: '2016', event: 'A 2011 tweet from Louis to Harry reached 2 million retweets.' }],
    '02-21': [{ year: '2012', event: 'One Direction won the BRIT Award for Best British Single for "What Makes You Beautiful".' }],
    '02-22': [{ year: '2011', event: 'X Factor Live Tour stopped at The O2 in Dublin, Ireland.' }, { year: '2017', event: 'Liam Payne accepted One Direction\'s BRIT Award for Best British Video on behalf of the band.' }],
    '02-23': [{ year: '2012', event: 'One Direction won Best British Video at the BRITs for "What Makes You Beautiful".' }],
    '02-24': [{ year: '2011', event: 'X Factor Live Tour played two shows at The O2, Dublin.' }, { year: '2012', event: 'One Direction joined Big Time Rush on their Better With U Tour in Chicago.' }, { year: '2013', event: 'As part of the Take Me Home Tour, 1D performed at The O2 Arena in London.' }, { year: '2016', event: 'Liam and Louis attended The BRIT Awards where 1D won Best Video for "Drag Me Down".' }],
    '02-25': [{ year: '2012', event: 'Take Me Home Tour tickets went on sale and sold out within hours.' }],
    '03-14': [{ year: '2012', event: 'One Direction stopped by The Elvis Duran Z100 Morning Show in New York.' }, { year: '2015', event: 'One Direction performed in Bangkok, Thailand as part of the On the Road Again Tour.' }],
    '03-21': [{ year: '2012', event: 'One Direction announced the North American leg of the Up All Night Tour.' }],
    '03-22': [{ year: '2012', event: '"What Makes You Beautiful" debuted at #1 on the UK Singles Chart.' }],
    '03-26': [{ year: '2010', event: 'Louis Tomlinson auditioned for The X Factor for the first time.' }, { year: '2011', event: 'X Factor Live Tour played at Metro Radio Arena in Newcastle.' }],
    '03-27': [{ year: '2010', event: 'Harry Styles auditioned for The X Factor for the first time.' }, { year: '2013', event: 'An alternate "Kiss You" music video was released worldwide.' }],
    '04-22': [{ year: '2011', event: 'One Direction performed at the Royal Variety Performance.' }],
    '05-01': [{ year: '2013', event: 'One Direction\'s "One Way or Another (Teenage Kicks)" reached #1 in the UK.' }],
    '06-23': [{ year: '2012', event: 'Up All Night: The Live Tour DVD was released.' }],
    '07-18': [{ year: '2010', event: '🎂 One Direction was formed as a group on The X Factor — the beginning of everything.' }],
    '07-23': [{ year: '2011', event: '"What Makes You Beautiful" was released as 1D\'s debut single.' }],
    '08-20': [{ year: '2012', event: '"Live While We\'re Young" was officially announced as a single.' }],
    '09-09': [{ year: '2013', event: 'One Direction won three VMAs including Best Pop Video for "Best Song Ever".' }],
    '09-13': [{ year: '2013', event: 'One Direction began recording sessions for Midnight Memories.' }],
    '10-04': [{ year: '2010', event: 'One Direction finished in third place on The X Factor — and the world changed forever.' }],
    '10-17': [{ year: '2014', event: '"Steal My Girl" was released as the lead single from FOUR.' }],
    '10-31': [{ year: '2010', event: '1D was safe with 11.79% of votes in Week 4 of X Factor.' }, { year: '2015', event: 'One Direction concluded the On the Road Again Tour at Motorpoint Arena in Sheffield.' }],
    '11-01': [{ year: '2011', event: '"What Makes You Beautiful" debuted at #1 in Australia.' }],
    '11-07': [{ year: '2011', event: 'Up All Night, One Direction\'s debut album, was released in the UK.' }],
    '11-13': [{ year: '2012', event: 'Take Me Home, 1D\'s second album, was released worldwide.' }],
    '11-17': [{ year: '2014', event: 'FOUR, One Direction\'s fourth studio album, was released worldwide, debuting at #1 in 18 countries.' }],
    '11-20': [{ year: '2015', event: 'Made in the A.M., 1D\'s final album before hiatus, was released.' }],
    '11-23': [{ year: '2013', event: 'Midnight Memories, 1D\'s third album, was released worldwide.' }],
    '12-16': [{ year: '2011', event: 'One Direction won four awards at the Teen Choice Awards.' }],
    '12-31': [{ year: '2011', event: 'Harry and Louis threw a housewarming/NYE party at their house.' }, { year: '2015', event: 'One Direction performed live on Dick Clark\'s New Year\'s Rockin\' Eve.' }],
  };

  memoryLaneItems: { date: string, year: string, event: string, isToday: boolean }[] = [];

  constructor(private http: HttpClient, private artistService: ArtistInfoService) {}

  ngOnInit() {
    this.buildMemoryLane();
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

  buildMemoryLane() {
    const today = new Date();
    const todayMonth = today.getMonth() + 1; // 1-12
    const todayDay = today.getDate();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Collect events for the next 30 days (wrapping across months)
    const items = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const key = `${m}-${day}`;
      const isToday = i === 0;
      const dateLabel = `${monthNames[d.getMonth()]} ${d.getDate()}`;

      if (this.oneDHistory[key]) {
        for (const entry of this.oneDHistory[key]) {
          items.push({
            date: dateLabel,
            year: entry.year,
            event: entry.event,
            isToday: isToday
          });
        }
      }
    }
    this.memoryLaneItems = items;
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
