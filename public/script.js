const socket = io();
const username = localStorage.getItem('username');
const channel = localStorage.getItem('channel') || 'Global';
const chatBox = document.getElementById('chatBox');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendMessage');
const channelNameElement = document.getElementById('channelName');
document.getElementById('channelName').textContent = channel;

if (!username) {
  window.location.href = 'index.html';
}

// Rejoindre le canal et récupérer l'historique des messages
socket.emit('joinChannel', { username, channel });

socket.on('message', (data) => {
  appendMessage(data.username, data.message);
});

socket.on('messageHistory', (messages) => {
  chatBox.innerHTML = ''; // Réinitialiser le chat
  messages.forEach((message) => {
    appendMessage(message.username, message.message);
  });
});

// Fonction pour afficher un message dans le chat
function appendMessage(username, message) {
  const messageElement = document.createElement('div');
  messageElement.style.color = localStorage.getItem('textColor') || '#000000';
  messageElement.style.fontSize = `${localStorage.getItem('textSize') || 15}px`;
  messageElement.innerHTML = `<strong>${username}</strong>: ${message}`;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Appliquer les paramètres d'apparence
function applySettings() {
  const textColor = localStorage.getItem('textColor') || '#000000';
  const bgColor = localStorage.getItem('bgColor') || '#ffffff';
  const textSize = localStorage.getItem('textSize') || '15';

  document.documentElement.style.setProperty('--text-color', textColor);
  document.documentElement.style.setProperty('--bg-color', bgColor);
  document.documentElement.style.setProperty('--text-size', `${textSize}px`);

  // Appliquer à tous les messages
  const messages = document.querySelectorAll('#chatBox div');
  messages.forEach((msg) => {
    msg.style.color = textColor;
    msg.style.fontSize = `${textSize}px`;
  });
}

// Appliquer les paramètres dès le chargement
applySettings();

// Envoi de messages
sendButton.addEventListener('click', () => {
  const message = messageInput.value.trim();
  if (message) {
    socket.emit('message', { username, message, channel });
    messageInput.value = '';
  }
});

// Liste des utilisateurs connectés
document.getElementById('showUsers').addEventListener('click', () => {
  socket.emit('getUsers', channel);
  document.getElementById('usersModal').classList.remove('hidden');
});

socket.on('userList', (users) => {
  const usersList = document.getElementById('usersList');
  usersList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.textContent = user;
    usersList.appendChild(li);
  });
});

// Ouverture des paramètres
document.getElementById('settings').addEventListener('click', () => {
  document.getElementById('settingsModal').classList.remove('hidden');
});

// Fermeture des modals
document.querySelectorAll('.closeModal').forEach((button) => {
  button.addEventListener('click', () => {
    button.closest('.modal').classList.add('hidden');
  });
});

// Redirection vers la page des canaux
document.getElementById('channels').addEventListener('click', () => {
  window.location.href = 'channels.html';
});

// Déconnexion
document.getElementById('disconnect').addEventListener('click', () => {
  socket.emit('disconnectUser', username);
  localStorage.clear();
  window.location.href = 'index.html';
});

// Gestion des paramètres
document.getElementById('textColor').addEventListener('input', (e) => {
  const color = e.target.value;
  localStorage.setItem('textColor', color);
  applySettings();
});

document.getElementById('bgColor').addEventListener('input', (e) => {
  const color = e.target.value;
  localStorage.setItem('bgColor', color);
  applySettings();
});

document.getElementById('textSize').addEventListener('change', (e) => {
  const size = e.target.value;
  localStorage.setItem('textSize', size);
  applySettings();
});
