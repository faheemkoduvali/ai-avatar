import { Component } from '@angular/core';
import { VideoControlService } from '../service/video-control.service';

@Component({
  selector: 'app-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.css']
})
export class ControllerComponent {

  constructor(private videoControlService: VideoControlService) {}

  playVideo() {
    this.videoControlService.playVideo();
  }

  pauseVideo() {
    this.videoControlService.pauseVideo();
  }
}
