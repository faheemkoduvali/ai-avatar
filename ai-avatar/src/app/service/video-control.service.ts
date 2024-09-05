import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Socket } from 'socket.io-client';
import io from 'socket.io-client';  // Default import for io


@Injectable({
  providedIn: 'root'
})
export class VideoControlService {
  private socket: ReturnType<typeof io>;
  private playStateSubject = new BehaviorSubject<boolean>(false);
  playState$ = this.playStateSubject.asObservable();
  // private seekerTimeSubject = new BehaviorSubject<number>(0);
  // seekerTime$ = this.seekerTimeSubject.asObservable();

  constructor() {
    // Connect to the WebSocket server
    this.socket = io('http://192.168.0.105:3005'); // Replace with your WebSocket server URL

    // Listen for WebSocket play/pause commands
    this.socket.on('video-control', (command: string) => {
      if (command === 'play') {
        this.playStateSubject.next(true);
      } else if (command === 'pause') {
        this.playStateSubject.next(false);
      }
    });

    // this.socket.on('seek-update', (currentTime: number) => {
    //   this.seekerTimeSubject.next(currentTime)
    // });
  }

  // Emit play or pause events to the WebSocket server
  emitPlayState(shouldPlay: boolean): void {
    const command = shouldPlay ? 'play' : 'pause';
    this.socket.emit('video-control', command);
  }

  emitCurrentTime(currentTime: number | undefined): void {
    this.socket.emit('seek-update', currentTime);
  }

  // Listen for seek time from the WebSocket
  listenToSeekUpdates(callback: (time: number) => void): void {
    debugger
    this.socket.on('seek-update', (currentTime: number) => {
      callback(currentTime);
    });
  }
}
