import { Component, ElementRef, ViewChild } from '@angular/core';
import { VideoControlService } from '../service/video-control.service';
import videojs from 'video.js';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.css']
})
export class ControllerComponent {

  @ViewChild('videoPlayer', { static: true }) videoPlayer!: ElementRef<HTMLVideoElement>;
  player!: ReturnType<typeof videojs> | any;

  private intervalId: any;
  isPlaying: boolean = false;
  serverUrl: string = environment.serverUrl;
  videoUrl: string = ''

  constructor(private videoControlService: VideoControlService) { }

  ngOnInit(): void {
    // Initialize Video.js player
    this.player = videojs(this.videoPlayer.nativeElement, {
      controls: true,
      autoplay: false,
      preload: 'auto',
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
      controlBar: {
        fullscreenToggle: true, // Keep fullscreen toggle
        playToggle: true, // Show play/pause button
        currentTimeDisplay: true, // Show current time
        durationDisplay: true, // Show duration
        progressControl: true, // Show progress bar
        subsCapsButton: false, // Remove the CC button for subtitles/captions

      },
      fluid: true
    });
    this.player.on('play', () => {
      const video = this.player;
      video.play();
      this.isPlaying = true;
      const currentTime = this.player.currentTime();
      this.videoControlService.emitPlayState(true);
    });

    this.player.on('pause', () => {
      this.player.pause();
      this.isPlaying = false;
      const currentTime = this.player.currentTime();
      this.videoControlService.emitPlayState(false);
    });
    this.player.load();
    this.startInterval();
  }

  ngAfterViewInit() {
    this.videoPlayer.nativeElement.src = this.videoUrl;
    this.videoPlayer.nativeElement.load();
  }

  private startInterval() {
    this.intervalId = setInterval(() => {
      this.updateSeekerTime();
    }, 500); // 2000 milliseconds = 2 seconds
  }

  private stopInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private updateSeekerTime() {
    const currentTime = this.player.currentTime();
    this.videoControlService.emitCurrentTime(currentTime);
    this.videoControlService.emitPlayState(this.isPlaying);
  }
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
    this.stopInterval();
  }
}
