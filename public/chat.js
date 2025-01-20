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

// Vérification si l'élément #channelName existe avant de le manipuler
if (channelNameElement) {
  channelNameElement.textContent = channel;
}

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
  const msgElement = document.createElement('div');
  msgElement.textContent = `${username}: ${message}`;
  chatBox.appendChild(msgElement);
}

// Envoi du message
sendButton.addEventListener('click', () => {
  const message = messageInput.value;
  if (message) {
    socket.emit('message', { username, message, channel });
    appendMessage(username, message); // Ajouter le message localement
    messageInput.value = ''; // Réinitialiser le champ de texte
  }
});

// Recevoir un message
socket.on('message', ({ username, message }) => {
  appendMessage(username, message);
});

// Liste des utilisateurs en ligne
usersButton.addEventListener('click', () => {
  socket.emit('getUsers');
});

socket.on('userList', (users) => {
  usersList.innerHTML = '';
  users.forEach(user => {
    const li = document.createElement('li');
    li.textContent = user;
    usersList.appendChild(li);
  });
});

// Paramètres
settingsButton.addEventListener('click', () => {
  settingsModal.style.display = 'block';
});

// Fermer le modal des paramètres
closeModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    settingsModal.style.display = 'none';
  });
});

// Sauvegarder les paramètres
document.getElementById('saveSettings').addEventListener('click', () => {
  const textColor = document.getElementById('textColor').value;
  const backgroundColor = document.getElementById('backgroundColor').value;
  const textSize = document.getElementById('textSize').value;

  document.body.style.color = textColor;
  document.body.style.backgroundColor = backgroundColor;
  document.body.style.fontSize = `${textSize}px`;

  localStorage.setItem('textColor', textColor);
  localStorage.setItem('backgroundColor', backgroundColor);
  localStorage.setItem('textSize', textSize);
  
  settingsModal.style.display = 'none';
});

// Déconnexion
disconnectButton.addEventListener('click', () => {
  localStorage.removeItem('username');
  window.location.href = 'index.html';
});
