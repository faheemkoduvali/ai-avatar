import { Component, ElementRef, ViewChild } from '@angular/core';
import { VideoControlService } from '../service/video-control.service';
import videojs from 'video.js';

@Component({
  selector: 'app-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.css']
})
export class ControllerComponent {

  @ViewChild('videoPlayer', { static: true }) videoPlayer!: ElementRef<HTMLVideoElement>;
  player!: ReturnType<typeof videojs>;

  constructor(private videoControlService: VideoControlService) {}

  ngOnInit(): void {
    // Initialize Video.js player
    this.player = videojs(this.videoPlayer.nativeElement, {
      controls: true,
      autoplay: false,
      preload: 'auto',
      controlBar: {
        fullscreenToggle: true, // Keep fullscreen toggle
        playToggle: true, // Show play/pause button
        currentTimeDisplay: true, // Show current time
        durationDisplay: true, // Show duration
        progressControl: true, // Show progress bar
      },
      fluid: true 
    });
    this.player.on('play', () => {
      const video = this.player;
      video.play();
      this.videoControlService.emitPlayState(true);  // Emit "play" to WebSocket
    });

    this.player.on('pause', () => {
      this.player.pause();
      this.videoControlService.emitPlayState(false);  // Emit "pause" to WebSocket
    });

    this.player.on('timeupdate', () => {
      const currentTime = this.player.currentTime();
      this.videoControlService.emitCurrentTime(currentTime);
    });
  }


  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
    }
  }
}
