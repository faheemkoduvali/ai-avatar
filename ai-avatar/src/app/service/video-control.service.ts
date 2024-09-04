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

  constructor() {
    // Connect to the WebSocket server
    this.socket = io('http://172.18.200.117:3005'); // Replace with your WebSocket server URL

    // Listen for WebSocket play/pause commands
    this.socket.on('video-control', (command: string) => {
      if (command === 'play') {
        this.playStateSubject.next(true);
      } else if (command === 'pause') {
        this.playStateSubject.next(false);
      }
    });
  }

  // Emit play or pause events to the WebSocket server
  emitPlayState(shouldPlay: boolean): void {
    debugger;
    const command = shouldPlay ? 'play' : 'pause';
    this.socket.emit('video-control', command);
  }
}
