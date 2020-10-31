import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
  ArtistInfoService
} from './../artist-info.service';


@Component({
  selector: 'app-artist-info',
  templateUrl: './artist-info.component.html',
  styleUrls: ['./artist-info.component.css']
})

export class ArtistInfoComponent implements OnInit {

  @Input() artistId: String = '6KImCVD70vtIoJWnq6nGn3';
  artistData: any;
  topTracks: any;

  showingTracks = false;

  currentTrackMusic = null;
  currentTrackDuration: any;
  currentTrackPosition: any;

  showProgressDiv = [];

  constructor(private artistService: ArtistInfoService, private domSanitizer : DomSanitizer) {}

  ngOnInit() {
    this.load();
  }

  async load() {
    const sleep = (milliseconds) => {
      return new Promise(resolve => setTimeout(resolve, milliseconds))
    };
    await sleep(1000);
    const tok = this.artistService.token;
    console.log(tok);
    this.getartistInfo(tok);
    this.getTopTracks(tok);
  }

  async getartistInfo(token: String) {
    console.log('Getting artist info');
    console.log(this.artistId);
    const artist = await this.artistService.getArtist(this.artistId, token);
    console.log(artist);
    this.artistData = {};
    this.artistData.name = artist['name'];
    this.artistData.id = this.artistId;
    const embedLink = this.domSanitizer.bypassSecurityTrustResourceUrl( 'https://open.spotify.com/embed/artist/' + this.artistId);
    this.artistData.embedLink = embedLink;
    this.artistData.spotifyLink = artist['external_urls']['spotify'];
    this.artistData.followers = artist['followers']['total'];
    this.artistData.genres = artist['genres'];
    this.artistData.popularity = artist['popularity'];
    this.artistData.images = artist['images'];
    console.log(this.artistData);
  }

  async getTopTracks(token: String) {
    console.log(token);
    const toptracks = await this.artistService.getTopTracksofArtist(this.artistId, token);
    this.topTracks = toptracks['tracks'].slice(0, 5);
    console.log('Top tracks');
    console.log(toptracks);
  }

  showProgressDivfunc(trackname) {
    if (this.showProgressDiv[trackname]) {
      return this.showProgressDiv[trackname];
    } else {
      return false;
    }
  }

  playCurrentTrack(track, currentdiv) {
    console.log(track);
    if (track.preview_url != null) {
      // this.currentTrackMusic = new Audio(track.preview_url);
      this.currentTrackMusic = document.getElementById(track.name);
      console.log(this.currentTrackMusic);
      this.currentTrackMusic.play();
      const au = this.currentTrackMusic;
      this.showProgressDiv[track.name] = true;
      au.addEventListener('timeupdate', function () {
        const progress = au.currentTime / au.duration * 100;
        const progressBarId = track.name + 'bar';
        const progressBar = document.getElementById(progressBarId);
        progressBar.style.width = progress + '%';

      });
    }

  }

  pauseCurrentTrack(track) {
    console.log(this.currentTrackMusic);
    this.currentTrackMusic.pause();
    const progressBarId = track.name + 'bar';
    const progressDiv = document.getElementById(track.name + 'progress');
    this.showProgressDiv[track.name] = false;
  }

}
