const socket = io();
const username = localStorage.getItem('username');
const channel = localStorage.getItem('channel') || 'Global';
const chatBox = document.getElementById('chatBox');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendMessage');
const usersButton = document.getElementById('showUsers');
const usersList = document.getElementById('usersList');
const channelNameElement = document.getElementById('channelName');
const settingsButton = document.getElementById('settings');
const disconnectButton = document.getElementById('disconnect');
const settingsModal = document.getElementById('settingsModal');
const closeModalButtons = document.querySelectorAll('.closeModal');

channelNameElement.textContent = channel;

// Si l'utilisateur n'est pas connecté, redirige vers la page d'accueil
if (!username) {
  window.location.href = 'index.html';
}

// Rejoindre le canal
socket.emit('joinChannel', { username, channel });

// Afficher l'historique des messages du canal
socket.on('messageHistory', (messages) => {
  chatBox.innerHTML = ''; // Réinitialiser l'affichage des messages
  messages.forEach((message) => {
    appendMessage(message.username, message.message);
  });
});

// Ajouter un message au chat
function appendMessage(username, message) {
  const messageElement = document.createElement('div');
  messageElement.style.color = localStorage.getItem('textColor') || '#000000';
  messageElement.style.fontSize = `${localStorage.getItem('textSize') || 15}px`;
  messageElement.innerHTML = `<strong>${username}</strong>: ${message}`;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Envoi de message dans le chat
sendButton.addEventListener('click', () => {
  const message = messageInput.value.trim();
  if (message) {
    socket.emit('message', { username, message, channel });
    messageInput.value = ''; // Réinitialiser le champ de message
  }
});

// Obtenir la liste des utilisateurs dans le canal
usersButton.addEventListener('click', () => {
  socket.emit('getUsers');
});

// Afficher la liste des utilisateurs dans le pop-up
socket.on('userList', (users) => {
  usersList.innerHTML = ''; // Réinitialiser la liste
  users.forEach((user) => {
    const li = document.createElement('li');
    li.textContent = user;
    usersList.appendChild(li);
  });
});

// Gérer les paramètres d'apparence (couleur et taille du texte)
settingsButton.addEventListener('click', () => {
  settingsModal.classList.remove('hidden');
});

// Fermeture des modals
closeModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    settingsModal.classList.add('hidden');
  });
});

// Déconnexion de l'utilisateur
disconnectButton.addEventListener('click', () => {
  socket.emit('disconnectUser', username);
  localStorage.clear();
  window.location.href = 'index.html';
});
