import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Socket } from 'socket.io-client';
import io from 'socket.io-client';  // Default import for io
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VideoControlService {
  private socket: ReturnType<typeof io>;
  private playStateSubject = new BehaviorSubject<boolean>(false);
  playState$ = this.playStateSubject.asObservable();
  // private seekerTimeSubject = new BehaviorSubject<number>(0);
  // seekerTime$ = this.seekerTimeSubject.asObservable();

  data:any = {
    shouldPlay: false,
    seekTime: 0
  }

  constructor() {
    // Connect to the WebSocket server
    this.socket = io('https://ws.aioman.org', { withCredentials: true,  }); // Replace with your WebSocket server URL

    // Listen for WebSocket play/pause commands
    this.socket.on('video-control', (shouldPlay: boolean) => {
      this.playStateSubject.next(shouldPlay);
    });
  }

  // Emit play or pause events to the WebSocket server
  emitPlayState(shouldPlay: boolean): void {
    const command = shouldPlay ? 'play' : 'pause';
    this.socket.emit('video-control', shouldPlay);
  }

  emitCurrentTime(seekTime: number | undefined): void {
    this.socket.emit('seek-update', seekTime);
  }

  // Listen for seek time from the WebSocket
  listenToSeekUpdates(callback: (time: number) => void): void {
    this.socket.on('seek-update', (currentTime: number) => {
      callback(currentTime);
    });
  }
  
}
