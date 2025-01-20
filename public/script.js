const socket = io();
const username = localStorage.getItem('username');
const channel = localStorage.getItem('channel') || 'Global';
const chatBox = document.getElementById('chatBox');
const messageInput = document.getElementById('messageInput');
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

function appendMessage(sender, message) {
  const messageElement = document.createElement('div');
  messageElement.textContent = `${sender}: ${message}`;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

document.getElementById('sendMessage').addEventListener('click', () => {
  const message = messageInput.value.trim();
  if (message) {
    socket.emit('message', { username, message, channel });
    messageInput.value = '';
  }
});

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

document.getElementById('settings').addEventListener('click', () => {
  document.getElementById('settingsModal').classList.remove('hidden');
});

document.querySelectorAll('.closeModal').forEach((button) => {
  button.addEventListener('click', () => {
    button.closest('.modal').classList.add('hidden');
  });
});

document.getElementById('channels').addEventListener('click', () => {
  window.location.href = 'channels.html';
});

document.getElementById('disconnect').addEventListener('click', () => {
  socket.emit('disconnectUser', username);
  localStorage.clear();
  window.location.href = 'index.html';
});
