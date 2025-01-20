const socket = io();
const createChannelButton = document.getElementById('createChannelButton');
const channelsList = document.getElementById('channelsList');

// Créer un canal
createChannelButton.addEventListener('click', () => {
  const channelName = prompt('Nom du canal:');
  const color = prompt('Couleur du thème du canal:');
  if (channelName && color) {
    socket.emit('createChannel', { name: channelName, color: color, creator: 'user' });
  }
});

// Afficher la liste des canaux
socket.on('channelsList', (channels) => {
  channelsList.innerHTML = '';
  channels.forEach(channel => {
    const li = document.createElement('li');
    li.textContent = `${channel.name} - Créé par ${channel.creator}`;
    li.style.color = channel.color;
    li.addEventListener('click', () => {
      localStorage.setItem('channel', channel.name);
      window.location.href = 'chat.html';
    });
    channelsList.appendChild(li);
  });
});
