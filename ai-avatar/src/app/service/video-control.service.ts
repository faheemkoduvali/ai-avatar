import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoControlService {
  private playState = new BehaviorSubject<boolean>(false);
  playState$ = this.playState.asObservable();

  playVideo() {
    debugger;
    this.playState.next(true);
  }

  pauseVideo() {
    this.playState.next(false);
  }
}
