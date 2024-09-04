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
      preload: 'auto'
    });
  }

  // Called when the admin plays the video
  playVideo() {
    this.player.play();
    this.videoControlService.emitPlayState(true);  // Emit "play" to WebSocket
  }

  // Called when the admin pauses the video
  pauseVideo() {
    this.player.pause();
    this.videoControlService.emitPlayState(false);  // Emit "pause" to WebSocket
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
    }
  }
}
