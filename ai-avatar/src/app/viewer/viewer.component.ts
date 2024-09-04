import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import videojs from 'video.js';
import { VideoControlService } from '../service/video-control.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent implements OnInit, OnDestroy {
  @ViewChild('videoPlayer', { static: true }) videoPlayer!: ElementRef<HTMLVideoElement>;
  player!: ReturnType<typeof videojs> | any;

  private playStateSubscription: Subscription | undefined;

  constructor(private videoControlService: VideoControlService, private cdr: ChangeDetectorRef
  ) { }


  ngOnInit() {
    // this.player = videojs(this.videoPlayer.nativeElement, {
    //   controls: true,
    //   autoplay: false,
    //   preload: false,
    //   fluid: true, // Make the player responsive to fill the screen
    //   controlBar: {
    //     playToggle: false,
    //     fullscreenToggle: true
    //   },
    //   tracks: [{
    //     kind: 'subtitles',
    //     src: 'http://localhost:3000/subtitles-en.vtt',
    //     srclang: 'en',
    //     label: 'English'
    //   },
    //   {
    //     kind: 'subtitles',
    //     src: 'http://localhost:3000/subtitles-fn.vtt',
    //     srclang: 'en',
    //     label: 'French'
    //   }]
    // });
    debugger;

    this.playStateSubscription = this.videoControlService.playState$.subscribe((shouldPlay: boolean) => {
      const video: HTMLVideoElement = this.videoPlayer.nativeElement;
      if (shouldPlay) {
        video.play().then(() => console.log('Viewer video playing')).catch(err => console.error('Error playing video', err));
      } else {
        video.pause();
        console.log('Viewer video paused');
      }
    });
  }



  // changeSubtitle(event: Event) {
  //   const video: HTMLVideoElement = this.videoPlayer.nativeElement;
  //   const selectedIndex = (event.target as HTMLSelectElement).value;

  //   // Disable all tracks
  //   for (let i = 0; i < video.textTracks.length; i++) {
  //     video.textTracks[i].mode = 'disabled';
  //   }

  //   // Enable the selected track
  //   if (selectedIndex !== 'off') {
  //     video.textTracks[parseInt(selectedIndex)].mode = 'showing';
  //   }
  // }
  switchSubtitleTrack(trackLabel: string) {
    debugger
    const video = this.player;
    const tracks = video.textTracks();

    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i] as TextTrack;
      if (track.label === trackLabel) {
        track.mode = 'showing';  // Show this track
      } else {
        track.mode = 'disabled'; // Disable other tracks
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
  }

}
