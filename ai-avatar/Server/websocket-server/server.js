const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow cross-origin requests
  },
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Broadcast play/pause events
  socket.on('video-control', (command) => {
    io.emit('video-control', command);
  });

  socket.on('seek-update', (currentTime) => {
    io.emit('seek-update', currentTime);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = 3005;
server.listen(PORT, () => {
  console.log(`WebSocket server running on http://192.168.0.111:${PORT}`);
});
