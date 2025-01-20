const socket = io();
const createChannelButton = document.getElementById('createChannelButton');
const channelsList = document.getElementById('channelsList');

// Créer un canal
createChannelButton.addEventListener('click', () => {
  const channelName = prompt('Nom du canal:');
  const color = prompt('Couleur du thème (hex):');
  socket.emit('createChannel', { channelName, color });
});

// Afficher la liste des canaux
socket.on('channelsList', (channels) => {
  channelsList.innerHTML = '';
  channels.forEach(channel => {
    const li = document.createElement('li');
    li.textContent = `${channel.name}`;
    li.style.backgroundColor = channel.color;
    li.addEventListener('click', () => {
      localStorage.setItem('channel', channel.name);
      window.location.href = 'chat.html';
    });
    channelsList.appendChild(li);
  });
});

// Charger les canaux au démarrage
socket.emit('getChannels');
