const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Stocker les informations des utilisateurs et des canaux
let users = []; // Liste des utilisateurs connectés
let channels = [{ name: 'Global', color: '#FFFFFF', creator: 'system', messages: [] }]; // Canaux avec un canal Global par défaut

// Middleware pour servir les fichiers statiques
app.use(express.static('public'));

// Connexion d'un utilisateur
io.on('connection', (socket) => {
  let currentUser = null;

  // L'utilisateur rejoint un canal
  socket.on('joinChannel', ({ username, channel }) => {
    currentUser = username;
    users.push(username); // Ajouter l'utilisateur à la liste
    socket.join(channel); // L'utilisateur rejoint le canal spécifié
    socket.emit('messageHistory', channels.find(c => c.name === channel).messages); // Envoie de l'historique du canal
    io.emit('userList', users); // Actualiser la liste des utilisateurs en ligne
  });

  // Envoi de message dans un canal
  socket.on('message', ({ username, message, channel }) => {
    const channelObj = channels.find((c) => c.name === channel);
    if (channelObj) {
      channelObj.messages.push({ username, message });
      io.to(channel).emit('message', { username, message }); // Diffusion du message à tous les utilisateurs du canal
    }
  });

  // Récupérer la liste des utilisateurs en ligne
  socket.on('getUsers', () => {
    socket.emit('userList', users); // Émettre la liste des utilisateurs à ce client
  });

  // Déconnexion d'un utilisateur
  socket.on('disconnect', () => {
    if (currentUser) {
      users = users.filter(user => user !== currentUser); // Supprimer l'utilisateur de la liste
      io.emit('userList', users); // Actualiser la liste des utilisateurs en ligne
    }
  });

  // Supprimer un canal (uniquement pour le créateur)
  socket.on('deleteChannel', (channelName) => {
    channels = channels.filter(c => c.name !== channelName); // Supprimer le canal
    io.emit('channelsList', channels); // Mettre à jour la liste des canaux
    io.to(channelName).emit('redirectToChannels'); // Rediriger les utilisateurs du canal supprimé
  });

  // Créer un canal
  socket.on('createChannel', ({ name, color, creator }) => {
    const newChannel = { name, color, creator, messages: [] };
    channels.push(newChannel);
    io.emit('channelsList', channels); // Mettre à jour la liste des canaux pour tous
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
