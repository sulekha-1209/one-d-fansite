import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges
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
  @Input() socials: any = {};
  artistData: any;
  topTracks: any;
  loading = true;
  error = false;

  showingTracks = false;

  currentTrackMusic = null;
  showProgressDiv = [];

  constructor(private artistService: ArtistInfoService, private domSanitizer: DomSanitizer) {}

  ngOnInit() {
    // Poll for the token to be ready rather than using an arbitrary sleep()
    this.waitForTokenThenLoad();
  }

  waitForTokenThenLoad() {
    if (this.artistService.token) {
      this.load(this.artistService.token);
    } else {
      // Token not ready yet — retry in 300ms
      setTimeout(() => this.waitForTokenThenLoad(), 300);
    }
  }

  async load(tok: String) {
    try {
      await this.getartistInfo(tok);
      await this.getTopTracks(tok);
    } catch (e) {
      console.error('Error loading artist info for ' + this.artistId, e);
      this.error = true;
    } finally {
      this.loading = false;
    }
  }

  async getartistInfo(token: String) {
    const artist = await this.artistService.getArtist(this.artistId, token);
    this.artistData = {};
    this.artistData.name = artist['name'];
    this.artistData.id = this.artistId;
    this.artistData.embedLink = this.domSanitizer.bypassSecurityTrustResourceUrl(
      'https://open.spotify.com/embed/artist/' + this.artistId + '?utm_source=generator'
    );
    this.artistData.socials = this.socials;
    this.artistData.spotifyLink = artist['external_urls']['spotify'];
    this.artistData.followers = artist['followers']['total'];
    this.artistData.genres = artist['genres'];
    this.artistData.popularity = artist['popularity'];
    this.artistData.images = artist['images'];
  }

  async getTopTracks(token: String) {
    const toptracks = await this.artistService.getTopTracksofArtist(this.artistId, token);
    this.topTracks = toptracks['tracks'].slice(0, 5);
  }

  showProgressDivfunc(trackname) {
    return this.showProgressDiv[trackname] || false;
  }

  playCurrentTrack(track) {
    if (track.preview_url != null) {
      this.currentTrackMusic = document.getElementById(track.name);
      if (this.currentTrackMusic) {
        this.currentTrackMusic.play();
        this.showProgressDiv[track.name] = true;
        const au = this.currentTrackMusic;
        au.addEventListener('timeupdate', function () {
          const progress = au.currentTime / au.duration * 100;
          const progressBar = document.getElementById(track.name + 'bar');
          if (progressBar) { progressBar.style.width = progress + '%'; }
        });
      }
    }
  }

  pauseCurrentTrack(track) {
    if (this.currentTrackMusic) {
      this.currentTrackMusic.pause();
      this.showProgressDiv[track.name] = false;
    }
  }

}
