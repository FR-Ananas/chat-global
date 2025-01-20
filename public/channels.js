const socket = io();
const username = localStorage.getItem('username');
if (!username) {
  window.location.href = 'index.html';
}

const channelsList = document.getElementById('channelsList');
const createChannelButton = document.getElementById('createChannel');
const backToChatButton = document.getElementById('backToChat');
const createChannelModal = document.getElementById('createChannelModal');
const submitCreateChannelButton = document.getElementById('submitCreateChannel');
const newChannelNameInput = document.getElementById('newChannelName');
const newChannelColorInput = document.getElementById('newChannelColor');

// Récupérer la liste des canaux au moment de la connexion
socket.emit('getChannels');

socket.on('channelsList', (channels) => {
  channelsList.innerHTML = '';
  channels.forEach((channel) => {
    const li = document.createElement('li');
    li.textContent = channel.name;
    li.style.backgroundColor = channel.color;
    li.addEventListener('click', () => {
      localStorage.setItem('channel', channel.name);
      window.location.href = 'chat.html';
    });

    // Ajouter un bouton de suppression pour l'auteur du canal
    if (channel.creator === username) {
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'X';
      deleteButton.classList.add('deleteChannel');
      deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        socket.emit('deleteChannel', channel.name);
      });
      li.appendChild(deleteButton);
    }

    channelsList.appendChild(li);
  });
});

// Créer un nouveau canal
createChannelButton.addEventListener('click', () => {
  createChannelModal.classList.remove('hidden');
});

// Soumettre la création d'un canal
submitCreateChannelButton.addEventListener('click', () => {
  const channelName = newChannelNameInput.value.trim();
  const channelColor = newChannelColorInput.value;

  if (channelName) {
    socket.emit('createChannel', { name: channelName, color: channelColor, creator: username });
    newChannelNameInput.value = '';
    createChannelModal.classList.add('hidden');
  }
});

// Retourner à la page de chat
backToChatButton.addEventListener('click', () => {
  window.location.href = 'chat.html';
});

// Fermeture du modal de création de canal
document.querySelector('.closeModal').addEventListener('click', () => {
  createChannelModal.classList.add('hidden');
});

// Gérer la redirection vers les canaux après suppression
socket.on('redirectToChannels', () => {
  alert('Le canal a été supprimé.');
  window.location.href = 'channels.html';
});
