import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import videojs from 'video.js';
import { VideoControlService } from '../service/video-control.service';
import { Subscription } from 'rxjs';
import { HttpClient, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css'],
  standalone: true
})
export class ViewerComponent implements OnInit, OnDestroy {
  @ViewChild('videoPlayer', { static: true }) videoPlayer!: ElementRef<HTMLVideoElement>;
  player!: ReturnType<typeof videojs> | any;

  private playStateSubscription: Subscription | undefined;
  private seekUpdateSubscription!: Subscription;

  ipAddress: string = '';
  shouldPlay: boolean = false;
  subtitleTracks = [
    { label: 'English', lang: 'English' },
    { label: 'French', lang: 'French' },
    { label: 'Off', lang: 'off' }
  ];
  serverUrl: string = environment.serverUrl;

  selectedSubtitle = 'off';  // Default to 'off'
  constructor(private videoControlService: VideoControlService
  ) { }


  ngOnInit() {
    // this.loadIpAddress();
    this.player = videojs(this.videoPlayer.nativeElement, {
      controls: false,
      autoplay: false,
      fluid: true,
      bigPlayButton: false,
      tracks: [{
        kind: 'subtitles',
        src: 'assets/english.vtt',
        srclang: 'en',
        label: 'English'
      },
      {
        kind: 'subtitles',
        src: 'assets/french.vtt',
        srclang: 'en',
        label: 'French'
      },
      {
        kind: 'subtitles',
        src: 'assets/Arabic.vtt',
        srclang: 'ar',
        label: 'Arabic'
      },
      {
        kind: 'subtitles',
        src: 'assets/german.vtt',
        srclang: 'ge',
        label: 'German'
      },
      {
        kind: 'subtitles',
        src: 'assets/russian.vtt',
        srclang: 'rs',
        label: 'Russian'
      },
      {
        kind: 'subtitles',
        src: 'assets/chinese.vtt',
        srclang: 'cn',
        label: 'Chinese'
      },
      {
        kind: 'subtitles',
        src: 'assets/spanish.vtt',
        srclang: 'es',
        label: 'Spanish'
      }],
    });


    this.playStateSubscription = this.videoControlService.playState$.subscribe((shouldPlay: boolean) => {
      this.shouldPlay = shouldPlay;
      const video: HTMLVideoElement = this.videoPlayer.nativeElement;
      if (shouldPlay) {
        video.play().then(() => console.log('Viewer video playing')).catch(err => console.error('Error playing video', err));
      } else {
        video.pause();
        console.log('Viewer video paused');
      }
    });

    this.videoControlService.listenToSeekUpdates((currentTime: number) => {

      // Update the current time only if the difference is significant to avoid rapid seeks
      const currentViewerTime = this.player.currentTime();
      const video: HTMLVideoElement = this.videoPlayer.nativeElement;
      if (Math.abs(currentViewerTime - currentTime) > 0.5) {
        this.player.currentTime(currentTime);
        if (this.shouldPlay) {
          video.play().then(() => console.log('Viewer video playing')).catch(err => console.error('Error playing video', err));
        } else {
          video.pause();
          console.log('Viewer video paused');
        }
      }

    });
    // this.videoControlService.listenToControl((shouldPlay: boolean, seekTime: number) => {
    //   debugger;

    //   const currentViewerTime = this.player.currentTime();
    //   const video: HTMLVideoElement = this.videoPlayer.nativeElement;

    //   if (Math.abs(currentViewerTime - seekTime) > 0.5 && seekTime) {
    //     this.player.currentTime(seekTime);
    //   }

    //   if (shouldPlay) {
    //     video.play();
    //   } else {
    //     video.pause();
    //   }
    // });


    this.player.ready(() => {
      this.player.play = () => {
        console.log('Play functionality is disabled.');
      };
      this.player.pause = () => {
        console.log('Pause functionality is disabled.');
      };
    });

  }

  // loadIpAddress(): void {
  //   
  //   this.http.get('../../../../../projectSettings.json', { responseType: 'text' })  // Fetch as text
  //     .subscribe(
  //       data => this.ipAddress = data,  // Assign the IP address
  //       error => console.error('Error loading the IP address text file', error)
  //     );
  // }

  // switchSubtitleTrack(event: any) {
  //   const trackLabel = event.target.getAttribute('data-lang');  // Get the language from the data-lang attribute

  //   const video = this.player;
  //   const tracks = video.textTracks();

  //   for (let i = 0; i < tracks.length; i++) {
  //     const track = tracks[i] as TextTrack;
  //     if (trackLabel === 'off') {
  //       track.mode = 'disabled';  // Turn off subtitles if "off" is selected
  //     } else if (track.label === trackLabel) {
  //       track.mode = 'showing';  // Show the selected track
  //     } else {
  //       track.mode = 'disabled';  // Disable other tracks
  //     }
  //   }
  // }
  switchSubtitleTrack(selectedValue: string) {
    const trackLabel = selectedValue;  // Get the selected value from the dropdown
    const video = this.player;
    const tracks = video.textTracks();

    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i] as TextTrack;
      if (trackLabel === 'off') {
        track.mode = 'disabled';  // Turn off subtitles if "off" is selected
      } else if (track.label === trackLabel) {
        track.mode = 'showing';  // Show the selected track
      } else {
        track.mode = 'disabled';  // Disable other tracks
      }
    }
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
    }
    if (this.playStateSubscription) {
      this.playStateSubscription.unsubscribe();
    }
    if (this.seekUpdateSubscription) {
      this.seekUpdateSubscription.unsubscribe();
    }
  }

}
