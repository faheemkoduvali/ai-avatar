const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'https://ps.aioman.org', // Allow specific origin
    methods: ['GET', 'POST'],
    credentials: true,  // If you need to support cookies/auth
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

app.get('/test', (req, res) => {
  res.send('Express server is running.');
});
const PORT = 3005;
server.listen(PORT, () => {
  console.log(`WebSocket server running on ${PORT}`);
});
