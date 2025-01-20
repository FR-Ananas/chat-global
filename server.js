const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let users = [];
let channels = [{ name: 'Global', color: '#ffffff', creator: null }];

io.on('connection', (socket) => {
  let currentUser = null;

  socket.on('joinChannel', ({ username, channel }) => {
    currentUser = username;
    if (!users.includes(username)) {
      users.push(username);
    }
    socket.join(channel);

    const channelMessages = channels.find((c) => c.name === channel)?.messages || [];
    socket.emit('messageHistory', channelMessages);
  });

  socket.on('message', ({ username, message, channel }) => {
    const channelObj = channels.find((c) => c.name === channel);
    if (channelObj) {
      channelObj.messages = channelObj.messages || [];
      channelObj.messages.push({ username, message });
      io.to(channel).emit('message', { username, message });
    }
  });

  socket.on('createChannel', ({ name, color, creator }) => {
    if (channels.filter((c) => c.creator === creator).length < 2) {
      channels.push({ name, color, creator, messages: [] });
      io.emit('channelsList', channels);
    }
  });

  socket.on('deleteChannel', (channelName) => {
    channels = channels.filter((c) => c.name !== channelName);
    io.emit('channelsList', channels);
    io.to(channelName).emit('redirectToChannels');
  });

  socket.on('disconnect', () => {
    if (currentUser) {
      users = users.filter((u) => u !== currentUser);
      const userChannels = channels.filter((c) => c.creator === currentUser);
      userChannels.forEach((channel) => {
        io.to(channel.name).emit('redirectToChannels');
      });
      channels = channels.filter((c) => c.creator !== currentUser);
      io.emit('channelsList', channels);
    }
  });
});

app.use(express.static('public'));

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
