const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public')); // Serve static files from the public folder

const users = {};
const rooms = {}; // Keep track of rooms and their members

io.on('connection', (socket) => {
  console.log('Nouvel utilisateur connecté.');

  // Handle new user connection
  socket.on('newUser', (username) => {
    if (Object.values(users).some(user => user.username === username)) {
      socket.emit('userNotification', 'Ce pseudo est déjà pris. Veuillez en choisir un autre.', true);
      return;
    }

    users[socket.id] = { username, status: 'connected', room: null };
    socket.emit('userNotification', `Bienvenue ${username} !`);
    socket.broadcast.emit('userNotification', `${username} a rejoint le chat.`);
    io.emit('updateUsers', Object.values(users));
  });

  // Handle room joining
  socket.on('joinRoom', (room) => {
    const user = users[socket.id];
    if (!user) return;

    // Leave current room if any
    if (user.room) {
      socket.leave(user.room);
      rooms[user.room] = rooms[user.room].filter(id => id !== socket.id);
    }

    // Join the new room
    user.room = room;
    socket.join(room);
    rooms[room] = rooms[room] || [];
    rooms[room].push(socket.id);

    socket.emit('userNotification', `Vous avez rejoint le salon ${room}`);
    io.to(room).emit('userNotification', `${user.username} a rejoint le salon ${room}`);
  });

  // Handle messages
  socket.on('message', ({ message, room }) => {
    const user = users[socket.id];
    if (!user || !message.trim()) return;

    const targetRoom = room || user.room;
    if (targetRoom) {
      io.to(targetRoom).emit('message', { username: user.username, message });
    } else {
      socket.emit('userNotification', 'Vous devez rejoindre un salon pour envoyer des messages.');
    }
  });

  // Handle private messages
  socket.on('privateMessage', ({ to, message }) => {
    const sender = users[socket.id];
    if (!sender || !message.trim()) return;

    const recipientId = Object.keys(users).find(id => users[id].username === to);
    if (recipientId) {
      io.to(recipientId).emit('message', { username: `DM de ${sender.username}`, message });
      socket.emit('message', { username: `DM à ${to}`, message });
    } else {
      socket.emit('userNotification', 'Utilisateur introuvable.', true);
    }
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      const { username, room } = user;
      delete users[socket.id];
      if (room && rooms[room]) {
        rooms[room] = rooms[room].filter(id => id !== socket.id);
        io.to(room).emit('userNotification', `${username} a quitté le salon.`);
      }
      io.emit('updateUsers', Object.values(users));
    }
    console.log('Utilisateur déconnecté.');
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
