const socket = io();
const username = localStorage.getItem('username');
if (!username) {
  window.location.href = 'index.html';
}

const channelsList = document.getElementById('channelsList');
const createChannelButton = document.getElementById('createChannel');
const backToChatButton = document.getElementById('backToChat');

// Récupérer la liste des canaux au moment de la connexion
socket.emit('getChannels');

socket.on('channelsList', (channels) => {
  channelsList.innerHTML = '';
  channels.forEach((channel) => {
    const li = document.createElement('li');
    li.textContent = channel.name;
    li.style.backgroundColor = channel.color;

    // Ajouter un bouton de suppression pour l'auteur du canal
    if (channel.creator === username) {
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'X';
      deleteButton.classList.add('deleteChannel');
      deleteButton.addEventListener('click', () => {
        socket.emit('deleteChannel', channel.name);
      });
      li.appendChild(deleteButton);
    }

    li.addEventListener('click', () => {
      localStorage.setItem('channel', channel.name);
      window.location.href = 'chat.html';
    });

    channelsList.appendChild(li);
  });
});

// Créer un nouveau canal
createChannelButton.addEventListener('click', () => {
  const channelName = document.getElementById('newChannelName').value.trim();
  const channelColor = document.getElementById('newChannelColor').value;

  if (channelName) {
    socket.emit('createChannel', { name: channelName, color: channelColor, creator: username });
    document.getElementById('newChannelName').value = '';
  }
});

// Retourner à la page de chat
backToChatButton.addEventListener('click', () => {
  window.location.href = 'chat.html';
});

// Gérer la redirection vers les canaux après suppression
socket.on('redirectToChannels', () => {
  alert('The channel has been deleted.');
  window.location.href = 'channels.html';
});
